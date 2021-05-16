import firebase from '@/api/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

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

export async function signInWithFacebook() {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) {
    return null;
  }
  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    return null;
  }
  // Create a Firebase credential with the AccessToken
  const facebookCredential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
  // Sign-in the user with the credential
  return firebase.auth().signInWithCredential(facebookCredential);
}
