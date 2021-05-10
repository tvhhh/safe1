import React, { FC } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { Home, Dashboard } from '../screens';

const {Navigator, Screen} = createStackNavigator();

class AppStack extends React.Component {
    render(){
        return(
            <Navigator screenOptions = {{headerShown: false}}>
                <Screen name = "Home" component = {Home}></Screen>
            </Navigator>
        )
    }
}
export default AppStack;