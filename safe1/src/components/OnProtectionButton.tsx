import React from 'react';
import { StyleSheet, Switch, Alert} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User, ProtectionMessage } from '@/models';
import { typeItem } from '@/utils/output.devices';
import DataService from '@/services/data.service';
import actions, { Action } from '@/redux/actions';

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
  isAvailable: typeItem[],
  item: typeItem,
  hasDevice: boolean,
  currentRoom: string
};

interface OnProtectionState {
  toggle: boolean
}

class OnProtection extends React.Component<Props, OnProtectionState>  {
    constructor(props: Props) {
        super(props);
        this.state = {
            toggle: this.getToggle()
        };
    }

    componentDidUpdate(prevProps: Props, prevState: OnProtectionState){
        let items = this.props.defaultBuilding?.devices.filter((item) => 
            item.deviceType === this.props.item.deviceType &&
            item.region.toLowerCase() === this.props.currentRoom.toLowerCase());
        let onProtection = false;
        items !== undefined && items.length !== 0 ? onProtection = items[0].protection : null;
        if( onProtection !== prevState.toggle ){
            this.setState({toggle: onProtection})
        }
    }

    getToggle = () => {
        let item = this.props.defaultBuilding?.devices.find((item) => 
            item.name === this.props.item.ID &&
            item.region.toLowerCase() === this.props.currentRoom.toLowerCase());
        if(item?.protection !== undefined){
            return item.protection;
        }
        return this.props.hasDevice;
    }

    setToggle = (value: boolean) => {
        let currentProtection = this.props.item.deviceType;
        let devices = this.props.defaultBuilding?.devices.filter((item) => 
            item.deviceType === currentProtection && 
            item.region.toLowerCase() === this.props.currentRoom.toLowerCase());
        let flag: boolean = true;
        devices?.map((ele) => {
            DataService.updateDeviceProtection({
                deviceName: ele.name,
                protection: value,
                triggeredValue: ele.triggeredValue 
            }).then(response => {
            if (response === null) {
               flag = false;
            } else {
                let msg: ProtectionMessage = {
                    _name: response.name, 
                    protection: response.protection, 
                    triggeredValue: response.triggeredValue
                };
                this.props.updateProtection(msg);
            }
            }).catch(err => console.error(err));
        })
        if(flag){
            this.setState({toggle: value});
            Alert.alert(
                "Successfully update protection",
                "Your protection has been updated!",
                [{ text: "OK" }]
            );
        }else{
            Alert.alert(
                "Update device value failed",
                "Unknown error from server. Please try again!",
                [{ text: "OK" }]
            );
        }
    }

    render(){
        return (
            <Switch
                trackColor={{false: '#000', true: '#1EC639'}}
                thumbColor="white"
                ios_backgroundColor="gray"
                onValueChange={(value) => this.setToggle(value)}
                value={this.state.toggle}
                style={styles.onOff}
                disabled={this.props.hasDevice? false : true}
            />
        )
    }
 
};

export default connector(OnProtection);

const styles = StyleSheet.create({
  onOff: {
    alignItems: 'flex-start',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    width: 50,
    marginTop: 3,
  }
});