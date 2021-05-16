import React from 'react';
import { View, Text, StyleSheet,Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ListItem, Icon } from 'react-native-elements'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const Room = [
    {
      name: "Kitchen",
      device: ["Temperature", "Gas Concentration"]
    },
    {
        name: "Living Room",
      device: ["Temperature", "Gas Concentration"]
    },
    {
        name: "BedRoom",
      device: ["Temperature"]
    },
    {
        name: "BathRoom",
      device: ["Temperature"]
    }
  ];
const DeviceCard = (props: any) => {
    if(props.nameDevice == "Temperature"){
        return <TouchableOpacity style={{ marginLeft: 15, marginBottom: 15, flexDirection: 'row' }}>
        <View style={deviceCardStyle.iconLayout}>
        <Image 
            style={roomCardStyle.tinyLogo}
            source={require('../assets/tempIcon_Noti.png')} 
        />
        </View>
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
            <Text 
                style={deviceCardStyle.nameDevice}>{props.nameDevice}
            </Text>
            <Text 
                style={deviceCardStyle.time}>Time: {props.time}
            </Text>
        </View>
            <Text 
                style={deviceCardStyle.data}>{props.data}
            </Text>
  </TouchableOpacity >
    }
    else{
        return <TouchableOpacity style={{ marginLeft: 15, marginBottom: 15, flexDirection: 'row' }}>
            <View style={deviceCardStyle.iconLayout}>
            <Image 
                style={roomCardStyle.tinyLogo}
                source={require('../assets/GasIcon_Noti.png')} />
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                <Text 
                    style={deviceCardStyle.nameDevice}>{props.nameDevice}
                </Text>
                <Text 
                    style={deviceCardStyle.time}>Time: {props.time}
                </Text>
            </View>
            <Text 
                style={deviceCardStyle.data}>{props.data}
            </Text>
        </TouchableOpacity >
    }
        
}

const RoomCard = (props: any) => {
    if (props.nameRoom == "Living Room") {
        return <View>
            <View style={roomCardStyle.line}></View>
            <Text 
                style={roomCardStyle.nameRoom}>{props.nameRoom}</Text>
            <DeviceCard 
                nameDevice="Temperature" time="14:00:03" data="32°C" 
            />
            </View>
    }
    else{
    return <View>
        <View style={roomCardStyle.line}></View>
        <Text 
            style={roomCardStyle.nameRoom}>{props.nameRoom}
        </Text>
        <DeviceCard 
            nameDevice="Gas Concentration" time="14:00:03" data="50ppm" 
        />
        <DeviceCard 
            nameDevice="Temperature" time="14:00:03" data="30°C" 
        />
        </View>
  } 
}

const Body = (props: any) => {
return (
    <ScrollView style={styles.body}>
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity>
                <Text 
                    style={bodyStyle.detail}>More details
                </Text>
            </TouchableOpacity>
            <View style={bodyStyle.iconLayout}>
                <TouchableOpacity>
                    <Icon
                        name='search-outline'
                        type='ionicon'
                        color='#aac4ec'
                        size={23}
                    />
                </TouchableOpacity>
            </View>
        </View>
        <Text 
            style={bodyStyle.dayTime}>Today, {props.day}
        </Text>
        {/* <View>{
                Room.map((l, i) => (
                <ListItem key={i} bottomDivider>
                    <ListItem.Content>
                    <RoomCard nameRoom={l.name} />
                    <ListItem.Title>{l.name}</ListItem.Title>
                    <ListItem.Subtitle>{l.device}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                ))
            }
        </View> */}
        <RoomCard nameRoom="Kitchen" />
        <RoomCard nameRoom="Living Room" />
        <RoomCard nameRoom="BedRoom"/>
        <RoomCard />
        </ScrollView>
  );
}

class Notification extends React.Component {
    render() {
        return (
            <View style={styles.option}>
                <Body day="14 April" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    option: {
        flex: 1,
        backgroundColor: '#6495ed',
    },
    body: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
})

const bodyStyle = StyleSheet.create({
    detail: {
        marginLeft: 30,
        marginTop: 20,
        fontSize: 23,
        color: "#41628a"
    },
    iconLayout: {
        justifyContent: 'center',
        marginTop: 15,
        marginLeft: "auto",
        marginRight: 25,
        width: 40,
        height: 40,
        borderRadius: 12,
        borderColor: "#aac4ec",
        borderWidth: 0.6,
        backgroundColor: "#fff"
    },
    dayTime: {
        marginLeft: 30,
        marginTop: 10,
        fontSize: 23,
        color: "#aac4ec"
    }
})
const roomCardStyle = StyleSheet.create({
    line: {
        marginTop: 13,
        borderWidth: 0.6,
        borderColor: "#aac4ec"
    },
    nameRoom: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 18,
        color: "#aac4ec"
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
})

const deviceCardStyle = StyleSheet.create({
    iconLayout: {
        justifyContent: 'center',
        marginTop: 5,
        width: 55,
        height: 55,
        borderRadius: 12,
        backgroundColor: "#6495ed"
    },
    nameDevice: {
        marginTop: 5,
        fontSize: 16
    },
    time: {
        fontSize: 16,
        marginTop: 10,
        color: "#aac4ec"
    },
    data: {
        marginTop: 20,
        fontSize: 16,
        marginLeft: "auto",
        marginRight: 20,
        color: "#08cd99"
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
})

export default Notification;