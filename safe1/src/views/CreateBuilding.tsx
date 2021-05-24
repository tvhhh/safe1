import React from 'react';
import { 
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BackButton, Input } from '@/components';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';

import { Building, Device, User } from '@/models';
import ControlService from '@/services/control.service';
import DataService from '@/services/data.service';

const { width } = Dimensions.get("screen");

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding
});

const mapDispatchToProps = {
  addBuilding: actions.addBuilding,
  setDefaultBuilding: actions.setDefaultBuilding
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  addBuilding: (payload: Building) => Action,
  setDefaultBuilding: (payload: Building) => Action
};

interface CustomState {
  buildingSettings: Building
};

class CreateBuilding extends React.Component<Props, CustomState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buildingSettings: {
        name: "",
        address: "",
        devices: [
          {
            name: "",
            topic: "",
            data: []
          }
        ],
        members: this.props.currentUser ? [this.props.currentUser] : [],
        owner: this.props.currentUser
      },
    };
  }

  onChangeBuildingName = (text: string) => {
    this.setState({ buildingSettings: { ...this.state.buildingSettings, name: text } });
  }

  onChangeBuildingAddress = (text: string) => {
    this.setState({ buildingSettings: { ...this.state.buildingSettings, address: text } });
  }

  onChangeDeviceName = (index: number) => {
    return (text: string) => {
      let devices = this.state.buildingSettings.devices;
      devices[index].name = text;
      this.setState({ buildingSettings: { ...this.state.buildingSettings, devices: [...devices] } });
    }
  }

  onChangeDeviceTopic = (index: number) => {
    return (text: string) => {
      let devices = this.state.buildingSettings.devices;
      devices[index].topic = text;
      this.setState({ buildingSettings: { ...this.state.buildingSettings, devices: [...devices] } });
    }
  }

  addDeviceInput = () => {
    this.setState({ 
      buildingSettings: {
        ...this.state.buildingSettings,
        devices: [ 
          ...this.state.buildingSettings.devices,
          { name: "", topic: "", data: [] }
        ]
      }
    });
  }

  renderDeviceInputs = (item: Device, index: number) => {
    return (
      <View style={styles.deviceInformationContainer} key={index.toLocaleString()}>
        <Input 
          style={{ flex: 1, marginHorizontal: 3 }}
          placeholder="Device's name"
          fontSize={14}
          value={item.name}
          onChangeText={this.onChangeDeviceName(index)}
        />
        <Input 
          style={{ flex: 1, marginHorizontal: 3 }}
          placeholder="Device's topic"
          fontSize={14}
          value={item.topic}
          onChangeText={this.onChangeDeviceTopic(index)}
        />
      </View>
    );
  }

  onSubmit = () => {
    let building = this.state.buildingSettings;
    building.devices = building.devices.filter((device: any) => device.name.trim().length * device.topic.trim().length > 0);
    this.setState({ buildingSettings: { ...building } });
    DataService.createBuilding(building)
      .then(response => {
        if (response === undefined) return;
        ControlService.sub(response);
        this.props.addBuilding(response);
        if (this.props.defaultBuilding === undefined) this.props.setDefaultBuilding(response);
        this.props.navigation.goBack();
      }).catch(err => console.error(err));
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <LinearGradient 
        colors={['#002150', '#4F9FFF']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      >
        <BackButton onPress={this.goBack} />
        <ScrollView>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/logo.png')} />
          </View>
          <View style={styles.inputContainer}>
            <Input 
              style={{ marginVertical: 10 }}
              title="Name"
              placeholder="Building's name (*)"
              value={this.state.buildingSettings.name}
              onChangeText={this.onChangeBuildingName}
            />
            <Input 
              style={{ marginVertical: 10 }}
              title="Address"
              placeholder="Building's location"
              value={this.state.buildingSettings.address}
              onChangeText={this.onChangeBuildingAddress}
            />
            <View style={styles.devicesInputContainer}>
              <Text style={styles.devicesTitle}>Devices</Text>
              {this.state.buildingSettings.devices.map(this.renderDeviceInputs)}
              <TouchableOpacity style={styles.addButtonContainer} onPress={this.addDeviceInput}>
                <Ionicons name="add-circle-outline" size={50} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.saveButtonContainer} onPress={this.onSubmit}>
          <AntDesign name="check" size={40} color='white' />
        </TouchableOpacity>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  inputContainer: {
    paddingHorizontal: width/15
  },
  devicesInputContainer: {
    marginVertical: 15,
  },
  devicesTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  deviceInformationContainer: {
    flexDirection: 'row'
  },
  addButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default connector(CreateBuilding);