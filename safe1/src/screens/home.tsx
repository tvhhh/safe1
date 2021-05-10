import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen')

class App extends React.Component{
    render(){
        return (
            <View style = {styles.container}>
                <View style = {styles.statusZone}><Text style = {{fontSize:30}}>This is status zone</Text></View>
                <TouchableOpacity style = {styles.button}>
                    <Text>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button}>
                    <Text>Remote Control</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button}>
                    <Text>Your Building</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button}>
                    <Text>Notification</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button}>
                    <Text>Setting</Text>
                </TouchableOpacity>
                </View>            
        )
    }
}

export default App;

const styles = StyleSheet.create({
    statusZone: {
        flex: 0,
        width: width/1.1,
        height: height/7,
        backgroundColor: '#4287f5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        backgroundColor: "#4287f5",
        padding: 10,
        borderRadius:5
    }
})