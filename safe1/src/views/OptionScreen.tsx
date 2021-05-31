import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoomButtons from '@/components/RoomButtons';
import ProtectionGrid from '@/components/ProctectionGrid';
import ThermoMonitor from '@/components/ThermoMonitor';
import HumidityMonitor from '@/components/HumidityMonitor';
import { useNavigation } from '@react-navigation/native';


const {height, width} = Dimensions.get('screen')

interface Props {
  navigation: any
}

const active = 'activated';
const num = 4;

const Body = () => {
  return (
    <View style={styles.body}>
      <Text style={bodyStyles.intro} numberOfLines={2}>
        {num} protection options in the kitchen are 
        <Text style={{fontWeight: 'bold', color: '#1EC639'}}> {active} </Text> 
      </Text>
      <ProtectionGrid/>
    </View>
  );
}

const AppButton = () => {
  const navigation = useNavigation();
  return (
  <View style={{alignItems: 'center'}}>
    <TouchableOpacity
      onPress={() => {navigation.navigate('RemoteControl');}}
      style={[
        {
          paddingHorizontal: 8,
          paddingVertical: 6,
          marginTop: 30,
          height: 50,
          elevation: 6,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          width: 150,
        } ,
        { backgroundColor: '#434FEA' }
      ]}
    >
      <Text style={{ fontSize: 24, fontFamily: 'Roboto', textAlign: 'center', color: '#fff' }}>
        More
      </Text>
    </TouchableOpacity>
  </View>
  )
}


const temp = '27\u00b0\C';
const humid = '55 %'
const Thermo = () => { 
  return (
    <View style={styles.body}>
      <Text style={[bodyStyles.intro, bodyStyles.introThermo]}>
        Now, Temperature is
        <Text style={{fontWeight: 'bold', color: '#FA582F'}}> {temp} </Text> 
      </Text>
      <ThermoMonitor/>
      <Text style={[bodyStyles.intro, bodyStyles.introThermo]}>
        And Humidity is
        <Text style={{fontWeight: 'bold', color: '#3B2BFF'}}> {humid} </Text> 
      </Text>
      <HumidityMonitor/>
      <AppButton/>
    </View>
  );
}

class OptionScreen extends React.Component<Props> {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <LinearGradient 
        colors = {['#4F9FFF', '#002150']} 
        style = {styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        
        <TouchableOpacity
          style = {styles.outButton}
          onPress = {() => {
          navigate('RemoteControl');
          }}
        >
          <Icon name = {'keyboard-backspace'} color = {'#fff'} size = {40}/>
        </TouchableOpacity>

        <View style = {styles.roomDevices}>
          <Text style = {styles.primaryText}>Kitchen</Text>
        </View>
        <View style = {styles.roomButtons}>
          <RoomButtons/>
        </View>
        
        <Thermo/>   
      </LinearGradient>  
    )
  }
}

export default OptionScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  body: {
    flex: 1,
    backgroundColor: "white",
    position: 'relative',
    top: height/17,
    bottom: height/18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  outButton: {
    position: 'relative',
    left: width/20,
    top: height/25,
    zIndex: 999,
  },
  roomDevices: {
    position: 'absolute',
    width: width/1,
    top: height/25,
    marginTop: 10,
    left: width/10,
  },
  primaryText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -0.24,
    color: '#FFFFFF',
    right: width/10,
    textAlign: 'center'
  },
  roomButtons:{
    top: height/22.5,
  },
})

const bodyStyles = StyleSheet.create({
  intro: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'left'
  },
  introThermo: {
    textAlign: 'center'
  }
})