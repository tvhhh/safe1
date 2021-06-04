import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'

const { width } = Dimensions.get('screen');

interface Props {
  navigation: any,
};

class GasConcentration extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  };

  render(){
    let lineChartProps = {
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              data: [
                0,
                1,
                0,
                1,
                0,
                1
              ],
              color: () => 'rgba(250, 218, 94, 0.8)'
            }              
          ]
        },
        width: width* 1.1, // from react-native
        height: 220,
        yAxisInterval: 1, // optional, defaults to 1
        chartConfig: {
          strokeWidth: 2,
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          backgroundGradientTo: "#ffa726",
          color: () => `rgba(141, 193, 255, 1)`,
          labelColor: () => 'white',
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
        bezier: true,
        style: styles.chart
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
      </LinearGradient>
    )
  }
}

export default GasConcentration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1.5
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  chartContainer: {
    flex: 5
  },
  chart: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionContainer: {
    flex: 4,
    paddingLeft: 10,
    backgroundColor: 'white',
    opacity: 1,
    justifyContent: 'center',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  tabBar: {
    flexDirection: 'row'
  },
});