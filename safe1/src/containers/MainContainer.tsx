import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBuildingsContainer from '@/containers/MyBuildingsContainer';
import { Home, Dashboard,NotificationHistory,NotificationDaily } from '@/views';

import ControlService from '@/services/control.service';

const { Navigator, Screen } = createStackNavigator();

export default class MainContainer extends React.Component {
  componentDidMount() {
    ControlService.connect();
  }

  render() {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} options={{headerShown: false}} />
          <Screen name="Dashboard" component={Dashboard} options={{headerTransparent: true, headerTintColor: 'white'}} />
          <Screen name="My Buildings" component={MyBuildingsContainer} options={{headerShown: false}} />
          <Screen name="NotificationHistory" component={NotificationHistory} options={{ title: "NOTIFICATION", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed", alignContent: 'center' } }}></Screen>
          <Screen name="NotificationDaily" component={NotificationDaily}options={{ title: "NOTIFICATION DAILY", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed", alignContent: 'center' } }}></Screen>
        </Navigator>
      </NavigationContainer>
    )
  }
};