import React from 'react';
import { StyleSheet, Dimensions, Switch, Alert} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import { typeItem } from '@/assets/output.devices';
import { OUTPUT_DEVICES } from '@/assets/output.devices';
import DataService from '@/services/data.service';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  isAvailable: typeItem[],
  currentSensor: string,
  data: Device[],
  hasDevice: boolean
};

interface OnProtectionState {
  toggle: boolean
}

class OnProtection extends React.Component<Props, OnProtectionState>  {
    constructor(props: Props) {
        super(props);
        this.state = {
            toggle: this.props.hasDevice
        };
    }

    componentDidUpdate(prevProps: Props, prevState: OnProtectionState){
        if(this.props.hasDevice !== prevState.toggle){
            this.setState({toggle: this.props.hasDevice})
        }
    }

    setToggle(value: boolean){
        this.setState({toggle: value});
        var dataFormat = this.props.data.find((data: Device) => data.deviceType === this.props.currentSensor);
        
        DataService.updateDeviceProtection({
            deviceName: dataFormat?.name,
            protection: false,
            triggeredValue: dataFormat?.triggeredValue 
        }).then(response => {
        if (response === null) {
            Alert.alert(
                "Update device protection failed",
                "Unknown error from server. Please try again!",
                [{ text: "OK" }]
            );
            return;
        } else {
            Alert.alert(
                "Successfully update protection",
                "Your protection has been updated!",
                [{ text: "OK" }]
            );
            console.log(response)            
        }
        }).catch(err => console.error(err));
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
                disabled={this.props.isAvailable.length == OUTPUT_DEVICES.length? true : false}
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