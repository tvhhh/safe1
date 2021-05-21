import React from 'react';
import { View, SectionList, Text, StyleSheet, Image } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  navigation: any
  }

// const Tab = createBottomTabNavigator();
const RoomList = [
  {
    title: "Kitchen",
    data:[
      {
        nameDevice:["Temperature", "Gas Concentration"],
        data:["32°C","1"],
        time:"14:00:03"
      }
    ]
  },
  {
    title: "Living Room",
    data:[
      {
        nameDevice:["Temperature", "Gas Concentration"],
        data:["38°C","0"],
        time:"15:00:03"
      }
    ]
  },
  {
    title: "BedRoom",
    data:[
      {
        nameDevice:["Temperature", ""],
        data:["38°C","1"],
        time:"16:00:03"
      }
    ]
  },
  {
    title: "BathRoom",
    data:[
      {
        nameDevice:["Temperature", ""],
        data:["32°C","0"],
        time:"10:00:03"
      }
    ]
  }
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
        <Text
          style={deviceCardStyle.time}>Time: {props.time}
        </Text>
      </View>
      <Text
        style={deviceCardStyle.data}>{props.data}
      </Text>
    </View >
  }
  else if(props.nameDevice == "Gas Concentration")  {
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
      nameDevice={props.nameDevice[0]} time={props.time} data={props.data[0]}
    />
    <DeviceCard
      nameDevice={props.nameDevice[1]} time={props.time} data={props.data[1]}
    />
  </View>
}

const Body = (props: any) => {
  return (
    <View style={styles.body}>
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
      <SectionList
        sections={RoomList}
        keyExtractor={(item,index) => item.time}
        renderItem={({ item }) => <RoomCard nameDevice={item.nameDevice} time ={item.time} data={item.data} />}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <View style={roomCardStyle.line}></View>
            <TouchableOpacity>
              <Text
                style={roomCardStyle.nameRoom}>{title}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

class NotificationDaily extends React.Component<Props> {
  render() {
    return (
      <View style={styles.option}>
        <Body/>
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

export default NotificationDaily;