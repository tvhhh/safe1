import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import {LineChart} from 'react-native-chart-kit'
import { BackgroundImage } from 'react-native-elements/dist/config';

const {height, width} = Dimensions.get('screen')

class Dashboard extends React.Component {
  render(){
    let lineChartProps = {
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100
            ]
          }
        ]
      },
      width: width * 1.2, // from react-native
      height: 220,
      yAxisLabel: "$",
      yAxisSuffix: "k",
      yAxisInterval: 1, // optional, defaults to 1
      chartConfig: {
        strokeWidth: 2,
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: () => `rgba(141, 193, 255, 1)`,
        labelColor: () => `rgba(255, 255, 255, 1)`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "0",
        },
        propsForBackgroundLines: {
          strokeDasharray: "", // solid background lines with no dashes
          opacity: 0.15
        }
      },
      withHorizontalLabels: false,
      withHorizontalLines: false,
      bezier: true,
      style: styles.chartContainer
    }
    return (
      <LinearGradient 
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        <View style={styles.headerContainer}></View>
        <LineChart {...lineChartProps}/>
        <View style={styles.optionContainer}>
        </View>
      </LinearGradient>
    )
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1
  },
  chartContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionContainer: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 16,
  }
});