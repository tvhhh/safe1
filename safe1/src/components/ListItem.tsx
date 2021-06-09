import React, { Component } from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Styles from '../styles/listItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ListItemProps = {
  item: {
    id: number,
    icon: string,
    name: string,
    color: string,
    status: string,
    subcolor: string,
  },
  styles: Object,
};


export default class ListItem extends Component<ListItemProps> {
  constructor (props: ListItemProps) {
    super(props);
  }

  render(){
    const {item, styles} = this.props;

    var OnProtection;
    if (item.status === 'On')
      OnProtection = (
        <Icon
          name={'toggle-switch'}
          size={30}
          color={item.subcolor}
        />
      );
    else if (item.status === 'Off')
      OnProtection =  (
        <Icon
          name={'toggle-switch-off'}
          size={30}
        />
      );
    else
        OnProtection = false;

    const Status = item.id !== 1 ? (
      <Text style={{fontSize: 18, color: item.subcolor, fontWeight: 'bold'}}>
        {item.status}
      </Text>
    ) : false;
    
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          Styles.item,
          styles,
          {
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        <View style={Styles.info}>
          <Icon
            name={item.icon}
            size={40}
            color={item.color}
            style={{marginBottom: 10}}
          />
          <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
            {item.name}
          </Text>
          {Status}
          {OnProtection}
        </View>
      </TouchableOpacity>
    );
  }
}
