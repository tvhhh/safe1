import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { 
  Avatar, 
  AddButton, 
  BackButton, 
  NotificationButton,
  Overlay
} from '@/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Building, User } from '@/models';

import ControlService from '@/services/control.service';
import DataService from '@/services/data.service';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';

const { height, width } = Dimensions.get('screen');

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding,
  invitations: state.invitations
});

const mapDispatchToProps = {
  addBuilding: actions.addBuilding,
  removeBuilding: actions.removeBuilding,
  setDefaultBuilding: actions.setDefaultBuilding,
  setInvitations: actions.setInvitations,
  removeInvitation: actions.removeInvitation,
  removeUser: actions.removeUser
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding: Building | undefined,
  invitations: string[],
  addBuilding: (payload: Building) => Action,
  removeBuilding: (payload: string) => Action,
  setDefaultBuilding: (payload?: Building) => Action,
  setInvitations: (payload: string[]) => Action,
  removeInvitation: (payload: string) => Action,
  removeUser: (payload: string) => Action
};

interface MyBuildingState {
  showBuildingsOverlay: boolean;
  showInvitationsOverlay: boolean;
  showInviteBoxOverlay: boolean;
  invitedEmail: string;
};

class MyBuildings extends React.Component<Props, MyBuildingState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showBuildingsOverlay: false,
      showInvitationsOverlay: false,
      showInviteBoxOverlay: false,
      invitedEmail: ""
    };
  }

  componentDidMount() {
    if (this.props.currentUser === null) return;
    DataService.getInvitations(this.props.currentUser)
      .then(response => {
        if (response === null) return;
        this.props.setInvitations(response.map((building: Building) => building.name));
      }).catch(err => console.error(err));
  }

  toggleBuildingsOverlay = () => {
    this.setState({ showBuildingsOverlay: !this.state.showBuildingsOverlay });
  }

  toggleInvitationsOverlay = () => {
    this.setState({ showInvitationsOverlay: !this.state.showInvitationsOverlay });
  }

  toggleInviteBoxOverlay = () => {
    this.setState({ showInviteBoxOverlay: !this.state.showInviteBoxOverlay });
  }

  goToCreateBuilding = () => {
    this.props.navigation.navigate("Create Building");
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  renderMemberList = () => {
    return this.props.defaultBuilding?.members?.map((member: User, index: number) => (
      <View style={styles.memberContainer} key={index}>
        <Avatar size="medium" uri={member.photoURL} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{member.displayName}</Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.role}>
            {this.props.defaultBuilding?.owner && member.uid == this.props.defaultBuilding?.owner.uid ? "Owner" : "Member"}
          </Text>
        </View>
        {this.props.defaultBuilding?.owner && this.props.currentUser && this.props.currentUser.uid == this.props.defaultBuilding?.owner.uid && this.props.currentUser.uid !== member.uid ?
          <TouchableOpacity style={styles.kickButtonContainer} onPress={this.kickUser(member.uid)}>
            <Text style={styles.kickButton}>X</Text>
          </TouchableOpacity> : <View style={styles.kickButtonContainer}></View>
        }
      </View>
    ));
  }

  kickUser = (uid: string) => {
    return () => {
      DataService.kickUser({
        uid: uid,
        buildingName: this.props.defaultBuilding?.name
      }).then(response => {
        if (response === null) {
          Alert.alert(
            "Removing failed",
            "Unknown error from server. Please try again!",
            [{ text: "OK" }]
          );
          return;
        }
        this.props.removeUser(uid);
      }).catch(err => console.error(err));
    }
  }

  switchDefaultBuilding = (building: Building) => {
    return () => {
      this.props.setDefaultBuilding(building);
      this.setState({ showBuildingsOverlay: false });
    }
  }

  renderBuildingList = () => {
    return this.props.buildings.map((building: Building, index: number) => (
      <TouchableOpacity style={styles.buildingContainer} key={index} onPress={this.switchDefaultBuilding(building)}>
        <View style={styles.buildingInfoContainer}>
          <Text style={building.name === this.props.defaultBuilding?.name ? 
            [styles.buildingName, { fontWeight: 'bold' }] : styles.buildingName
          }>{building.name}</Text>
          <Text style={styles.buildingAddress}>{building.address}</Text>
        </View>
      </TouchableOpacity>
    ));
  }

  handleInvitation = (buildingName: string, status: string) => {
    return (status === "accept") ?
      () => DataService.acceptInvitation({ uid: this.props.currentUser?.uid, buildingName: buildingName })
        .then(response => {
          if (response === null) {
            Alert.alert(
              "Accepting failed",
              "Unknown error from server. Please try again!",
              [{ text: "OK" }]
            );
            return;
          }
          this.props.removeInvitation(buildingName);
          ControlService.sub(response);
          this.props.addBuilding(response);
          if (this.props.defaultBuilding === undefined) this.props.setDefaultBuilding(response);
        }).catch(err => console.error(err))
      :
      () => DataService.declineInvitation({ uid: this.props.currentUser?.uid, buildingName: buildingName })
        .then(response => {
          if (response === null) {
            Alert.alert(
              "Rejecting failed",
              "Unknown error from server. Please try again!",
              [{ text: "OK" }]
            );
            return;
          }
          this.props.removeInvitation(buildingName);
        }).catch(err => console.error(err));
  }

  renderInvitationList = () => {
    return this.props.invitations.map((buildingName: string, index: number) => (
      <View style={styles.buildingContainer} key={index}>
        <View style={styles.buildingInfoContainer}>
          <Text style={styles.buildingName}>{buildingName}</Text>
        </View>
        <TouchableOpacity style={{ padding: 5 }} onPress={this.handleInvitation(buildingName, "accept")}>
          <AntDesign name="check" size={30} color='skyblue' />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 5 }} onPress={this.handleInvitation(buildingName, "reject")}>
          <Entypo name="cross" size={30} color='red' />
        </TouchableOpacity>
      </View>
    ));
  }

  leaveBuilding = () => {
    DataService.kickUser({
      uid: this.props.currentUser?.uid,
      buildingName: this.props.defaultBuilding?.name
    }).then(response => {
      if (response === null) {
        Alert.alert(
          "Leaving failed",
          "Unknown error from server. Please try again!",
          [{ text: "OK" }]
        );
      }
      if (this.props.defaultBuilding) this.props.removeBuilding(this.props.defaultBuilding?.name);
      if (this.props.buildings.length > 0) {
        this.props.setDefaultBuilding(this.props.buildings[0]);
      } else {
        this.props.setDefaultBuilding();
      }
    }).catch(err => console.error(err));
  }

  onChangeInvitedEmail = (email: string) => {
    this.setState({ invitedEmail: email });
  }

  onInvitedEmailSubmit = () => {
    DataService.inviteUser({ 
      email: this.state.invitedEmail,
      buildingName: this.props.defaultBuilding?.name
    }).then(response => {
      if (response === null) {
        Alert.alert(
          "Inviting failed",
          "Email does not exist or user is already invited",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Successfully invited",
          "Wait for your member to accept your invitation",
          [{ text: "OK" }]
        );
        this.setState({ invitedEmail: "" });
      }
    }).catch(err => console.error(err));
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
        <NotificationButton onPress={this.toggleInvitationsOverlay} />
        <AddButton onPress={this.goToCreateBuilding} />
        {this.props.buildings.length > 0 ?
          <ScrollView>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.switchBuildingButton} onPress={this.toggleBuildingsOverlay}>
                <Text style={styles.defaultBuildingName}>{this.props.defaultBuilding?.name}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.membersContainer}>
              {this.renderMemberList()}
            </View>
            <View style={styles.buttonContainer}>
              {this.props.defaultBuilding?.owner && this.props.currentUser && this.props.currentUser.uid == this.props.defaultBuilding?.owner.uid ? 
                <TouchableOpacity onPress={this.toggleInviteBoxOverlay}>
                  <Ionicons name="person-add-sharp" size={40} color='rgba(255, 255, 255, 0.8)' />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={this.leaveBuilding}>
                  <MaterialIcons name="exit-to-app" size={40} color='rgba(255, 255, 255, 0.8)' />
                </TouchableOpacity>
              }
            </View>
          </ScrollView>
          :
          <View style={styles.emptyContainer}>
            <FontAwesome name="building-o" size={75} color='rgba(255, 255, 255, 0.8)' />
            <Text style={styles.emptyPrimaryText}>NO BUILDINGS</Text>
            <Text style={styles.emptySecondaryText}>Press + to create a new one</Text>
          </View>
        }
        <Overlay
          isVisible={this.state.showBuildingsOverlay}
          toggle={this.toggleBuildingsOverlay}
          children={
            <ScrollView>
              {this.renderBuildingList()}
            </ScrollView>
          }
        />
        <Overlay
          isVisible={this.state.showInvitationsOverlay}
          toggle={this.toggleInvitationsOverlay}
          children={
            <ScrollView>
              {this.renderInvitationList()}
            </ScrollView>
          }
        />
        <Overlay
          isVisible={this.state.showInviteBoxOverlay}
          toggle={this.toggleInviteBoxOverlay}
          height={height/5}
          children={
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.emailInput}
                underlineColorAndroid="rgba(0, 0, 0, 0.5)"
                placeholder="Enter user's email"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                onChangeText={this.onChangeInvitedEmail}
                value={this.state.invitedEmail}
                autoCapitalize="none"
              />
              <View style={styles.inviteButtonContainer}>
                <TouchableOpacity style={styles.inviteButton} onPress={this.onInvitedEmailSubmit}>
                  <Text style={styles.inviteText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: '20%',
    height: height/6
  },
  switchBuildingButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  defaultBuildingName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20
  },
  buildingContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: '100%'
  },
  buildingInfoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  buildingName: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 18
  },
  buildingAddress: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 16
  },
  membersContainer: {
    alignItems: 'center',
    paddingHorizontal: '6%'
  },
  memberContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 3
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 20
  },
  name: {
    color: 'white',
    fontSize: 16
  },
  roleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  role: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14
  },
  kickButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kickButton: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    width: '100%'
  },
  emailInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  emailInput: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.8)',
    width: '90%'
  },
  inviteButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  inviteButton: {
    backgroundColor: '#002150',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  inviteText: {
    color: 'white',
    fontSize: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyPrimaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  emptySecondaryText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)'
  }
});

export default connector(MyBuildings);