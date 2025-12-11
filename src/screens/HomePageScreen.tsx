import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import Storage
import { useFocusEffect } from '@react-navigation/native'; // Import Focus Hook

// --- 1. ENHANCED DATA TYPES ---
interface UserStats {
  pokemonImageUri: string;
  totalCaught: number;
  pokedexCount: number;
  currentPoints: number;
  pointsToNextLevel: number;
  trainerName: string;
  trainerLevel: number;
  streakDays: number;
  kilometersWalked: number;
}

interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string;
}

interface Mission {
  id: number;
  title: string;
  progress: number;
  goal: number;
  reward: string;
  icon: string;
  color: string;
}

// Feed Post Interface matching your FeedScreen
interface FeedPost {
  id: string; // Changed to string to match FeedScreen
  username: string;
  handle?: string;
  content: string;
  imageUrl?: string;
  timestamp: number; // Changed to number to match FeedScreen
  likes: number;
  trainerClass?: string;
  isStatic?: boolean;
}

// --- CONSTANTS ---
const STORAGE_KEY = '@pokedex_feed_v4'; // MUST MATCH FEED SCREEN KEY
const { width } = Dimensions.get('window');
const TYPE_COLORS: { [key: string]: string } = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", steel: "#B7B7CE", fairy: "#D685AD",
};

// --- STATIC DATA FOR FEED (Fallback if empty) ---
const INITIAL_STATIC_POSTS: FeedPost[] = [
  {
    id: 'static-1',
    username: 'Professor Oak',
    handle: '@kanto_research', 
    content: 'Alert: Reports of a Shiny Gyarados at the Lake of Rage! 🔴',
    timestamp: Date.now() - 3600000, 
    likes: 5420,
    imageUrl: 'https://media.giphy.com/media/ydU6Wf0rCqO52/giphy.gif',
    isStatic: true,
    trainerClass: 'Professor'
  },
  {
    id: 'static-2',
    username: 'Cynthia',
    handle: '@sinnoh_champ', 
    content: 'Garchomp is restless today. I sense a distortion nearby.',
    timestamp: Date.now() - 7200000, 
    likes: 8900,
    imageUrl: 'https://img.pokemondb.net/artwork/large/garchomp.jpg',
    isStatic: true,
    trainerClass: 'Champion'
  }
];

