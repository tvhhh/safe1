import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Dashboard, Login } from '@/views';

const { Navigator, Screen } = createStackNavigator()

class Safe1 extends React.Component{
  render() {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} options={{headerShown: false}}></Screen>
          <Screen name="Dashboard" component={Dashboard} options={{headerStyle: {backgroundColor: 'transparent'}}}></Screen>
          <Screen name="Login" component={Login}></Screen>
        </Navigator>
      </NavigationContainer>
    )
  }
}
export default Safe1;