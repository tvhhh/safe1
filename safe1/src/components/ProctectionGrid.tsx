import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {height, width} = Dimensions.get('screen')

type typeItem = {
    name: string, 
    subtitle: string,
    icon: string,
    status: string,
}

interface Options {
    item: typeItem
}

const OnProtection = (props: any) => {
    if (props.status === 'On'){
        return <Icon
            name={'toggle-switch'}
            size={50}
            color={'#1EC639'}
            style={styles.onOff}
        />
    }
    else {
        return <Icon
            name={'toggle-switch-off'}
            size={50}
            style={styles.onOff}
        />
    }
};

export default function ProtectionGrid() {
  const [items, setItems] = React.useState([
    { name: 'Extractor fans', subtitle: 'Propeller devices', icon: 'fan', status: 'On' },
    { name: 'Sprinkler', subtitle: 'Mini pump devices', icon: 'sprinkler-variant', status: 'On' },
    { name: 'Fire alarm', subtitle: 'buzzer devices', icon: 'fire', status: 'On' },
    { name: 'Smart door', subtitle: 'RC servo devices', icon: 'door-open', status: 'Off' },
    { name: 'Power system', subtitle: 'relay circut', icon: 'flash', status: 'On' },
  ]);
  
  return (
    <FlatGrid
      itemDimension={width/3}
      data={items}
      style={styles.gridView}
      spacing={20}
      renderItem={({ item }: Options) => (
        <View style={[styles.itemContainer, { backgroundColor: '#fff' }]}>
            <Icon name={item.icon} size={50}/>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            <OnProtection status={item.status}/>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 150,
    borderColor: '#000',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  itemName: {
    fontSize: 20,
    fontFamily:'Roboto',
    color: '#000',
    fontWeight: '700',
  },
  itemSubtitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  onOff: {
    bottom: 8,
  }
});