export default function HomePageScreen({ navigation }: any) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [nearYouList, setNearYouList] = useState<Pokemon[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]); 
  const [greeting, setGreeting] = useState("Welcome");

  // --- LOAD DATA ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Simulate fetching user stats
    setTimeout(() => {
      setUserStats({
        pokemonImageUri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 
        totalCaught: 142,         
        pokedexCount: 300,
        currentPoints: 2450,      
        pointsToNextLevel: 3000,
        trainerName: "WPlayer", 
        trainerLevel: 12,
        streakDays: 5,            
        kilometersWalked: 12.4    
      });

      setMissions([
        { id: 1, title: 'Catch 5 Fire-type Pokémon', progress: 3, goal: 5, reward: '500 XP', icon: 'flame', color: '#EE8130' },
        { id: 2, title: 'Walk 5km', progress: 2.4, goal: 5.0, reward: '1x Incubator', icon: 'walk', color: '#2E7D32' },
      ]);
    }, 1000);

    fetchNearYouPokemon();
  }, []);

  // --- REAL TIME FEED SYNC ---
  // This runs every time you look at the screen
  useFocusEffect(
    useCallback(() => {
      const fetchFeed = async () => {
        try {
          const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
          if (storedPosts) {
            const parsed = JSON.parse(storedPosts);
            // Merge static posts with user posts (newest first)
            setFeedPosts([...INITIAL_STATIC_POSTS, ...parsed]);
          } else {
            setFeedPosts(INITIAL_STATIC_POSTS);
          }
        } catch (e) {
          console.error("Failed to sync feed", e);
        }
      };
      fetchFeed();
    }, [])
  );

  const fetchNearYouPokemon = async () => {
    try {
      const randomOffset = Math.floor(Math.random() * 200);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=${randomOffset}`);
      const data = await response.json();

      const detailedList: Pokemon[] = await Promise.all(
        data.results.map(async (p: any) => {
          const res = await fetch(p.url);
          const details = await res.json();
          return {
            id: details.id,
            name: details.name,
            image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
            type: details.types[0].type.name
          };
        })
      );
      setNearYouList(detailedList);
    } catch (error) {
      console.error("Failed to fetch near you", error);
    }
  };

  // --- SUB-COMPONENTS ---

  const ActiveBonusBar = () => (
    <View style={styles.bonusContainer}>
      <View style={[styles.bonusItem, { backgroundColor: '#E3F2FD' }]}>
        <Ionicons name="flash" size={16} color="#2196F3" />
        <Text style={[styles.bonusText, { color: '#1565C0' }]}>2x XP Active</Text>
      </View>
      <View style={[styles.bonusItem, { backgroundColor: '#FFF3E0' }]}>
        <Ionicons name="egg" size={16} color="#FF9800" />
        <Text style={[styles.bonusText, { color: '#EF6C00' }]}>1/2 Hatch Distance</Text>
      </View>
    </View>
  );

  // --- FEED POST CARD (Updated to handle Real Data) ---
  const FeedCard = ({ item }: { item: FeedPost }) => {
    // Helper to format time relative to now
    const timeAgo = (timestamp: number) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    };

    return (
      <View style={styles.feedCard}>
        {/* Feed Header */}
        <View style={styles.feedHeader}>
          {/* Avatar based on logic */}
          <View style={styles.feedAvatarContainer}>
            {item.isStatic ? (
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1024px-Pok%C3%A9_Ball_icon.svg.png' }} 
                  style={{ width: 24, height: 24 }} 
                />
            ) : (
                <Ionicons name="person" size={20} color="#555" />
            )}
          </View>
          
          <View style={{flex: 1}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={styles.feedUsername} numberOfLines={1}>{item.username}</Text>
              {item.isStatic && <Ionicons name="checkmark-circle" size={14} color="#2196F3" style={{marginLeft: 4}}/>}
            </View>
            <Text style={styles.feedTime}>{timeAgo(item.timestamp)}</Text>
          </View>
        </View>

        {/* Feed Content */}
        <Text style={styles.feedContent} numberOfLines={3}>{item.content}</Text>
        
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.feedImage} resizeMode="cover" />
        )}

        {/* Feed Footer */}
        <View style={styles.feedFooter}>
          <View style={styles.interactionRow}>
            <Ionicons name="heart-outline" size={18} color="#555" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </View>
          <View style={styles.interactionRow}>
            <Ionicons name="chatbubble-outline" size={18} color="#555" />
            <Text style={styles.interactionText}>{item.isStatic ? 45 : 0}</Text>
          </View>
        </View>
      </View>
    );
  };

  const StatItem = ({ icon, value, label, color }: any) => (
    <View style={styles.statItem}>
      <View style={[styles.statIconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const NearYouCard = ({ item }: { item: Pokemon }) => (
    <View style={styles.nearYouCard}>
      <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[item.type] || '#777' }]} />
      <Image source={{ uri: item.image }} style={styles.nearYouImage} />
      <Text style={styles.nearYouName}>{item.name}</Text>
      <Text style={styles.nearYouDistance}>{Math.floor(Math.random() * 500)}m away</Text>
    </View>
  );

  const MissionItem = ({ item }: { item: Mission }) => {
    const percent = Math.min((item.progress / item.goal) * 100, 100);
    const isComplete = item.progress >= item.goal;
    
    return (
      <View style={styles.missionCard}>
         <View style={[styles.missionIcon, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={24} color={item.color} />
         </View>
         <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.missionTitle}>{item.title}</Text>
              {isComplete && <Ionicons name="checkmark-circle" size={18} color="green" />}
            </View>
            <View style={styles.missionProgressBg}>
                <View style={[styles.missionProgressFill, { width: `${percent}%`, backgroundColor: item.color }]} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
               <Text style={styles.missionStats}>{item.progress} / {item.goal}</Text>
               <Text style={[styles.missionReward, { color: isComplete ? 'green' : '#888' }]}>
                  {isComplete ? 'Claim Reward' : `Reward: ${item.reward}`}
               </Text>
            </View>
         </View>
      </View>
    )
  }

  if (!userStats) return <View style={styles.loadingContainer}><Text>Syncing Pokedex...</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* --- HEADER BACKGROUND --- */}
      <View style={styles.greenHeader}>
         <Image 
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.png' }} 
            style={styles.headerBgImage} 
            blurRadius={2}
         />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>{greeting},</Text>
            <Text style={styles.trainerName}>{userStats.trainerName}</Text>
          </View>
          <View style={styles.profileImageContainer}>
             <Image source={{ uri: userStats.pokemonImageUri }} style={styles.profileImage} />
             <View style={styles.levelBadge}>
               <Text style={styles.levelText}>{userStats.trainerLevel}</Text>
             </View>
          </View>
        </View>

        {/* --- MAIN DASHBOARD CARD --- */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Hunter Status</Text>
            <TouchableOpacity onPress={() => Alert.alert("Detailed Stats", "Coming soon!")}>
              <Ionicons name="stats-chart" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 5}}>
               <Text style={styles.xpLabel}>Level Progress</Text>
               <Text style={styles.xpValues}>{userStats.currentPoints} / {userStats.pointsToNextLevel} XP</Text>
            </View>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${(userStats.currentPoints/userStats.pointsToNextLevel)*100}%` }]} />
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatItem icon="cube-outline" value={userStats.totalCaught} label="Caught" color="#FF9800" />
            <StatItem icon="flame-outline" value={`${userStats.streakDays} Days`} label="Streak" color="#F44336" />
            <StatItem icon="walk-outline" value={`${userStats.kilometersWalked}km`} label="Walked" color="#2196F3" />
          </View>
        </View>

        {/* --- ACTIVE BONUSES --- */}
        <ActiveBonusBar />

        {/* --- HUNT BUTTON --- */}
        <TouchableOpacity style={styles.huntButton} activeOpacity={0.9} onPress={() => navigation.navigate('Hunt')}>
          <View style={styles.huntContent}>
             <View>
                <Text style={styles.huntTitle}>Hunt Now</Text>
                <Text style={styles.huntSubtitle}>Track wild Pokémon using AR</Text>
             </View>
             <Ionicons name="scan-circle" size={48} color="white" />
          </View>
        </TouchableOpacity>

        {/* --- POKEMON OF THE DAY --- */}
        <View style={styles.potdContainer}>
           <View style={styles.potdTextContainer}>
              <Text style={styles.potdLabel}>POKÉMON OF THE DAY</Text>
              <Text style={styles.potdName}>Snorlax</Text>
              <Text style={styles.potdSub}>Spawn Rate: +15% today</Text>
           </View>
           <Image 
              source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' }}
              style={styles.potdImage}
           />
        </View>

        {/* --- NEAR YOU SECTION --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near You</Text>
            <TouchableOpacity onPress={() => fetchNearYouPokemon()}>
              <Ionicons name="refresh-circle" size={24} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <FlatList 
            data={nearYouList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <NearYouCard item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          />
        </View>

        {/* --- DAILY RESEARCH --- */}
        <View style={styles.sectionContainer}>
           <Text style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 15 }]}>Daily Research</Text>
           {missions.map((mission) => (
             <MissionItem key={mission.id} item={mission} />
           ))}
        </View>

        {/* --- COMMUNITY PULSE (SYNCED FEED) --- */}
        <View style={styles.sectionContainer}>
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Community Pulse</Text>
             <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
               <Text style={{color: '#2E7D32', fontWeight: '600'}}>See Feed</Text>
             </TouchableOpacity>
           </View>
           
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}>
              {feedPosts.map((post) => (
                <FeedCard key={post.id} item={post} />
              ))}
           </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8', // Slightly more modern gray
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  // --- HEADER ---
  greenHeader: {
    height: 220,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0, width: '100%',
    overflow: 'hidden'
  },
  headerBgImage: {
    width: 250, height: 250,
    position: 'absolute', right: -60, bottom: -40,
    opacity: 0.15, tintColor: '#fff'
  },
  headerContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, marginTop: 60, marginBottom: 20,
  },
  greetingText: { color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: '500' },
  trainerName: { color: 'white', fontSize: 30, fontWeight: '800' },
  profileImageContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)', padding: 3,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 32, borderWidth: 2, borderColor: '#fff' },
  levelBadge: {
    position: 'absolute', bottom: -5, right: -5,
    backgroundColor: '#FFC107', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 12, borderWidth: 2, borderColor: 'white',
  },
  levelText: { fontSize: 11, fontWeight: 'bold', color: '#333' },

  // --- MAIN CARD ---
  mainCard: {
    marginHorizontal: 20, backgroundColor: 'white', borderRadius: 24, padding: 24,
    shadowColor: "#2E7D32", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20,
    elevation: 8, marginBottom: 20,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  xpContainer: { marginBottom: 25 },
  xpLabel: { fontSize: 12, color: '#888', fontWeight: '600' },
  xpValues: { fontSize: 12, color: '#333', fontWeight: '700' },
  xpBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginTop: 5 },
  xpBarFill: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#333' },
  statLabel: { fontSize: 12, color: '#888' },

  // --- NEW: BONUS BAR ---
  bonusContainer: {
    flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, justifyContent: 'space-between',
  },
  bonusItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, gap: 6
  },
  bonusText: { fontSize: 12, fontWeight: '700' },

  // --- HUNT BUTTON ---
  huntButton: {
    marginHorizontal: 20, height: 90, backgroundColor: '#1a1a1a', borderRadius: 20, marginBottom: 25,
    justifyContent: 'center', paddingHorizontal: 25,
    shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  huntContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  huntTitle: { color: 'white', fontSize: 22, fontWeight: '800' },
  huntSubtitle: { color: '#aaa', fontSize: 13, marginTop: 2 },

  // --- NEW: POKEMON OF THE DAY ---
  potdContainer: {
    marginHorizontal: 20, marginBottom: 30, backgroundColor: '#3b4cca', borderRadius: 20, 
    flexDirection: 'row', alignItems: 'center', padding: 20, position: 'relative', overflow: 'hidden'
  },
  potdTextContainer: { flex: 1, zIndex: 2 },
  potdLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  potdName: { color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  potdSub: { color: '#FFC107', fontSize: 12, fontWeight: '600' },
  potdImage: { width: 120, height: 120, position: 'absolute', right: -20, bottom: -20, opacity: 0.9 },

  // --- SECTIONS ---
  sectionContainer: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },

  // --- NEAR YOU CARDS ---
  nearYouCard: {
    backgroundColor: 'white', width: 130, height: 160, borderRadius: 16, marginRight: 15, padding: 10,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  typeDot: { width: 8, height: 8, borderRadius: 4, position: 'absolute', top: 10, right: 10 },
  nearYouImage: { width: 85, height: 85, marginBottom: 8 },
  nearYouName: { fontSize: 14, fontWeight: '700', color: '#333', textTransform: 'capitalize' },
  nearYouDistance: { fontSize: 11, color: '#999' },

  // --- MISSION CARDS ---
  missionCard: {
    flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2,
    alignItems: 'center'
  },
  missionIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  missionTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
  missionProgressBg: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginTop: 8, marginBottom: 6 },
  missionProgressFill: { height: '100%', borderRadius: 3 },
  missionStats: { fontSize: 11, color: '#888', fontWeight: '600' },
  missionReward: { fontSize: 11, fontWeight: '700' },

  // --- NEW: FEED CARDS ---
  feedCard: {
    width: 260, backgroundColor: 'white', borderRadius: 16, marginRight: 15, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  feedHeader: { flexDirection: 'row', marginBottom: 12 },
  feedAvatarContainer: { 
    width: 32, height: 32, borderRadius: 16, marginRight: 10, 
    justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#f0f0f0' 
  },
  feedUsername: { fontSize: 14, fontWeight: '700', color: '#333' },
  feedTime: { fontSize: 11, color: '#999' },
  feedContent: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 12 },
  feedImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 12 },
  feedFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  interactionRow: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  interactionText: { fontSize: 12, color: '#666', marginLeft: 5, fontWeight: '600' },
});