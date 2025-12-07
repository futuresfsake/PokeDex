Poke Explorer Set Up Guide

A. GO TO THE PROJEXT
1. cd Pokedex 

B. INSTALL THE DEPENDENCIES
1. npm install 

C. ADD THE FIREBASE KEY
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

D. PREPARE ANDROID BUILD
# Go to android folder
cd android

# Clean any old build artifacts
./gradlew clean

# Go back to root
cd ..

E. RUN THE APP
npx react-native run-android

# trouble shooting 
if Error: File google-services.json is missing
Fix: You put the file in the wrong folder. It must be inside android/app, NOT just android.
Error: Unable to resolve module or Red Screen
Fix: Reset the cache by running this in a new terminal:

F. Install React Navigation & Icons
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/bottom-tabs
npm install @react-navigation/bottom-tabs <-- ONLY IF RUNNING IN ANDROID
npm install react-native-vector-icons

