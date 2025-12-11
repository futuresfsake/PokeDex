import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow } from 'date-fns';

// --- Types ---
interface Post {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: number;
  likes: number;
  imageUrl?: string;
  isStatic?: boolean;
  isGif?: boolean;
  trainerClass?: string; // e.g., "Professor", "Team Rocket", "Champion"
}

const STORAGE_KEY = '@pokedex_feed_v4';
const { width } = Dimensions.get('window');

// --- CURATED POKEMON GIFS (No random internet stuff) ---
const POKEMON_GIFS = [
  'https://media.giphy.com/media/xx0JzzsBXzcQA/giphy.gif', // Charmander
  'https://media.giphy.com/media/slVWEctHZKvWU/giphy.gif', // Snorlax
  'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif', // Squirtle Squad
  'https://media.giphy.com/media/xuXzcHMkuwvf2/giphy.gif', // Pikachu
  'https://media.giphy.com/media/Jir7AUnuJxjPQlVQCS/giphy.gif', // Detective Pikachu
  'https://media.giphy.com/media/Qs0QEnugoy0GV4xhXZ/giphy.gif', // Bulbasaur
  'https://media.giphy.com/media/u1k1kpDZSw5sA/giphy.gif', // Mudkip
  'https://media.giphy.com/media/L95W4wv8nimbC/giphy.gif' // Eating Rice Ball
];

