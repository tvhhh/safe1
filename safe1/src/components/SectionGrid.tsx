import React from 'react';
import {View} from 'react-native';

import {Styles} from '@/styles/sectionGrid';
import ListItem from '@/components/ListItem';
import { DEFAULT_ITEMLIST, ITEMLIST } from '@/assets/itemList';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  selectedRoom: string
};

type ItemListType = {
  id: number;
  name: string;
  icon: string;
  color: string;
  status: string;
  subcolor: string;
}
interface ListState {
  ItemList: ItemListType[]
} 

class List extends React.Component<Props, ListState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ItemList: DEFAULT_ITEMLIST
    };
  }

  componentDidUpdate( prevProps: Props, prevState: ListState){
    const Celcius = '\u00b0\C';
    const Percent = '%'
    if(!this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.selectedRoom;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    console.log(this.props.selectedRoom)
    if(hasDevice){
      var tempData = new Array();
      tempData = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && device.deviceType === 'temperature'
      )
      if(tempData.length >= 1){
        var lastedData = tempData[0].data[tempData[0].data.length-1];
        if(!lastedData && (prevState.ItemList[1].status !== DEFAULT_ITEMLIST[1].status)){
          this.setState({ItemList: DEFAULT_ITEMLIST});
        }
        if(lastedData && lastedData.value){
          var temp: string = lastedData.value.split('-')[0] + Celcius;
          var humid: string = lastedData.value.split('-')[1] + Percent;
          if(temp !== prevState.ItemList[1].status || humid !== prevState.ItemList[2].status){
            ITEMLIST[1].status = temp;
            ITEMLIST[2].status = humid;
            this.setState({ItemList: ITEMLIST});
          }        
        }
        // maybe unnecessary
        if(lastedData && lastedData.data){
          var temp: string = lastedData.data.split('-')[0] + Celcius;
          var humid: string = lastedData.data.split('-')[1] + Percent;
          if(temp !== prevState.ItemList[1].status || humid !== prevState.ItemList[2].status){
            ITEMLIST[1].status = temp;
            ITEMLIST[2].status = humid;
            this.setState({ItemList: ITEMLIST});
          }  
        }
      }
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <ListItem
            styles={{marginRight: 10}}
            item={this.state.ItemList[0]}
          />
          <ListItem
            styles={{}}
            item={this.state.ItemList[1]}
          />
          <ListItem
            styles={{marginLeft: 10}}
            item={this.state.ItemList[2]}
          />
        </View>
      </View>
    );
  }
}

export default connector(List)