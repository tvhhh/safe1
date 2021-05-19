import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  name: string,
  description: string,
  icon: JSX.Element,
  onPress: () => void
}

export default class Label extends React.Component<Props> {
  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}
      >
        <View style={styles.iconBox}>
          {this.props.icon}
        </View>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonPrimaryText}>{this.props.name}</Text>
          <Text style={styles.buttonSecondaryText}>{this.props.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonPrimaryText: {
    color: 'white',
    fontSize: 16,
  },
  buttonSecondaryText: {
    color: 'white',
    opacity: 0.75,
    fontSize: 12,
  },
  buttonTextContainer: {
    paddingLeft: 30
  },
  iconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 10,
    padding: 6,
  }
});