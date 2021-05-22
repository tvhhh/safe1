import React from 'react';
import {View} from 'react-native';

import {Styles} from '@/styles/sectionGrid';
import {ListItem} from '@/utils/listItem';

const ItemList = [
  { id: 1, 
    name: 'About', 
    icon: 'info', 
    open: 'Home'
  },
  { id: 2, 
    name: 'Settings', 
    icon: 'settings', 
    open: 'Home'
  },
  {
    id: 3,
    name: 'Configurations',
    icon: 'sliders',
    open: 'Home'
  },
];
export default class List extends React.Component {
  render() {
    return (
      <View style={Styles.container}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <ListItem
            dark={false}
            styles={{marginRight: 10}}
            item={ItemList[0]}
          />
          <ListItem
            dark={false}
            styles={{}}
            item={ItemList[1]}
          />
          <ListItem
            dark={false}
            styles={{marginLeft: 10}}
            item={ItemList[2]}
          />
        </View>
      </View>
    );
  }
}