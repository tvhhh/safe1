import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
const {height, width} = Dimensions.get('screen')
interface Props {
    navigation: any
  }
class Home extends React.Component{
    render(){
        return (
            <LinearGradient 
                colors = {['#4F9FFF', '#002150']} 
                style = {styles.container}
                start={{x: 0, y: 0}}
                 end={{x: 0, y: 0.5}}
            >
                <View style = {styles.headerCotainer}></View>
                <View style = {styles.statusContainer}>
                    <View style = {styles.statusZone}><Text style = {{fontSize:30, color: '#FFFFFF', opacity:1}}>This is status zone</Text></View>
                </View>
                <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        style = {styles.button}
                        onPress = {() => {
                            this.props.navigation.navigate('Dashboard');
                        }}
                    >
                        <View style = {styles.iconBox}>
                            <Feather name = "activity" color = 'white' size = {40}/>
                        </View>
                        <View style = {styles.buttonTextContainer}>
                            <Text style = {styles.buttonPrimaryText}>Dashboard</Text>
                            <Text style = {styles.buttonSecondaryText}>Statistics and Analysis</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button}>
                        <View style = {styles.iconBox}>
                            <Feather name = "sliders" color = 'white' size = {40}/>
                        </View>
                        <View style = {styles.buttonTextContainer}>
                            <Text style = {styles.buttonPrimaryText}>Remote Control</Text>
                            <Text style = {styles.buttonSecondaryText}>Control your registered devices</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button}>
                        <View style = {styles.iconBox}>
                            <Feather name = "home" color = 'white' size = {40}/>
                        </View>
                        <View style = {styles.buttonTextContainer}>
                            <Text style = {styles.buttonPrimaryText}>Your Building</Text>
                            <Text style = {styles.buttonSecondaryText}>Manage your building</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button}
                        onPress = {() => {
                        this.props.navigation.navigate('Notification');}}
                    >
                        <View style = {styles.iconBox}>
                            <Feather name = "bell" color = 'white' size = {40}/>
                        </View>
                        <View style = {styles.buttonTextContainer}>
                            <Text style = {styles.buttonPrimaryText}>Notification</Text>
                            <Text style = {styles.buttonSecondaryText}>Manage your notifications</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button}> 
                        <View style = {styles.iconBox}>
                            <Feather name = "settings" color = 'white' size = {40}/>
                        </View>
                        <View style = {styles.buttonTextContainer}>
                            <Text style = {styles.buttonPrimaryText}>Settings</Text>
                            <Text style = {styles.buttonSecondaryText}>Customize your app</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {styles.footerContainer}>
                    <Text style = {styles.buttonPrimaryText}>Hotline: 0111111</Text>
                </View>
            </LinearGradient>  
        )
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerCotainer: {
        flex: 1
    },
    statusContainer: {
        flex: 3,
        alignItems: 'center',
    },
    buttonContainer: {
        paddingLeft:10,
        flex:4,
        justifyContent:'space-evenly',
        alignContent: 'space-around',
    },
    footerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusZone: {
        width: width/1.1,
        height: height/4,
        backgroundColor: 'rgba(5, 28, 63, 0.5)',
        borderRadius:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        borderRadius:5,
        flexDirection: 'row',
    },
    buttonPrimaryText: {
        color: 'white',
        fontSize:16,
        fontFamily: 'Lato'
    },
    buttonSecondaryText: {
        color: 'white',
        fontSize:10,
        fontFamily: 'Lato'
    },
    buttonTextContainer: {
        paddingLeft: 30
    },
    iconBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 10,
        height: height/16,
        width:width/8
    }
})