import auth from '@react-native-firebase/auth';

// In bare React Native with @react-native-firebase, 
// the configuration is usually handled in the android/build.gradle (google-services.json) 
// and ios/Podfile (GoogleService-Info.plist).

export const signIn = async (email: string, password: string) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};