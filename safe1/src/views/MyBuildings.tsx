import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building } from '@/models';

const mapStateToProps = (state: State) => ({
  buildings: state.buildings,
  defaultBuilding: state.defaultBuilding
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  buildings: Building[],
  defaultBuilding: Building | undefined
};

class MyBuildings extends React.Component<Props> {
  render() {
    return (
      <LinearGradient 
        colors={['#002150', '#4F9FFF']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.largeText}>
            {this.props.defaultBuilding?.devices[0].data && this.props.defaultBuilding?.devices[0].data.length > 0 ? 
              this.props.defaultBuilding?.devices[0].data[this.props.defaultBuilding?.devices[0].data.length-1].time.toLocaleString() : 
              (new Date()).toLocaleString()}
          </Text>
          <Text style={styles.superText}>
            {this.props.defaultBuilding?.devices[0].data && this.props.defaultBuilding?.devices[0].data.length > 0 ? 
              this.props.defaultBuilding?.devices[0].data[this.props.defaultBuilding?.devices[0].data.length-1].value : 0}
          </Text>
        </View>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  superText: {
    color: 'white',
    fontSize: 100
  },
  largeText: {
    color: 'white',
    fontSize: 30,
  }
});

export default connector(MyBuildings);