import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const {height, width} = Dimensions.get('screen')
const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(25, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: ["Rainy Days"] // optional
};
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(76, 25, 16, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

class Dashboard extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.chart}>
          <LineChart
          data={data}
          width={width}
          height={220}
          chartConfig={chartConfig}
          bezier
          />
        </View>
        <View style={styles.option}>
          <Text>asdasdas</Text>
        </View>
      </View>
    )
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue'
  },
  chart: {
    height: height/2
  },
  option: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'white',
    height: height/2
  }
});