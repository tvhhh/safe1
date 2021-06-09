import React from 'react';
import { StyleSheet, View, Text, Dimensions , Switch} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import { OUTPUT_DEVICES } from '@/assets/output.devices';
const {height, width} = Dimensions.get('screen')

type typeItem = {
  name: string, 
  subtitle: string,
  icon: string,
  deviceType: string
}

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
};

interface ProtectionGridState {
  currentRoom: string,
  availableDevice: typeItem[]
}
class ProtectionGrid extends React.Component<Props, ProtectionGridState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentRoom: '',
      availableDevice: OUTPUT_DEVICES
    };
  }

  // componentDidUpdate(prevProps: Props, prevState: ProtectionGridState){
    
  // } 
  
  componentDidMount(){
    if(!this.props.defaultBuilding) return;
    var devices = this.props.defaultBuilding.devices;
    var roomName: string = this.props.selectedRoom;
    var hasDevice: boolean = devices.some(function(value: Device){
      return value.region.toLowerCase() === roomName.toLowerCase()
    });
    if(hasDevice){
      var outputData = new Array();
      outputData = devices.filter((device: Device) =>  
        device.region.toLowerCase() === roomName.toLowerCase() && 
        device.deviceType !== 'temperature' && 
        device.deviceType !== 'gas'
      )
      console.log(outputData);
      var AVAILABLE_DEVICES = OUTPUT_DEVICES.filter((item: typeItem) => 
        outputData.find((data: Device) => (data.deviceType === item.deviceType)));
      this.setState({availableDevice: AVAILABLE_DEVICES})
    }
  }

  checkAvailabilty(item: typeItem){
    // console.log(this.state.availableDevice);
    return this.state.availableDevice.includes(item);
  }

  render(){
    return (
      <FlatGrid
        itemDimension={width/3}
        data={OUTPUT_DEVICES}
        style={styles.gridView}
        spacing={20}
        renderItem={({ item }: Options) => (
          <View style={this.checkAvailabilty(item)? 
            [styles.itemContainer, { backgroundColor: '#fff', borderColor: '#1EC639', borderWidth: 4}] 
            : [styles.itemContainer, { backgroundColor: '#fff' }]}
          >
            <Icon name={item.icon} size={50}/>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            <OnProtection 
              isAvailable={this.checkAvailabilty(item)}
            />
          </View>
        )}
      />
    );
  }
}

export default connector(ProtectionGrid);

const OnProtection = (props: any) => {
  const [toggle, setToggle] = React.useState(false);
  return <Switch
      trackColor={{false: '#000', true: '#1EC639'}}
      thumbColor="white"
      ios_backgroundColor="gray"
      onValueChange={(value) => setToggle(value)}
      value={toggle}
      style={styles.onOff}
    />
};

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
  }
});