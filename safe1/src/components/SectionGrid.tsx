import React from 'react';
import {View} from 'react-native';

import {Styles} from '@/styles/sectionGrid';
import ListItem from '@/components/ListItem';
import {ItemList} from '@/assets/itemList';

export default class List extends React.Component {
  render() {
    return (
      <View style={Styles.container}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <ListItem
            styles={{marginRight: 10}}
            item={ItemList[0]}
          />
          <ListItem
            styles={{}}
            item={ItemList[1]}
          />
          <ListItem
            styles={{marginLeft: 10}}
            item={ItemList[2]}
          />
        </View>
      </View>
    );
  }
}