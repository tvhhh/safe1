import React from 'react';
import { View, SectionList, Text, StyleSheet, Image } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  navigation: any
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
      {/* <SectionList
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
      /> */}
    </View>
  );
}

class OptionScreen extends React.Component<Props> {
  render() {
    return (
      <View style={styles.option}>
        <Body/>
      </View>
    )
  }
}

export default OptionScreen;

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


