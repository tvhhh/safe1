import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Styles from '../styles/listItem';
import Icon from 'react-native-vector-icons/Feather';

type ListItemProps = {
  item: {
    icon: string,
    name: string,
    open: string
  },
  styles: Object,
  dark: Boolean,
};


export const ListItem = ({item, styles, dark}: ListItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={[
        Styles.item,
        styles,
        {
          backgroundColor: dark ? '#24292E' : '#f4f4f4',
          borderWidth: 1,
          borderColor: '#DCDCDC',
        },
      ]}
    >
      <View style={Styles.info}>
        <Icon
          name={item.icon}
          size={30}
          color={dark ? '#f4f4f4' : '#24292e'}
          style={{marginBottom: 10}}
        />
        <Text style={{fontSize: 22, color: dark ? '#f4f4f4' : '#24292e'}}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};