import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert
} from 'react-native';
import { Building } from '@/models';
import { Svg, Rect, Text as TextSVG }  from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import {Device} from '@/models';

const { width } = Dimensions.get('screen')

  
const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
  buildings: state.buildings
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  navigation: any,
  defaultBuilding: Building | undefined,
};

interface CustomState {
  tooltipPos: any,
  sessionTime: string,
}

class GasConcentration extends React.Component<Props, CustomState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tooltipPos: {
        x: 0,
        y: 0,
        visible: false,
        time: "",
        value: 0
      },
      sessionTime: "",
    }
  };
  
  

  getDevices = (typeDevice: string = "") => {
    if (typeDevice === "") {
      return this.props.defaultBuilding.devices
    } else {
      return this.props.defaultBuilding.devices.filter(device => device.deviceType == typeDevice)
    }
  }

  getGasData = () => {
    let gas_data = {
      gas: [],
      label: []
    }

    if (this.props.defaultBuilding !== undefined) {
      const devices = this.getDevices("gas")
      devices.forEach((device: Device) => {
        device.data.forEach(data => {
          const time = new Date(data.time)
          gas_data.gas.push(Number(data.value))
          gas_data.label.push(time)
        });
      });
    }
    return gas_data
  }
  
  getHourMinuteSecond = (date: Date) => {
    const hour = this.formatTime(date.getHours())
    const minute = this.formatTime(date.getMinutes())
    const second = this.formatTime(date.getSeconds())
    return `${hour}:${minute}:${second}`
  } 

  formatTime = (num: number) => {
    if (num < 10) {
      return `0${num}`
    }
    return `${num}`
  }

  checkIfHadDevice = () => {
    return this.getDevices("gas").length !== 0
  }

  lastTriggered = (gas_data: any) => {
    let len = gas_data.label.length
    for (let i = len - 1; i >= 0; i--) {
      if (gas_data.gas[i] === 1) {
        return gas_data.label[i]
      }
    }
    return -1
  }

  sessionTime = (date1: Date, date2: Date) => {
    var delta = Math.abs(date2 - date1) / 1000;

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    var seconds = Math.floor(delta % 60); 

    return days.toString() + ':' + this.formatTime(hours) + ':' +
            this.formatTime(minutes) + ':' + this.formatTime(seconds)
  }


  renderDeviceEmptyBuilding = () => {
    return(
      <View style={styles.emptyContainer}>
        
        <FontAwesome name="building-o" size={75} color='rgba(255, 255, 255, 0.8)' />
        <Text style={styles.emptyPrimaryText}>NO BUILDINGS</Text>
        <Text style={styles.emptySecondaryText}>Please create at least one building!</Text>
    </View>
    )  
  }

  renderEmptyDevice = () => {
      return(
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="leak" size={75} color='rgba(255, 255, 255, 0.8)'/>
          <Text style={styles.emptyPrimaryText}>NO DEVICES</Text>
          <Text style={styles.emptySecondaryText}>Please add a temperature device!</Text>
        </View>
      )    
  }

  renderDeviceEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="database" size={75} color='rgba(255, 255, 255, 0.8)'/>
        <Text style={styles.emptyPrimaryText}>NO DATA</Text>
        <Text style={styles.emptySecondaryText}>Gas sensor device has not received any data!</Text>
      </View>
    )  
  }

  componentDidUpdate() {
    var date1 = new Date(this.lastTriggered(this.getGasData())); 
    var date2 = new Date();
    this.interval = setInterval(() => this.setState({ sessionTime: this.sessionTime(date1, date2)}), 1000)
}

  componentWillUnmount() {
    clearInterval(this.interval)
  }



  renderData = (gas_data: any) => {
    
    // this.interval = setInterval(this.setState({sessionTime: date1.toTimeString()}), 1000)

    let currCondtion = gas_data.gas[gas_data.gas.length - 1]
    let data = {
      labels: gas_data.label.slice(-12),
      datasets: [
        {
          data: gas_data.gas.slice(-12),
          color: () => 'rgba(250, 218, 94, 0.8)'
        }               
      ]
    }
    if (this.checkIfHadDevice() === true) {
      return(
        <View style={styles.container}>
          <View style={styles.header}></View>
          {this.getGasData().gas.length !== 0 ? 
          <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems:'center'}}>
            <LineChart
              onDataPointClick={({ value, index, x, y }) => {
                // check if we have clicked on the same point again
                let isSamePoint = (this.state.tooltipPos.x === x
                                    && this.state.tooltipPos.y ===  y)
              
                // if clicked on the same point again toggle visibility
                // else,render tooltip to new position and update its value
                isSamePoint ? this.setState((previousState)=> ({
                                    tooltipPos: {
                                        ...previousState.tooltipPos, 
                                        value: value,
                                        time: new Date(data.labels[index]).toDateString().substring(4),
                                        visible: !previousState.tooltipPos.visible}
                                    }))
                              : 
                              this.setState({
                                tooltipPos: {
                                    x: x, 
                                    y: y,
                                    value: value,
                                    time: new Date(data.labels[index]).toDateString().substring(4),
                                    visible: true
                                  }
                                })
            }} // end function,
            decorator={() => {
              return this.state.tooltipPos.visible ? <View>
              <Svg>
                  <Rect 
                    x={this.state.tooltipPos.x -40}
                    y={this.state.tooltipPos.y + 10}
                    width="80"  
                    height="45"
                    fill="white"
                    rx={5}
                    />
                  <TextSVG
                    x={this.state.tooltipPos.x}
                    y={this.state.tooltipPos.y + 25}
                    fill="black"
                    fontSize="12.5"
                    textAnchor="middle">
                    {this.state.tooltipPos.time}
                  </TextSVG>
                  <TextSVG
                    x={this.state.tooltipPos.x}
                    y={this.state.tooltipPos.y + 50}
                    fill="black"
                    fontSize="12.5"
                    textAnchor="middle">
                    {this.state.tooltipPos.value === 1 ? "Triggered" : "Untriggered"}
                  </TextSVG>
              </Svg>
          </View> : null
          }}
              data={data}
              width={width} // from react-native
              verticalLabelRotation={270}
              xLabelsOffset={30}
              height={300}
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
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
                  r: "2",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "", // solid background lines with no dashes
                  opacity: 0.15
                }
              }}
              formatYLabel={(y: string) => {
                let isInteger = Number.isInteger(Number(y))
                if (isInteger) {
                  return Number(y).toString()
                }
                return ""
              }}
              formatYLabel = {(y:string) => {
                if (Number(y) === 1 || Number(y) === 0) {
                  return Number(y).toString()
                }
                return ""
              }}
              formatXLabel = {(x: string) => this.getHourMinuteSecond(new Date(x))}
              fromZero
              withVerticalLines={false}
              bezier
              style={styles.chart}
            />
            
            <View style={styles.gasContainer}>
              {currCondtion !== 1 ? 
                <MaterialCommunityIcons name="shield-check" size={30} color="white"/>
              :
                <MaterialCommunityIcons name="shield-alert" size={30} color="white"/>
              }
              <View style={styles.gasFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>Current condition</Text>
              </View>
              <View style={styles.gasSecondBox}>
                {currCondtion === 1 ?
                  <Text style={{color:"white"}}>Triggered</Text>
                :
                  <Text style={{color:"white"}}>Untriggered</Text>}
              </View>          
            </View>
            <View style={styles.gasContainer}>
              <MaterialCommunityIcons name="radar" size={30} color='white'/>
              <View style={styles.gasFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>Last triggered at</Text>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>on</Text>
              </View>
              <View style={styles.gasSecondBox}>
                  <Text style={{color: 'white'}}>{this.getHourMinuteSecond(this.lastTriggered(gas_data))}</Text>
                  <Text style={{color: 'white'}}>{new Date(this.lastTriggered(gas_data)).toDateString().substring(4)}</Text>
              </View>          
            </View>
            <View style={styles.gasContainer}>
              <MaterialCommunityIcons name="shield-home" size={30} color='white'/>
              <View style={styles.gasFirstBox}>
                <Text style={{color: "rgba(255, 255, 255, 0.3)"}}>Session safe time</Text>
                <Text style={{color: 'white'}}>{this.state.sessionTime}</Text>
              </View>
              <View style={styles.gasSecondBox}>
              </View>        
            </View>
          </ScrollView>
          : this.renderDeviceEmptyData()}
        </View>
      )
    }
    return this.renderEmptyDevice()
  }
  

  render(){
    return (
      <LinearGradient 
        colors={['#4F9FFF', '#002150']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.5}}
      >
        {this.props.defaultBuilding !== undefined? 
          this.renderData(this.getGasData())
          : this.renderDeviceEmptyBuilding()}
      </LinearGradient>
    )
  }
}

export default connector(GasConcentration);

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
  gasContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    borderRadius: 16,
    width: width * 0.8,
    height: 80,
    backgroundColor: 'rgba(5, 28, 63, 0.5)'
  },
  gasFirstBox: {
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  gasSecondBox: {
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  gasText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyPrimaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  emptySecondaryText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)'
  }
});