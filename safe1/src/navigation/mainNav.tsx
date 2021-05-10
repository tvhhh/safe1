import React from 'react'
import { NavigationContainer } from '@react-navigation/native';

import AppStack from './appstack'
import AuthStack from './authstack'


class MainNav extends React.Component{
    render() {
        return (
            <NavigationContainer>
                <AppStack/>
            </NavigationContainer>
        )
    }
}
export default MainNav;
