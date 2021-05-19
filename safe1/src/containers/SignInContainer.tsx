import React from 'react';
import { 
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

import User from '@/models/users';
import store from '@/redux/store';
import actions from '@/redux/actions';
import AuthService from '@/services/auth.service';
import DataService from '@/services/data.service';
import StorageService from '@/services/storage.service';

const { height, width } = Dimensions.get('screen');

export default class SignInContainer extends React.Component {
  async signIn() {
    try {
      let user = await AuthService.signInWithGoogle();
      if (user == null) {
        throw new Error("null user");
      }
      let res = await DataService.createUser(user as User);
      if (res) {
        store.dispatch(actions.setCurrentUser(res));
        await StorageService.setUser(res);
      } else {
        await AuthService.signOut();
      }
    } catch (err) {
      console.error(`Error signing in: ${err}`);
    }
  }

  render() {
    return (
      <LinearGradient
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        <View style={styles.titleContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/logo.png')} />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionPrimaryText}>
              The safest security checking app
            </Text>
            <Text style={styles.descriptionSecondaryText}>
              Keep your house from the risk of gas leakage and fire accident
            </Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <GoogleSigninButton 
            style={styles.button}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn}
          />
        </View>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width/8,
  },
  descriptionPrimaryText: {
    color: 'white',
    fontSize: 16
  },
  descriptionSecondaryText: {
    color: 'white',
    opacity: 0.5,
    fontSize: 14,
    textAlign: 'center'
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: height/16,
    width: '80%'
  }
});