// --- STATIC DATA (Lore Accurate) ---
const INITIAL_STATIC_POSTS: Post[] = [
  {
    id: 'static-1',
    username: 'Professor Oak',
    handle: '@kanto_research', 
    content: 'Alert: Reports of a Shiny Gyarados at the Lake of Rage! 🔴 Remember, observation is key, but capture is necessary for data completion.',
    timestamp: Date.now() - 3600000, 
    likes: 5420,
    imageUrl: 'https://media.giphy.com/media/ydU6Wf0rCqO52/giphy.gif', // Gyarados
    isStatic: true,
    isGif: true,
    trainerClass: 'Professor'
  },
  {
    id: 'static-2',
    username: 'Cynthia',
    handle: '@sinnoh_champ', 
    content: 'Garchomp is restless today. I sense a distortion in the fabric of space-time nearby. Trainers, stay alert.',
    timestamp: Date.now() - 7200000, 
    likes: 8900,
    imageUrl: 'https://img.pokemondb.net/artwork/large/garchomp.jpg',
    isStatic: true,
    isGif: false,
    trainerClass: 'Champion'
  },
  {
    id: 'static-3',
    username: 'Team Rocket Grunt',
    handle: '@take_over_world', 
    content: 'Anyone seen a Pikachu around here? Asking for the boss... 🚀',
    timestamp: Date.now() - 86400000, 
    likes: 12,
    imageUrl: 'https://media.giphy.com/media/3o6ozvv0zsJskzOCbu/giphy.gif', // Meowth
    isStatic: true,
    isGif: true,
    trainerClass: 'Villain'
  }
];

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        setPosts([...INITIAL_STATIC_POSTS, ...parsed]);
      } else {
        setPosts(INITIAL_STATIC_POSTS);
      }
    } catch (e) {
      console.error("Failed to load posts", e);
    } finally {
      setLoading(false);
    }
  };

  const saveUserPosts = async (currentPosts: Post[]) => {
    try {
      const userPosts = currentPosts.filter(p => !p.isStatic);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
    } catch (e) { console.error(e); }
  };

  // --- 2. CREATE POST ---
  const handlePost = () => {
    if (!newPostText.trim() && !newPostImage) return;

    const newPost: Post = {
      id: Date.now().toString(),
      username: 'WPlayer', 
      handle: '@hunter_status',
      content: newPostText,
      timestamp: Date.now(),
      likes: 0,
      imageUrl: newPostImage || undefined,
      isGif: newPostImage.includes('.gif'),
      trainerClass: 'Trainer'
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    saveUserPosts(updatedPosts); 
    
    // Reset
    setNewPostText('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  // --- 3. POKEMON ONLY MEDIA ENGINE ---
  const handleAttachMedia = () => {
    Alert.alert(
      "Attach Pokedex Media",
      "Select source:",
      [
        {
          text: "Random Pokemon GIF",
          onPress: () => {
            // Picks strictly from our safe Pokemon list
            const randomGif = POKEMON_GIFS[Math.floor(Math.random() * POKEMON_GIFS.length)];
            setNewPostImage(randomGif);
            setShowImageInput(true);
          }
        },
        {
          text: "Wild Pokemon Snap",
          onPress: () => {
            // Uses Official Artwork only
            const randomId = Math.floor(Math.random() * 898) + 1; // Gen 1-8
            setNewPostImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomId}.png`);
            setShowImageInput(true);
          }
        },
        {
          text: "Paste Image URL",
          onPress: () => {
            setNewPostImage('');
            setShowImageInput(true);
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // --- 4. SHARE LOGIC ---
  const handleShare = async (post: Post) => {
    const shareMessage = `Caught on PokeExplorer: "${post.content}" - ${post.username}`;
    const shareOptions = {
      title: 'Pokedex Entry Share',
      message: shareMessage, 
      url: post.imageUrl, 
      failOnCancel: false,
    };
    
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share dismissed');
    }
  };

  const handleDelete = (postId: string) => {
    Alert.alert("Delete Entry", "Remove this from the database?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          const updated = posts.filter(p => p.id !== postId);
          setPosts(updated);
          saveUserPosts(updated);
      }}
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          {/* Avatar Logic - Based on Class */}
          <View style={[styles.avatarContainer, styles.userAvatar]}>
             <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1024px-Pok%C3%A9_Ball_icon.svg.png' }} 
                style={{ width: 24, height: 24 }} 
             />
          </View>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.username}>{item.username}</Text>
              {item.isStatic && <Icon name="check-decagram" size={14} color="#3B82F6" style={{marginLeft: 4}} />}
            </View>
            <Text style={styles.handle}>
              {item.trainerClass || 'Trainer'} • {formatDistanceToNow(item.timestamp, { addSuffix: true })}
            </Text>
          </View>
        </View>
        {!item.isStatic && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="dots-horizontal" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* CONTENT */}
      {item.content ? <Text style={styles.postText}>{item.content}</Text> : null}
      
      {/* MEDIA */}
      {item.imageUrl && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.postImage} 
            resizeMode="contain" // Contain ensures full pokemon artwork is seen
          />
          {item.isGif && (
            <View style={styles.gifBadge}>
              <Text style={styles.gifText}>GIF</Text>
            </View>
          )}
        </View>
      )}

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="heart-outline" size={22} color="#6B7280" />
          <Text style={styles.actionText}>{item.likes > 0 ? item.likes : ''}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="comment-outline" size={22} color="#6B7280" />
          <Text style={styles.actionText}>{item.isStatic ? Math.floor(Math.random() * 50) + 10 : ''}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item)}>
          <Icon name="share-variant-outline" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* HEADER */}
      <View style={styles.screenHeader}>
        <Text style={styles.headerTitle}>Global Link</Text>
        <Icon name="access-point-network" size={24} color="#4CAF50" />
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          /* INPUT BOX */
          <View style={styles.inputWrapper}>
             <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Log a new Pokedex entry..."
                  placeholderTextColor="#9CA3AF"
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                />
                
                {showImageInput && (
                  <View style={styles.previewBox}>
                    {newPostImage ? (
                      <Image source={{ uri: newPostImage }} style={styles.miniPreview} />
                    ) : (
                      <View style={[styles.miniPreview, {backgroundColor: '#eee'}]} />
                    )}
                    <TextInput 
                      style={styles.urlInput} 
                      value={newPostImage} 
                      onChangeText={setNewPostImage} 
                      placeholder="Image Source URL..."
                    />
                    <TouchableOpacity onPress={() => {setNewPostImage(''); setShowImageInput(false)}}>
                       <Icon name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.toolBar}>
                  <View style={styles.tools}>
                    <TouchableOpacity onPress={handleAttachMedia} style={styles.toolIcon}>
                       <Icon name="camera-iris" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAttachMedia} style={styles.toolIcon}>
                       <Icon name="pokeball" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={[styles.postBtn, (!newPostText && !newPostImage) && styles.disabledBtn]} 
                    onPress={handlePost}
                    disabled={!newPostText && !newPostImage}
                  >
                    <Text style={styles.postBtnText}>UPLOAD</Text>
                  </TouchableOpacity>
                </View>
             </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  
  // Header
  screenHeader: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },

  // Input
  inputWrapper: { padding: 15 },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 50,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  miniPreview: { width: 40, height: 40, borderRadius: 6, marginRight: 10, backgroundColor: '#ddd' },
  urlInput: { flex: 1, fontSize: 13, color: '#374151' },
  
  toolBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  tools: { flexDirection: 'row' },
  toolIcon: { marginRight: 20 },
  
  postBtn: { backgroundColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  disabledBtn: { backgroundColor: '#D1D5DB', opacity: 0.7 },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  // Feed Card
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', 
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  userAvatar: { backgroundColor: '#F3F4F6' },
  
  username: { fontWeight: '700', color: '#111827', fontSize: 15 },
  handle: { color: '#6B7280', fontSize: 12, marginTop: 1 },
  
  postText: {
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  
  mediaContainer: { position: 'relative', alignItems: 'center', backgroundColor: '#FAFAFA' },
  postImage: {
    width: width, 
    height: 300,
  },
  gifBadge: {
    position: 'absolute',
    bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4,
  },
  gifText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB'
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  actionText: { marginLeft: 6, color: '#6B7280', fontWeight: '600', fontSize: 13 },
});

export default FeedScreen;