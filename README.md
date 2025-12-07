Poke Explorer Set Up Guide

A. GO TO THE PROJEXT
1. cd Pokedex 

B. INSTALL THE DEPENDENCIES
1. npm install 

C. RUN THE APP
npx react-native run-android

# Setting Up Login & SignUp Page
By: Chelsea Colaljo
- User Authentication and Profiles: Simple login/signup using email
- User profile to track discovered Pokémon, with a personal Pokedex list.

ADD THE FIREBASE KEY
1. Download the google-services.json
2. Move the file to this exact location in the project:

 ==>    android / app / google-services.json
 Folder structure Verification
 PokeDex/
├── android/
│   ├── app/
│   │   ├── google-services.json  <-- 🛑 PUT IT HERE
│   │   ├── src/
│   │   └── build.gradle
│   └── build.gradle
├── src/
├── App.tsx
└── package.json

CHALLENGES:

SOLUTIONS:


PREPARE ANDROID BUILD
--Go to android folder--
cd android

--Clean any old build artifacts--
./gradlew clean

--Go back to root--
cd ..

--trouble shooting--
if Error: File google-services.json is missing
Fix: You put the file in the wrong folder. It must be inside android/app, NOT just android.
Error: Unable to resolve module or Red Screen
Fix: Reset the cache by running this in a new terminal:

# Adding the Pokedex Page
By: Cheska Gayle Ouano
- Fetch and display Pokémon data from PokeAPI
- Search functionality: Allow users to search by name, type, or ID.
- Sort Functionality: Allow users to sort pokemons based on their types.

Install React Navigation & Icons:
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/bottom-tabs
npm install react-native-gesture-handler <-- ONLY IF RUNNING IN ANDROID
npm install react-native-vector-icons

CHALLENGES:

SOLUTIONS:


# Adding the Hunt Page
- Use device GPS to detect user location.
- "Hunt" mode: Simulate Pokémon encounters based on location
- Notification alerts for nearby "Pokémon"

Install Dependencies:
npm install @react-native-community/geolocation react-native-maps

Add this in the dependencies in /android/app/src/build.gradle if not yet:
implementation 'com.google.android.gms:play-services-maps:18.1.0'
Then run: ./gradlew clean