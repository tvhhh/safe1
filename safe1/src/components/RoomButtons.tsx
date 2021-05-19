import React, { Component } from 'react';
import { View } from 'react-native'
import {ENTRIES1} from '../assets/entries';
import ScrollingButtonMenu from '../utils/ScrollButton';


let buttons = new Array();
for (var i = 0; i < ENTRIES1.length; i++) {
    let room: any = {};
    room.id = i;
    room.name = ENTRIES1[i].title;
    buttons[i] = room;
}


export default class roombuttons extends Component {
    
    render () {
        return (
            <View>
            <ScrollingButtonMenu 
                items={buttons}
                selected={1}
            />
            </View>
        );
    }
}

