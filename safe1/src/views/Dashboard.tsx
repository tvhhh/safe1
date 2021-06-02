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
import Label from '@/components/Label'
import Feather from 'react-native-vector-icons/Feather'
import { TabView, SceneMap } from 'react-native-tab-view'

const { width } = Dimensions.get('screen');

interface Props {
  navigation: any,
};

interface State {
  index: number,
  routes: any
};

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'day', title: 'Day' },
        { key: 'hour', title: 'Hour' },
        { key: 'minute', title: 'Minute' },
        { key: 'second', title: 'Second' },
      ],
    };
  }

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
            <Animated.View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderColor: 'white',
                opacity
              }}>
                <Animated.Text style={{color: 'white'}}>{route.title}</Animated.Text>   
            </Animated.View>
          );
        })}
      </View>
    );
  };

  render(){
    function lineChartProps() {
      return{
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              data: [
                35,
                36,
                27,
                37,
                40,
                35
              ],
              color: () => 'red'
            },
            {
              data: [
                10,
                0,
                10,
                0,
                10,
                0
              ],
              color: () => 'green'
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
        style: styles.chart
      }
    }
    const RouteDay = () => (
      <LineChart {...lineChartProps()}/>
    );
    const RouteHour = () => (
      <LineChart {...lineChartProps()}/>
    );
    const RouteMinute = () => (
      <LineChart {...lineChartProps()}/>
    );
    const RouteSecond = () => (
      <LineChart {...lineChartProps()}/>
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
            day: RouteDay,
            hour: RouteHour,
            minute: RouteMinute,
            second: RouteSecond
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