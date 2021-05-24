import React from 'react';
import { 
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar, Label } from '@/components';

import store from '@/redux/store';
import actions from '@/redux/actions';
import AuthService from '@/services/auth.service';
import ControlService from '@/services/control.service';
import StorageService from '@/services/storage.service';

interface Props {
  navigation: any,
};

interface State {
  showOverlay: boolean
};

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showOverlay: false
    };
  }

  toggleOverlay() {
    this.setState({ showOverlay: !this.state.showOverlay })
  }

  navigate(screenName: string) {
    return () => this.props.navigation.navigate(screenName);
  }

  signOut = async () => {
    try {
      await AuthService.signOut();
      ControlService.close();
      store.dispatch(actions.resetState());
      await StorageService.clear();
    } catch (err) {
      console.error(`Error signing out: ${err}`);
    }
  }

  // pingTest()  {
  //   fetch("http://10.0.2.2:8080/data/ping", {method: "GET"}).catch((error) => {console.log(error)})
  // }

  render() {
    return (
      <LinearGradient 
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        <View style={styles.headerCotainer}>
          <Avatar size="medium" onPress={this.toggleOverlay.bind(this)} />
          {this.state.showOverlay ? 
            <TouchableOpacity style={styles.overlay} onPress={this.signOut}>
              <AntDesign name="logout" color="red" size={15} />
              <Text style={styles.signOut}>Sign out</Text>
            </TouchableOpacity> : null}
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusZone}></View>
        </View>
        <View style={styles.buttonContainer}>
          <Label 
            name="Dashboard" 
            description="Statistics and Analysis" 
            icon={<Feather name="activity" color='white' size={40}/>}
            onPress={this.navigate('Dashboard')}
          />
          <Label 
            name="Remote Control" 
            description="Control your registered devices" 
            icon={<Feather name ="sliders" color='white' size={40}/>}
            onPress={this.navigate('RemoteControl')}
          />
          <Label 
            name="My Buildings" 
            description="Manage buildings"
            icon={<Feather name ="home" color='white' size={40}/>}
            onPress={this.navigate("My Buildings")}
          />
          <Label 
            name="Notification" 
            description="Manage your notifications" 
            icon={<Feather name ="bell" color='white' size={40}/>}
            onPress={this.navigate('NotificationHistory')}
          />
          <Label 
            name="Settings" 
            description="Customize your app" 
            icon={<Feather name="settings" color='white' size={40}/>}
            onPress={() => {}}
          />
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.hotline}>Hotline: 127.0.0.1</Text>
        </View>
      </LinearGradient>  
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerCotainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15
  },
  overlay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(5, 28, 63, 0.5)',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginRight: 3
  },
  signOut: {
    color: 'red',
    fontSize: 16,
    opacity: 0.8,
    marginLeft: 5
  },
  statusContainer: {
    flex: 3,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingLeft: 10,
    flex: 4,
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusZone: {
    width: '90%',
    height: Dimensions.get('screen').height/4,
    backgroundColor: 'rgba(5, 28, 63, 0.5)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotline: {
    color: 'white',
    fontSize: 16,
  }
});