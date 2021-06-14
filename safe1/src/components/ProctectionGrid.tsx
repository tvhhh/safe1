import React from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableOpacity, Switch } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import { OUTPUT_DEVICES, typeItem } from '@/assets/output.devices';
import OnProtection  from '@/components/OnProtectionButton';
import ModalItem from '@/components/Modal'

const {height, width} = Dimensions.get('screen')

interface Options {
  item: typeItem
}

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  selectedRoom: string,
  setNum?: any,
  isSetting?: boolean,
};

interface ProtectionGridState {
  currentRoom: string,
  availableDevice: typeItem[],
  availableData: Device[],
  hasDevice: boolean,
  isModalVisible: boolean,
  relaySetting: number,
  valueSetting: number
}

class ProtectionGrid extends React.Component<Props, ProtectionGridState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentRoom: '',
      availableDevice: OUTPUT_DEVICES,
      hasDevice: false,
      availableData: [],
      isModalVisible: false,
      relaySetting: 1,
      valueSetting: 0
    };
  }
  
  componentDidMount(){
    if(!this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.selectedRoom;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    this.setState({hasDevice: hasDevice});
    if(hasDevice){
      var outputData = new Array();
      outputData = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      this.setState({availableData: outputData});
      var AVAILABLE_DEVICES = OUTPUT_DEVICES.filter((item: typeItem) => 
        outputData.find((data: Device) => (data.deviceType === item.deviceType)));
      if(this.props.setNum !== undefined) this.props.setNum(AVAILABLE_DEVICES.length)    
      this.setState({availableDevice: AVAILABLE_DEVICES});
    }
  }

  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  handleSetting = (value: number) => {
    console.log(value)
    if(typeof(value) === 'number') 
      this.setState({relaySetting: value})
  }

  handleValue = (value: number) => {
    console.log(value)
    this.setState({valueSetting: value})
  }

  render(){
    return (
      this.props.isSetting? 
        <FlatGrid
          itemDimension={width/3}
          data={this.state.availableDevice.length > 0? this.state.availableDevice : OUTPUT_DEVICES}
          style={styles.gridView}
          spacing={20}
          renderItem={({ item }: Options) => (
            <ModalItem item={item} hasDevice={this.state.hasDevice}/>
          )}
        />
        :
        <FlatGrid
          itemDimension={width/3}
          data={this.state.availableDevice.length > 0? this.state.availableDevice : OUTPUT_DEVICES}
          style={styles.gridView}
          spacing={20}
          renderItem={({ item }: Options) => (
            <View style={[styles.itemContainer, { backgroundColor: '#fff' }]}>
              <Icon name={item.icon} size={50}/>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              <OnProtection 
                isAvailable={this.state.availableDevice}
                currentSensor={item.deviceType}
                data={this.state.availableData}
                hasDevice={this.state.hasDevice}
              />
            </View>
          )}
        />
    );
  }
}

export default connector(ProtectionGrid);

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 150,
    borderColor: '#000',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  itemName: {
    fontSize: 20,
    fontFamily:'Roboto',
    color: '#000',
    fontWeight: '700',
  },
  itemSubtitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  onOff: {
    alignItems: 'flex-start',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    width: 50,
    marginTop: 3,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontFamily:'Roboto',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center'
  },
});