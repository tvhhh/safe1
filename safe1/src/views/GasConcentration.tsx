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
import { LineChart, BarChart } from 'react-native-chart-kit'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const { width } = Dimensions.get('screen');
const gas_data = [5, 1, 3, 6, 3 ,0, 2]
const gas_label = ["MON", "TUE", 'WED', "THU", "FRI", "SAT", "SUN"]
const data = {
  labels: gas_label,
  datasets: [
    {
      data: gas_data,
      color: () => 'rgba(250, 218, 94, 0.8)'
    }               
  ]
}

interface Props {
  navigation: any,
};

class GasConcentration extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  };

  render(){
    let barChartProps = {
        data: data,
        width: width * 0.95, // from react-native
        height: 400,
        yAxisInterval: 1, // optional, defaults to 1,
        yAxisLabel: "",
        yAxisSuffix: "",
        chartConfig: {
          strokeWidth: 3,
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          backgroundGradientTo: "#ffa726",
          color: () => `rgba(250, 218, 94, 0.8)`,
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
        showBarTops: true,
        showValuesOnTopOfBars: true,
        withVerticalLines: false,
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
            <View style={{paddingRight: 30}}><BarChart {...barChartProps}/></View>
            <View style={styles.tempContainer}>
              <MaterialCommunityIcons name = "shield-off" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>highest leakage times</Text>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>on</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.max(...gas_data)} times</Text>
                <Text style={{color:"white"}}>{data.labels[gas_data.indexOf(Math.max(...gas_data))]}</Text>
              </View>          
            </View>
            <View style={styles.tempContainer}>
              <MaterialCommunityIcons name = "shield-check" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>lowest leakage times</Text>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>on</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.min(...gas_data)} times</Text>
                <Text style={{color:"white"}}>{data.labels[gas_data.indexOf(Math.min(...gas_data))]}</Text>
              </View>          
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    )
  }
}

export default GasConcentration;

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
    marginTop: 10,
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
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tempSecondBox: {
    height: 70,
    justifyContent: 'space-around'
  }
});