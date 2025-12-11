Poke Explorer Set Up Guide

A. GO TO THE PROJEXT
1. cd Pokedex 

B. INSTALL THE DEPENDENCIES
1. npm install 

C. RUN THE APP
npx react-native run-android

# Setting Up Login & SignUp Page
By: Chelsea Colaljo
[/] User Authentication and Profiles: Simple login/signup using email
[] User profile to track discovered Pokémon, with a personal Pokedex list.

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
[/] Fetch and display Pokémon data from PokeAPI
[/] Search functionality: Allow users to search by name, type, or ID.
[/] Sort Functionality: Allow users to sort pokemons based on their types.

Install React Navigation & Icons:
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/bottom-tabs
npm install react-native-gesture-handler <-- ONLY IF RUNNING IN ANDROID
npm install react-native-vector-icons

CHALLENGES:
The challenges encountered were the Search and Sorting Functionality and also the UI. There are times where UI is ruined whenever I type something in the searchbar. Another challenge was the sorting, I have trouble on figuring out how I should sort the pokemons and how to display them.

SOLUTIONS:
The solutions made were making small changes and having a trial error kind of changes to determine if the UI have now been fixed. The sorting was based on the type of pokemon they are.

# Adding the Hunt Page
By: Cheska Gayle Ouano
[/] Use device GPS to detect user location.
[] "Hunt" mode: Simulate Pokémon encounters based on location
[] Notification alerts for nearby "Pokémon"

Install Dependencies:
npm install @react-native-community/geolocation react-native-maps

Add this in the dependencies in /android/app/src/build.gradle if not yet:
implementation 'com.google.android.gms:play-services-maps:18.1.0'
Then run: ./gradlew clean

CHALLENGES:

SOLUTIONS:


<h2>DetailsScreen Implementation</h2>
By: Joanna Alyssa Mondelo <3

[✔] Added DetailsScreen

[✔] Installed: npm install react-native-share

[✔] Navigation from PokedexScreen → DetailsScreen

[✔] Improved and playful UI

DESCRIPTION:
When the user clicks a Pokémon in PokedexScreen.tsx, it navigates to DetailsScreen.tsx where detailed information is displayed. The UI was upgraded to be more fun, colorful, and engaging.

CHALLENGES:
Creating an enjoyable, playful UI without breaking the original layout.
Ensuring smooth navigation and correct data passing between screens.
Integrating react-native-share properly.
Adjusting layout issues caused by additional UI components.

SOLUTIONS:
Applied multiple UI refinements using trial-and-error to fix spacing, alignment, and design problems.
Ensured navigation works properly by passing Pokémon ID and fetching full data.
Successfully implemented react-native-share for sharing Pokémon details.
Used flexible styling and tested responsiveness to maintain layout consistency.

<h2>FeedScreen Modification</h2>
FeedScreen Modification
By: Joanna Alyssa Mondelo <3

[✔] Improved UI (colorful + playful theme)

[✔] Support for posting text & images

[✔] Share posts to installed apps

[✔] Like, unlike, comment, and delete posts

DESCRIPTION:
The FeedScreen was redesigned to match the fun and colorful style of the Pokémon game. New features were added such as posting, liking, commenting, sharing, and deleting posts.

CHALLENGES:
Designing a FeedScreen UI that fits the playful game aesthetic.
Implementing like/unlike, comment, delete, and share functionalities smoothly.
Handling image + text uploads properly.
Ensuring share integration works on various devices.

SOLUTIONS:
Redesigned UI components to look more lively and thematic.
Improved state management for like, unlike, comment, and delete actions.
Integrated react-native-share and tested compatibility across apps.
Cleaned up rendering logic to handle posts with images and text without errors.

