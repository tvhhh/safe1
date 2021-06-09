import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image,Button,Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Building, Device } from '@/models'
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import NotificationDaily from './NotificationDaily';
import PushNotification from "react-native-push-notification";

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
});
const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  buildings: Building[],
  defaultBuilding: Building | undefined,
};

PushNotification.configure({
  onRegister: function(token) {
    console.log('TOKEN:', token);
  },
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
  },
  onAction: function(notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: false,
});

const testPush = ()=>{
  PushNotification.localNotification({
    id: 0,
    channelId: "123",
    title: "Some things went wrong", // (optional)
    message: "Please Check device", // (required)
  });
}
const testSchedule = ()=>{
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    message: "My Notification Message", // (required)
    date: new Date(Date.now() + 5 * 1000), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
}
function createAlert (device: any, nameBuilding: any){
  Alert.alert(
    "Something went wrong !!!",
     device.name+" in building '" + nameBuilding +"' have problems." ,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Alert"),
        style: "cancel"
      },
      { text: "", onPress: () =>  console.log("Understood alert")}
    ]
  );
}
const BuildingCard = (props: any) => {
  return <View style={{ marginLeft: 15, marginBottom: 15, flexDirection: 'row' }}>
    <View style={buildingCard.iconLayout}>
      <Image
        style={buildingCard.tinyLogo}
        source={require('../assets/img/buildingIcon_Noti.png')}
      />
    </View>
    <View style={{ flexDirection: 'column', marginLeft: 15 }}>
      <Text
        style={buildingCard.nameBuilding}>Name: {props.nameBuilding}
      </Text>
      <Text style={buildingCard.address}>Address: {props.address}</Text>
      <Text
        style={buildingCard.ownerName}>{props.ownerName}
      </Text>
    </View>
  </View >
}

const Body = (props: any) => {
  return (
    <View style={styles.body}>
      <View>
        <TouchableOpacity>
          <Text
            style={bodyStyle.title}>List of Building
        </Text>
        </TouchableOpacity>
      </View>
      <FlatList data={props.listBuilding} renderItem={({ item }) => 
      <TouchableOpacity onPress = {()=>props.navigation.navigate('NotificationDaily',{
                                  index:props.listBuilding.indexOf(item),
                                  nameBuilding:item.name
                                  })}>
        <BuildingCard nameBuilding = {item.name} address = {item.address} ownerName = {item.owner.displayName}></BuildingCard>
      </TouchableOpacity>
    }></FlatList>
      </View>
  );
}
export function CheckPushNoti (list:any){
  for(let i = 0;i<list.length;i++){
    for(let k = 0; k < list[i].devices.length;k++){
      if(list[i].devices[k].deviceType == "gas"){
        if(list[i].devices[k].data[list[i].devices[k].data.length-1]?.value=="1"){
          createAlert(list[i].devices[k], list[i].name);
        }
      }
      else if(list[i].devices[k].deviceType == "temperature"){
        if(list[i].devices[k].data[list[i].devices[k].data.length-1]?.value>"40"){
          createAlert(list[i].devices[k], list[i].name);
        }
      }
    }  
  }
  return;
}
class NotificationHistory extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    CheckPushNoti(this.props.buildings);
  }
  render() {
    return (
      <View style={styles.option}>
        {/* <Button title="name" onPress= {()=>{CheckPushNoti(this.props.buildings)}}></Button> */}
        <Body listBuilding = {this.props.buildings} navigation ={this.props.navigation} ></Body>
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
  title: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom:20,
    fontSize: 30,
    color: "#aac4ec"
  },
})

const buildingCard = StyleSheet.create({
  iconLayout: {
    justifyContent: 'center',
    marginTop: 5,
    width: 70,
    height: 65,
    borderRadius: 12,
    backgroundColor: "#6495ed"
  },
  tinyLogo: {
    width: 60,
    height: 67,
  },
  nameBuilding: {
    marginTop: 1,
    fontSize: 18
  },
  address: {
    marginTop: 1,
    fontSize: 18
  },
  ownerName: {
    fontSize: 20,
    marginTop: 1,
    color: "#aac4ec"
  },
})

export default connector(NotificationHistory);
