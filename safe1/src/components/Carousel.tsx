import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '@/components/SliderEntry';
import { sliderWidth, itemWidth } from '@/styles/sliderEntry';
import styles, { colors } from '@/styles/carousel';
import {DEFAULT, REGION} from '@/assets/default.data';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';
import actions, { Action } from '@/redux/actions';

const SLIDER_FIRST_ITEM = 0;

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const mapDispatchToProps = {
  setDefaultBuilding: actions.setDefaultBuilding,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
  setDefaultBuilding: (payload?: Building) => Action,
};

interface IMyComponentState {
  slider1ActiveSlide: number,
  roomData: data[]
}

type data = {
  title: string, 
  num: string,
  illustration: Object
}

type input = {
  item: data,
  index: number
}

class RoomDevicesCarousel extends PureComponent<Props, IMyComponentState> {
  private _slider1Ref: React.RefObject<HTMLInputElement>;
  constructor (props: any) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_FIRST_ITEM,
      roomData: DEFAULT
    };
    this._slider1Ref = React.createRef();
  }

  componentDidMount(){
    console.log(this.props.defaultBuilding?.name);

    if(!this.props.defaultBuilding) return;
    let ROOM_DATA = new Array();
    ROOM_DATA = DEFAULT.map((elem) => ({...elem}));
    var devices = this.props.defaultBuilding.devices;
    devices.forEach((device: Device) => {
      if(Object.values(REGION).includes(device.region.toLowerCase()))
        var idx: number, value: number;
        idx = REGION.indexOf(device.region.toLowerCase());
        value = parseInt(ROOM_DATA[idx].num) + 1;
        ROOM_DATA[idx].num = value.toString();
    })

    this.setState({roomData: ROOM_DATA})
  }

  _renderItemWithParallax = ({item, index}: input, parallaxProps: Object) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  main () {
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={() => {this._slider1Ref}}
          data={this.state.roomData}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          autoplay={true}
          loop={true}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
        <Pagination
          dotsLength={this.state.roomData.length}
          activeDotIndex={this.state.slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'#434FEA'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.dot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }


  render () {
    const example = this.main();

    return (
        <View style={styles.entire}>                    
          { example }  
        </View>
    );
  }
}

export default connector(RoomDevicesCarousel)