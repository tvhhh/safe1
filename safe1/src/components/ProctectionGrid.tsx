import React from 'react';
import { StyleSheet, View, Text, Dimensions , Switch} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {height, width} = Dimensions.get('screen')

type typeItem = {
    name: string, 
    subtitle: string,
    icon: string,
    status: boolean,
}

interface Options {
    item: typeItem
}

const items = [
  { name: 'Extractor fans', subtitle: 'Propeller devices', icon: 'fan', status: true },
  { name: 'Sprinkler', subtitle: 'Mini pump devices', icon: 'sprinkler-variant', status: true },
  { name: 'Fire alarm', subtitle: 'buzzer devices', icon: 'fire', status: true },
  { name: 'Smart door', subtitle: 'RC servo devices', icon: 'door-open', status: true },
  { name: 'Power system', subtitle: 'relay circut', icon: 'flash', status: false },
];

const OnProtection = (props: any) => {
  const [toggle, setToggle] = React.useState(false);
  return <Switch
      trackColor={{false: '#000', true: '#1EC639'}}
      thumbColor="white"
      ios_backgroundColor="gray"
      onValueChange={(value) => setToggle(value)}
      value={toggle}
      style={styles.onOff}
    />
};

export default function ProtectionGrid() {
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
    alignItems: 'flex-start',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    width: 50,
    marginTop: 3,
  }
});