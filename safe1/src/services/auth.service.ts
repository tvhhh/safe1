import firebase from '@/api/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: "1093645070689-he5i4cbgd5hpulhg0tdmsp5c8j5sjkaa.apps.googleusercontent.com",
});

export async function signInWithGoogle() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  return firebase.auth().signInWithCredential(googleCredential);
}