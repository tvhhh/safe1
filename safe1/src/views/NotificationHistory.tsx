import React, {useState} from 'react';
import { View, SectionList, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { State, TouchableOpacity } from 'react-native-gesture-handler';
import NotificationDaily from './NotificationDaily'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

interface Props {
    navigation: any
}

const Tab = createBottomTabNavigator();
const RoomList = [
    {
        title: "14 April",
        state: "Safety",
        data:[
            {
                nameDevice:["Temperature", "Gas Concentration"],
                nameRoom: "Living Room",
                data:["32°C","0"],
                time:"14:00:03"
            }
        ]
    },
    {   
        title: "13 April",
        state: "Insecurity",
        data:[
            {
                nameDevice:["Temperature", "Gas Concentration"],
                nameRoom: "BedRoom",  
                data:["39°C","1"],
                time:"12:00:03"
            }
        ]
    },    
    {
        title: "12 April",
        state: "Insecurity",
        data:[
            {
                nameDevice:["Temperature",""],
                nameRoom: "Living Room",
                data:["39°C"],
                time:"8:00:03"
            }
        ]
    },
    {
        title: "11 April",
        state: "Safety",
        data:[
            {
                nameDevice:["Temperature", "Gas Concentration"],
                nameRoom: "Kitchen",            
                data:["30°C","0"],
                time:"19:00:03"
            }
        ]
    },
    {
        title: "10 April",
        state: "Insecurity",
        data:[
            {
                nameDevice:["","Gas Concentration"],
                nameRoom: "Living Room",
                data:["","1"],
                time:"8:00:03"
            }
        ]
    },

];
const DeviceCard = (props: any) => {
    if (props.nameDevice == "Temperature") {
        return <View style={{ marginLeft: 15, marginBottom: 15, flexDirection: 'row' }}>
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
                <Text style={deviceCardStyle.nameRoom}>{props.roomName}</Text>
                <Text
                    style={deviceCardStyle.time}>Time: {props.time}
                </Text>
            </View>
            <Text
                style={deviceCardStyle.data}>{props.data}
            </Text>
        </View >
    }
    else if(props.nameDevice == "Gas Concentration") {
        return <View style={{ marginLeft: 15, marginBottom: 15, flexDirection: 'row' }}>
            <View style={deviceCardStyle.iconLayout}>
                <Image
                    style={roomCardStyle.tinyLogo}
                    source={require('../assets/GasIcon_Noti.png')} />
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                <Text
                    style={deviceCardStyle.nameDevice}>{props.nameDevice}
                </Text>
                <Text style={deviceCardStyle.nameRoom}>{props.roomName}</Text>
                <Text
                    style={deviceCardStyle.time}>Time: {props.time}
                </Text>
            </View>
            <Text
                style={deviceCardStyle.data}>{props.data}
            </Text>
        </View >
    }
    else{
        return <Text></Text>
    }

}

const RoomCard = (props: any) => {
    return <View>
        <DeviceCard
            nameDevice={props.nameDevice[0]} time={props.time} roomName={props.roomName} data={props.data[0]}
        />
        <DeviceCard
            nameDevice={props.nameDevice[1]} time={props.time} roomName={props.roomName} data={props.data[1]}
        />
    </View>
}

const Body = (props: any) => {
    return (
        <View style={styles.body}>
            <View>
                <TouchableOpacity>
                    <Text
                        style={bodyStyle.detail}>Notification History
                </Text>
                </TouchableOpacity>
            </View>
            <SectionList
                sections={RoomList}
                keyExtractor={(item,index) => item.nameRoom}
                renderItem={({ item }) => <RoomCard nameDevice={item.nameDevice} roomName={item.nameRoom} time ={item.time} data={item.data}/>}
                renderSectionHeader={({ section: {title,state}}) => (
                    <View>
                        <View style={roomCardStyle.line}></View>
                        <TouchableOpacity onPress={() => {
                            props.navigate.navigate('NotificationDaily');
                        }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={bodyStyle.dayTime}>{title}
                                </Text>
                                <Text style={[state == "Safety" ? bodyStyle.secureState : bodyStyle.insecureState]}> {state} </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

class NotificationHistory extends React.Component<Props> {
    
    render() {
        return (
            <View style={styles.option}>
                <Body navigate = {this.props.navigation}/>
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
    dayTime: {
        marginLeft: 15,
        marginTop: 10,
        fontSize: 18,
        color: "#aac4ec"
    },
    secureState: {
        marginLeft: "auto",
        marginTop: 10,
        marginRight: 10,
        fontSize: 20,
        color: "green"
    },
    insecureState: {
        marginLeft: "auto",
        marginTop: 10,
        marginRight: 10,
        fontSize: 20,
        color: "red"
    }
})
const roomCardStyle = StyleSheet.create({
    line: {
        marginTop: 13,
        borderWidth: 0.6,
        borderColor: "#aac4ec"
    },
    day: {
        marginTop: 10,
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
        marginTop: 1,
        fontSize: 16
    },
    nameRoom: {
        marginTop: 1,
        fontSize: 16
    },
    time: {
        fontSize: 16,
        marginTop: 1,
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

export default NotificationHistory;