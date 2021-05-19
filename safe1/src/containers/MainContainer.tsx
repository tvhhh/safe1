import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Dashboard } from '@/views';

const { Navigator, Screen } = createStackNavigator();

export default class MainContainer extends React.Component{
  render() {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} options={{headerShown: false}}></Screen>
          <Screen name="Dashboard" component={Dashboard} options={{headerTransparent: true, headerTintColor: 'white'}}></Screen>
        </Navigator>
      </NavigationContainer>
    )
  }
};