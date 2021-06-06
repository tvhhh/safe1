import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get('screen');
const highestTempOfDay = [35, 36, 27, 37, 40, 35, 37]
const lowestTempOfDay = [20, 23, 15, 24, 19, 30, 22]

const data = {
  labels: ["MON", "TUE", 'WED', "THU", "FRI", "SAT", "SUN"],
  datasets: [
    {
      data: highestTempOfDay,
      color: () => 'rgba(250, 218, 94, 0.8)'
    },
    {
      data: lowestTempOfDay,
      color: () => '#87CEFA'
    }                  
  ]
}

interface Props {
  navigation: any,
};

class Export extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  };

  render(){
    let lineChartProps = {
        data: data,
        width: width, // from react-native
        height: 400,
        yAxisSuffix: "°C",
        yAxisInterval: 1, // optional, defaults to 1
        chartConfig: {
          strokeWidth: 3,
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
        fromZero: true,
        withVerticalLines: false,
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
        <View style={styles.container}>
          <View style={styles.header}></View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems:'center'}}>
            <LineChart {...lineChartProps}/>
            <View style={styles.tempContainer}>
              <Feather name = "sun" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>highest temperature</Text>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>lowest temperature</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.max(...highestTempOfDay)}°C</Text>
                <Text style={{color:"white"}}>{Math.min(...highestTempOfDay)}°C</Text>
              </View>          
            </View>
            <View style={{padding: 10}}></View>
            <View style={styles.tempContainer}>
              <FontAwesome name = "snowflake-o" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>lowest temperature</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.min(...lowestTempOfDay)}°C</Text>
              </View>          
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    )
  }
}

export default Export;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 40,
    backgroundColor: 'transparent'
  },
  chart: {
    alignItems: 'center'
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    borderRadius: 16,
    width: width * 0.8,
    height: 80,
    backgroundColor: 'rgba(5, 28, 63, 0.5)'
  },
  tempFirstBox: {
    height: 70,
    justifyContent: 'space-around'
  },
  tempSecondBox: {
    height: 70,
    justifyContent: 'space-around'
  }
});