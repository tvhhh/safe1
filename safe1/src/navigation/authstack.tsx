import React, { FC } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { SignUp, Login } from '../screens';

const {Navigator, Screen} = createStackNavigator();

const AuthStack : FC = () => {
    return(
        <Navigator>
            <Screen name = "signup" component = {SignUp}></Screen>
            <Screen name = "login" component = {Login}></Screen>
        </Navigator>
    )
}
export default AuthStack