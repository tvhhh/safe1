import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBuildingsContainer from '@/containers/MyBuildingsContainer';
import { 
  Home, 
  Dashboard, 
  NotificationHistory, 
  NotificationDaily, 
  RemoteControl, 
  OptionScreen,
  RooomScreen 
} from '@/views';
const { Navigator, Screen } = createStackNavigator();

export default class MainContainer extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} options={{headerShown: false}} />
          <Screen name="Dashboard" component={Dashboard} options={{headerTransparent: true,headerTitle:"Dashboard", headerTintColor: 'white'}} />
          <Screen name="My Buildings" component={MyBuildingsContainer} options={{headerShown: false}} />
          <Screen name="RemoteControl" component={RemoteControl} options={{headerShown: false}} />
          <Screen name="OptionScreen" component={OptionScreen} options={{headerShown: false}} />
          <Screen name="RooomScreen" component={RooomScreen} options={{headerShown: false}} />
          <Screen name="NotificationHistory" component={NotificationHistory} options={{ title: "NOTIFICATION", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed", alignContent: 'center' } }}></Screen>
          <Screen name="NotificationDaily" component={NotificationDaily}options={{ title: "NOTIFICATION DAILY", headerTitleAlign: 'center', headerTitleStyle: { color: "#fff8dc" }, headerStyle: { backgroundColor: "#6495ed", alignContent: 'center' } }}></Screen>
        </Navigator>
      </NavigationContainer>
    )
  }
};