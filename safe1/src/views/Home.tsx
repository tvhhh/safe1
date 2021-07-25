import React from 'react';
import { 
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar, Label } from '@/components';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import store from '@/redux/store';
import actions from '@/redux/actions';
import AuthService from '@/services/auth.service';
import ControlService from '@/services/control.service';
import StorageService from '@/services/storage.service';
import { Building } from '@/models';
import { splitDataValue } from '@/views/NotificationDaily'

const mapStateToProps = (state: State) => ({
  isConnected: state.isConnected,
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  isConnected: boolean,
  buildings: Building[]
};

interface HomeState {
  showOverlay: boolean
};

class Home extends React.Component<Props, HomeState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showOverlay: false
    };
  }

  componentDidMount() {
    if (!this.props.isConnected) {
      ControlService.connect();
    }
  }

  connect = () => {
    if (!this.props.isConnected) {
      ControlService.connect();
    }
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
  HomeScreen(list:any){
    if(list){
      if(list.devices.length > 0){
        let buffer = []
        buffer[0]= this.DisplayTemp(list)
        buffer[1]= this.DisplayGas(list)
        return buffer;
      }
      else{
        return(
          <View style={{alignContent:'center',width:'50%'}}>
            <Text style={{fontSize:30, color:'#ffffff'}}>No Devices</Text>
          </View>
        );
      }
    }
    else{
      return(
        <View style={{alignContent:'center',width:'50%'}}>
          <Text style={{fontSize:30, color:'#ffffff'}}>No Building</Text>
        </View>
      );
    }
  }
  DisplayTemp(list:any){
    if(list){
      // console.log(list)
      let max=-1;
      let nameDevice;
      let region;
      let flag = false;
        for(let k=0; k < list.devices.length;k++){
          if(list.devices[k].deviceType=="temperature"){
            flag = true;
            if(list.devices[k].data.length){ 
              let value=splitDataValue(list.devices[k].data[list.devices[k].data.length-1]?.value);
              if(Number(value)>= max){
                max=Number(value);
                nameDevice=list.devices[k].name;
                region=list.devices[k].region;
              }
            }
          }
        }  
      if(flag){
        // console.log("ten devices:"+nameDevice)
        if(max > 40){
          return(
            <View key={0} style={{justifyContent:'center',alignItems:'center',width: '50%'}}>
              <Text style={styles.statusGasType}>Temperature :</Text>
              <Text style={{fontSize:70,color:'#ff3300' }}>{max}</Text>
              <Text style={styles.statusGasInf}>{nameDevice}</Text>
              <Text style={styles.statusGasInf}>{region}</Text>
            </View>
          );
        }
        else if(max>0 && max<40){
          return(
            <View key={0} style={{justifyContent:'center',alignItems:'center',width: '50%'}}>
              <Text style={styles.statusGasType}>Temperature :</Text>
              <Text style={{fontSize:70,color:'#66ff66' }}>{max}</Text>
              <Text style={styles.statusGasInf}>{nameDevice}</Text>
              <Text style={styles.statusGasInf}>{region}</Text>
            </View>
          );
        }
        else{
          return(
            <View key={0} style={{justifyContent:'center',alignItems:'center',width: '50%'}}>
              <Text style={styles.statusGasType}>Temperature :</Text>
              <Text style={{fontSize:30,color:'#ffffff' }}>No Data</Text>
            </View>
          );
        }  
      }
      else{
        return(
          <View key={0} style={{flexDirection:'column',alignContent:'center',width:'50%'}}>
            <Text style={styles.statusGasType}>Temperature :</Text>
            <Text style={{fontSize:30, color:'#ffffff'}}>No Device</Text>
          </View>
        );
      }  
    }
    else{
      return(
        <View key={0} style={{flexDirection:'column',alignContent:'center',width:'50%'}}>
            <Text style={{fontSize:50, color:'#ffffff'}}>empty</Text>
          </View>
      )
    }
  }
  DisplayGas(list:any){
    if(list){
      // console.log(list)
      let max = -1;
      let nameDevice;
      let region;
      let flag = false;
      for(let k = 0; k < list.devices.length;k++){
        if(list.devices[k].deviceType == "gas"){
          flag = true;
          if(list.devices[k].data.length){   
            let value  = splitDataValue(list.devices[k].data[list.devices[k].data.length-1]?.value);
            if(Number(value)>= 0){
              max = Number(value);
              nameDevice = list.devices[k].name;
              region = list.devices[k].region;
            }
          }
        }
      }
      if(flag){
        // console.log("ten device cua gas:"+ nameDevice)
        if(max == 1){
          return(
            <View key={1} style={{justifyContent:'center',alignItems:'center',width:'50%'}}>
              <Text style={styles.statusGasType}>Gas :</Text>
              <Text style={{fontSize:70,color:'#ff3300' }}>{max}</Text>
              <Text style={styles.statusGasInf}>{nameDevice}</Text>
              <Text style={styles.statusGasInf}>{region}</Text>
            </View>
          );
        }
        if(max == 0){
          return(
            <View key={1} style={{justifyContent:'center',alignItems:'center',width: '50%'}}>
              <Text style={styles.statusGasType}>Gas :</Text>
              <Text style={{fontSize:70,color:'#66ff66' }}>{max}</Text>
              <Text style={styles.statusGasInf}>{nameDevice}</Text>
              <Text style={styles.statusGasInf}>{region}</Text>
            </View>
          );
        }
        else {
          return(
            <View key={1} style={{justifyContent:'center',alignItems:'center',width: '50%'}}>
              <Text style={styles.statusGasType}>Gas :</Text>
              <Text style={{fontSize:30,color:'#ffffff' }}>No Data</Text>
            </View>
          );
        }
      }
      else{
        return(
          <View key={1} style={{alignContent:'center',width:'50%'}}>
            <Text style={styles.statusGasType}>Gas :</Text>
            <Text style={{fontSize:30, color:'#ffffff'}}>No Device</Text>
          </View>
        );
      }   
    }
    else{
      return(
        <View key={1} style={{alignContent:'center',width:'50%'}}>
          <Text style={{fontSize:50, color:'#ffffff'}}>empty</Text>
        </View>
      );
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
        {this.props.isConnected ? null : 
          <TouchableOpacity style={styles.reconnectButton} onPress={this.connect}>
            <Text style={styles.hotline}>Disconnected! Try again</Text>
          </TouchableOpacity>}
        <View style={styles.headerCotainer}>
          <Avatar size="medium" onPress={this.toggleOverlay.bind(this)} />
          {this.state.showOverlay ? 
            <TouchableOpacity style={styles.overlay} onPress={this.signOut}>
              <AntDesign name="logout" color="red" size={15} />
              <Text style={styles.signOut}>Sign out</Text>
            </TouchableOpacity> : null}
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusZone}>
            <View style= {{flexDirection: 'row' }}>
                {/* {this.DisplayTemp(this.props.defaultBuilding)}
                {this.DisplayGas(this.props.defaultBuilding)} */}
                {this.HomeScreen(this.props.defaultBuilding)}
            </View>
          </View>
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
            onPress={this.navigate("RemoteControl")}
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

export default connector(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  reconnectButton: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'red',
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
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
  },
  statusGasInf:{
    alignItems: 'center',
    fontSize:15,
    color:'#ffffff'
  },
  statusGasType:{
    alignItems: 'center',
    fontSize:15,
    color:'#ccccff' 
  },
  statusTempType:{
    fontSize:15,
    color:'#ccccff',
    // paddingLeft:20 
  },
  statusTempInf:{
    alignItems: 'center',
    fontSize:15,
    color:'#ffffff',
    // paddingLeft:40
  },

});