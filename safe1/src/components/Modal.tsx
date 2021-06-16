import React from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User, ProtectionMessage } from '@/models';
import { typeItem } from '@/assets/output.devices';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import { DropDown } from './DropDown';
import DataService from '@/services/data.service';
import actions, { Action } from '@/redux/actions';
const {height, width} = Dimensions.get('screen')

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const mapDispatchToProps = {
  updateProtection: actions.updateProtection
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  updateProtection: (payload: ProtectionMessage) => Action
  hasDevice: boolean,
  item: typeItem
};

interface ModalItemState {
  isModalVisible: boolean,
  relaySetting: number,
  valueSetting: number
}

class ModalItem extends React.Component<Props, ModalItemState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalVisible: false,
      relaySetting: 1,
      valueSetting: this.getInitialSetting()
    };
  }

  getInitialSetting = () => {
    let item = this.props.defaultBuilding?.devices.find((item) => item.name === this.props.item.ID);
    if(item?.triggeredValue !== undefined){
      return parseInt(item?.triggeredValue);
    }
    return 0;
  }

  componentDidUpdate(prevProps: Props, prevState: ModalItemState){
    let getUpdateItem = this.props.defaultBuilding?.devices.find((item) => item.name === this.props.item.ID);

    if(getUpdateItem?.triggeredValue !== prevState.valueSetting.toString() && getUpdateItem?.triggeredValue !== undefined){
      this.setState({valueSetting: parseInt(getUpdateItem?.triggeredValue)});
    }
  }

  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  handleSetting = (value: number) => {
    this.setState({relaySetting: value});
  }

  handleValue = (value: number) => {
    this.setState({valueSetting: Math.round(value)})
  }

  updateData = () => {
    var data: number = -1;
    if(this.props.item.deviceType === 'sprinkler' || this.props.item.deviceType === 'power'){
        data = this.state.relaySetting;
    }else{
        data = this.state.valueSetting;
    }
    
    if(!this.props.defaultBuilding || data === null){
      this.setState({isModalVisible: !this.state.isModalVisible});
      return;
    } 
    var currentDevice = this.props.defaultBuilding.devices.find((item: Device) => 
      this.props.item.ID === item.name)
    if(currentDevice === undefined){
        Alert.alert(
          "ERROR",
          "Could not find the device",
          [{ text: "OK" }]
        );
    }else{
        DataService.updateDeviceProtection({
            deviceName: currentDevice.name,
            protection: currentDevice.protection,
            triggeredValue: data.toString()
        }).then(response => {
        if (response === null) {
          Alert.alert(
            "Update device value failed",
            "Unknown error from server. Please try again!",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Successfully update setting",
            "Your setting has been updated!",
          );
          let msg: ProtectionMessage = {
            _name: response.name, 
            protection: response.protection, 
            triggeredValue: response.triggeredValue
          };
          this.props.updateProtection(msg);
        }
        }).catch(err => console.error(err));
    }
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  render(){
    return(
        <TouchableOpacity onPress={this.props.hasDevice? () => this.toggleModal() : ()=>{}}>
            <View style={[styles.itemContainer, { backgroundColor: '#fff', alignItems: 'center' }]}>
            <Icon name={this.props.item.icon} size={55}/>
            <Text style={[styles.itemName, {fontSize: 30, textAlign: 'center', }]}>{this.props.item.name}</Text>
            <Text style={[styles.itemName, {fontSize: 15, textAlign: 'center', fontWeight: '400', fontStyle: 'italic', marginTop: 5}]}>
              {this.props.item.ID}
            </Text>
            <Modal 
              isVisible={this.state.isModalVisible}
              swipeDirection={'down'}
              backdropColor={'#708090'}
              backdropOpacity={0.8}
            >
            <View style={{backgroundColor: '#FFFFFF', height: 200}}>
                <View style={styles.content}>
                <Text style={[styles.contentTitle, {fontWeight: 'bold', fontSize: 23}]}>{this.props.item.setting} setting</Text>
                {this.props.item.deviceType === 'sprinkler' || this.props.item.deviceType === 'power'?
                    <View style={{width: width/3}}>
                        <DropDown handle={this.handleSetting}/>                   
                    </View>
                    :
                    <View>
                        <Text style={styles.contentTitle} numberOfLines={2}>
                            Adjust value from 0 to {this.props.item.maxSetting}{"\n"} 
                            Current value is {Math.round(this.state.valueSetting) }
                        </Text>
                        <Slider
                            style={{width: 200, height: 40, marginHorizontal: 30, transform: [{scaleY: 1.5}]}}
                            minimumValue={0}
                            maximumValue={this.props.item.maxSetting}
                            minimumTrackTintColor="#000000"
                            maximumTrackTintColor="#000000"
                            onValueChange={value => this.handleValue(value)}
                            value={this.state.valueSetting}
                        />
                    </View>
                }

                <View style={{marginTop: 20, zIndex: -10}}>
                    <Button onPress={() => this.updateData()} title="Close"/>
                </View>
                </View>
            </View>
            </Modal>    
            </View>
        </TouchableOpacity>                                        
    )  
  }
}

export default connector(ModalItem);

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