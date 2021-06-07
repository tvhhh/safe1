import React from 'react';
import { View, FlatList, Text, StyleSheet, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect, ConnectedProps } from 'react-redux';
import { Building, Device } from '@/models';
import { State } from '@/redux/state';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Route } from '@react-navigation/routers';
import { useRoute } from '@react-navigation/core';
// import { StackNavigator } from 'react-navigation';

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
});
const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  buildings: Building[],
  defaultBuilding: Building | undefined,
  route:any
};

const DeviceCard = (props: any) => {
  if(props.deviceType =="gas"){
    return (<View style={{ marginLeft: 20, marginBottom: 15, flexDirection: 'row' }}>
      <View style={deviceCardStyle.iconLayout}>
        <Image
          style={deviceCardStyle.tinyLogo}
          source={require('../assets/img/gasIcon_Noti.png')}
        />
      </View>
      <View style={{ flexDirection: 'column', marginLeft: 20 }}>
        <Text
          style={deviceCardStyle.nameDevice}>Name: {props.nameDevice}
        </Text>
        <Text style={deviceCardStyle.deviceType}>{props.deviceType}</Text>
        <Text
          style={deviceCardStyle.region}>Region: {props.region}
        </Text>
      </View>
      <Text
        style={deviceCardStyle.data}>{props.data}
      </Text>
    </View >)
  }
  else{
    return (<View style={{ marginLeft: 20, marginBottom: 15, flexDirection: 'row' }}>
      <View style={deviceCardStyle.iconLayout}>
        <Image
          style={deviceCardStyle.tinyLogo}
          source={require('../assets/img/tempIcon_Noti.png')}
        />
      </View>
      <View style={{ flexDirection: 'column', marginLeft: 20 }}>
        <Text
          style={deviceCardStyle.nameDevice}>{props.nameDevice}
        </Text>
        <Text style={deviceCardStyle.deviceType}>{props.deviceType}</Text>
        <Text
          style={deviceCardStyle.region}>{props.region}
        </Text>
      </View>
      <Text
        style={deviceCardStyle.data}>{props.data}
      </Text>
    </View >)
  }
  
}

const Body = (props: any) => {
  
  return (
    <View style={styles.body}>
      <View style={{ flexDirection: "row" }}>
        {/* <Button title="name" onPress= {()=>{console.log(props.listDevice[0].data[0].data)}}></Button> */}
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
      <FlatList data={props.listDevice} renderItem={({item}) => <DeviceCard nameDevice = {item.name} deviceType = {item.deviceType} region = {item.region} data = {item.data[item.data.length-1].data ? item.data[item.data.length-1].data : "AB" }></DeviceCard>} />
    </View>
  );
}

class NotificationDaily extends React.Component<Props> {
  render() {
    // const {params} = this.props.navigation.index;
    return (

      <View style={styles.option}>
        <Text style={bodyStyle.nameBuilding}>{this.props.route.params.nameBuilding}</Text>
        {/* <Button title="name" onPress= {()=>{console.log(this.props.route.params.nameBuilding)}}></Button> */}
        <Body listDevice={this.props.buildings[this.props.route.params.index].devices} />
      </View>
    )
  }
}

const bodyStyle = StyleSheet.create({
  nameBuilding:{
    marginLeft: 160,
    marginBottom: 15,
    fontSize: 23,
    
    color: "#21130d"
  },
  detail: {
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 15,
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

const deviceCardStyle = StyleSheet.create({
  iconLayout: {
    justifyContent: 'center',
    marginTop: 5,
    width: 55,
    height: 65,
    borderRadius: 12,
    backgroundColor: "#6495ed"
  },
  deviceType: {
    marginTop: 1,
    fontSize: 18
  },
  nameDevice: {
    marginTop: 5,
    fontSize: 18
  },
  region: {
    fontSize: 20,
    marginTop: 10,
    color: "#aac4ec"
  },
  data: {
    marginTop: 20,
    fontSize: 25,
    marginLeft: "auto",
    marginRight: 20,
    color: "#08cd99"
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
})

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
})

export default connector(NotificationDaily);

