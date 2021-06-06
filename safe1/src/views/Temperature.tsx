import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';

const { width } = Dimensions.get('screen');

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
  buildings: state.buildings
});

const connector = connect(mapStateToProps);

interface Props {
  navigation: any,
};

class Temperature extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      defaultBuilding: this.props.defaultBuilding,
    };
  };
  
  getTempData = () => {
    const temp_data = {
      highestTempOfDay: [],
      lowestTempOfDay: [],
      label: []
    }
    this.state.defaultBuilding.devices.forEach(device => {
      var dict: any = {}
      device.data.forEach(data => {
        const day = new Date(data.time).toDateString().substring(0,3).toLocaleUpperCase()
        if (!(day in dict)){
          dict[day] = []
        }
        dict[day].push(Number(data.data.substring(0, 2)))
      });
      for(const key in dict) {
        var temp = []
        temp.push(Math.max(...dict[key]))
        temp.push(Math.min(...dict[key]))
        temp_data.highestTempOfDay.push(temp[0])
        temp_data.lowestTempOfDay.push(temp[1])
        temp_data.label.push(key)
      }
    });
    return temp_data
  }
  
  render(){
    const temp_data = this.getTempData()
    const data = {
      labels: temp_data.label,
      datasets: [
        {
          data: temp_data.highestTempOfDay,
          color: () => 'rgba(250, 218, 94, 0.8)'
        },
        {
          data: temp_data.lowestTempOfDay,
          color: () => '#87CEFA'
        }                  
      ]
    }
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
        formatYLabel: (y: string) => (Number(y).toString()),
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
                <Text style={{color:"white"}}>{Math.max(...temp_data.highestTempOfDay)}°C</Text>
                <Text style={{color:"white"}}>{Math.min(...temp_data.highestTempOfDay)}°C</Text>
              </View>          
            </View>
            <View style={styles.tempContainer}>
              <FontAwesome name = "snowflake-o" size = {30} color = "white"/>
              <View style={styles.tempFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>lowest temperature</Text>
              </View>
              <View style={styles.tempSecondBox}>
                <Text style={{color:"white"}}>{Math.min(...temp_data.lowestTempOfDay)}°C</Text>
              </View>          
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    )
  }
}

export default connector(Temperature);

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
    justifyContent: 'space-around'
  },
  tempSecondBox: {
    height: 70,
    justifyContent: 'space-around'
  }
});