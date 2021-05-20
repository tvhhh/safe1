import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInputBase,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import Label from '@/components/Label'
import Feather from 'react-native-vector-icons/Feather'
import { TabView, SceneMap } from 'react-native-tab-view'

const {height, width} = Dimensions.get('screen')

interface Props {
  navigation: any,
};

class Dashboard extends React.Component<Props> {
  state = {
    index: 0,
    routes: [
      { key: 'day', title: 'Day' },
      { key: 'hour', title: 'Hour' },
      { key: 'minute', title: 'Minute' },
      { key: 'second', title: 'Second' },
    ],
  };

  _handleIndexChange = (index: any) => this.setState({ index });
  _renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map((x: any, i: any) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: any, i: any) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: any) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                borderBottomWidth: 1,
                padding: 16,
                borderColor: `rgba(255, 255, 255, ${opacity}`,
                
              }}
              onPress={() => {this.setState({ index: i });console.log('' + opacity.toString())}}>
              <Text style={{ opacity: opacity, color: 'white' }}>{route.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
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
      withHorizontalLabels: false,
      withHorizontalLines: false,
      bezier: true,
      style: styles.chart
    }
    const Route = () => (
      <LineChart {...lineChartProps}/>
    );

    return (
      <LinearGradient 
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        <View style={styles.headerContainer}></View>
        <TabView
          lazy
          navigationState={this.state}
          renderScene={SceneMap({
            day: Route,
            hour: Route,
            minute: Route,
            second: Route
          })}
          onIndexChange={this._handleIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
          style={styles.chartContainer}
          renderTabBar = {this._renderTabBar}
        />
        
        
        <View style={styles.optionContainer}>
          <Label
            name = "Gas Concentration"
            description = "Manage gas leakage frequency"
            icon={<Feather name="activity" color='#713BDB' size={40}/>}
            onPress = {() => {}}
            buttonPrimaryTextColor='black'
            buttonSecondaryTextColor='black'
            iconBoxColor = '#F8E7E7'
            borderBottomWidth= {0.5}
          />
          <Label
            name = "Temperature"
            description = "Manage temperature pattern"
            icon={<Feather name="thermometer" color='#FF0000' size={40}/>}
            onPress = {() => {}}
            buttonPrimaryTextColor='black'
            buttonSecondaryTextColor='black'
            iconBoxColor = '#F8E7E7'
            borderBottomWidth= {0.5}
          />
          <Label
            name = "Export"
            description = "Export logs"
            icon={<Feather name="external-link" color='#713BDB' size={40}/>}
            onPress = {() => {}}
            buttonPrimaryTextColor='black'
            buttonSecondaryTextColor='black'
            iconBoxColor = '#F8E7E7'
            
          />
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