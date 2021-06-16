import React, { Component } from 'react';
import { View, Text } from 'react-native'
import {DEFAULT, REGION} from '@/assets/default.data';
import ScrollingButtonMenu from '@/components/ScrollButton';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import List from '@/components/SectionGrid'

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

let availableRegion:  rooms[]
availableRegion = REGION.map((elem) => ({id: REGION.indexOf(elem), name: elem.charAt(0).toUpperCase() + elem.slice(1)}))
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
};

type rooms = {
  id: number, 
  name: string
}
interface ButtonsState {
  regionState: any,
  selectedIndex: number
}
class roomButtons extends Component<Props, ButtonsState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      regionState: availableRegion,
      selectedIndex: 0
    }
    this.handler = this.handler.bind(this)
  }

  addId = function(arr: string[]){
    var newArr: {id: number, name: string}[] = arr.map((elem) => ({id: arr.indexOf(elem), name: elem}))
    return newArr;
  };

  componentDidMount(){
    if(!this.props.currentUser || !this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var avail = new Array;
    if(devices.length !== 0){
      devices.forEach((device: Device) => {
        var device_region: string = device.region.toLowerCase();
        if(Object.values(REGION).includes(device_region))
          var idx: number;
          idx = REGION.indexOf(device.region.toLowerCase());
          if(!avail.includes(DEFAULT[idx].title))
            avail.push(DEFAULT[idx].title);
      })
      this.setState({regionState: this.addId(avail)});
    }
  }

  handler(id: number){
    this.setState({selectedIndex: id});
  } 

  render () {
    return (
      <View>
        <ScrollingButtonMenu 
          items={this.state.regionState}
          selected={this.state.regionState[0].id}
          callbackId={this.handler}
        />
        <List 
          selectedRoom={this.state.regionState[this.state.selectedIndex].name}
        />
        
      </View>
    );
  }
}

export default connector(roomButtons)