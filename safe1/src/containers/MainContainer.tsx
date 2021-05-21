import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBuildingsContainer from '@/containers/MyBuildingsContainer';
import { Home, Dashboard } from '@/views';

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
          <Screen name="Dashboard" component={Dashboard} options={{headerStyle: {backgroundColor: 'transparent'}}} />
          <Screen name="My Buildings" component={MyBuildingsContainer} options={{headerShown: false}} />
        </Navigator>
      </NavigationContainer>
    )
  }
};