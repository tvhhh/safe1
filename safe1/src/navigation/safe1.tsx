import React from 'react'
import { createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer} from '@react-navigation/native';
import Home from '../screens/home'
import Dashboard from '../screens/dashboard'
import Login from '../screens/login'
import SignUp from '../screens/signup'

const {Navigator, Screen} = createStackNavigator()

class Safe1 extends React.Component{
    render() {
        return (
            <NavigationContainer>
                <Navigator>
                    <Screen name = "Home" component = {Home} options = {{headerShown: false}}></Screen>
                    <Screen name = "Dashboard" component = {Dashboard} options = {{headerStyle: {backgroundColor: 'transparent'}}}></Screen>
                    <Screen name = "Login" component = {Login}></Screen>
                    <Screen name = "SignUp" component = {SignUp}></Screen>
                </Navigator>
            </NavigationContainer>
        )
    }
}
export default Safe1;
