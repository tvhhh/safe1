import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoomButtons from '@/components/RoomButtons';
import ProtectionGrid from '@/components/ProctectionGrid';

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
        
        <Body/>   
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
    lineHeight: 50,
    textAlign: 'left'
  }
})