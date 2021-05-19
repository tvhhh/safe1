import firebase from '@/api/firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import User from '@/models/users';
import store from '@/redux/store';
import actions from '@/redux/actions';
import StorageService from '@/services/storage.service';

GoogleSignin.configure({
  webClientId: "1093645070689-he5i4cbgd5hpulhg0tdmsp5c8j5sjkaa.apps.googleusercontent.com",
});

class AuthService {
  async signInWithGoogle() {
    try {
      // Get Google credentials
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in using Firebase authentication
      await firebase.auth().signInWithCredential(googleCredential);
      
      // Get current user and update state and save to AsyncStorage
      const user = firebase.auth().currentUser;
      if (user != null) {
        store.dispatch(actions.setCurrentUser(user as User));
        await StorageService.setUser(user);
      }
    } catch (err) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) throw err;
    }
  }

  async signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await firebase.auth().signOut();
      store.dispatch(actions.setCurrentUser(null));
      await StorageService.setUser(null);
    } catch (err) {
      throw err;
    }
  }
};

export default new AuthService();