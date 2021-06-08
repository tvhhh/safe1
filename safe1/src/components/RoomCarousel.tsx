import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import RoomSliderEntry from '@/components/RoomSliderEntry';
import { sliderHeight, itemHeight, itemWidth } from '@/styles/roomSliderEntry';
import styles from '@/styles/roomCarousel';
import {DEFAULT, REGION} from '@/assets/default.data';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, Device, User } from '@/models';

const SLIDER_FIRST_ITEM = 0;

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
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

class RoomCarousel extends PureComponent<Props, IMyComponentState> {
  private _slider1Ref: React.RefObject<HTMLInputElement>;
  constructor (props: Props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_FIRST_ITEM,
      roomData: DEFAULT
    };
    this._slider1Ref = React.createRef();
  }

  componentDidMount(){
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
      <RoomSliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  render () {
    return (
      <View style={styles.exampleContainer}>
        <Carousel
            ref={() => {this._slider1Ref}}
            data={this.state.roomData}
            renderItem={this._renderItemWithParallax}
            sliderHeight={sliderHeight}
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={SLIDER_FIRST_ITEM}
            inactiveSlideScale={0.90}
            inactiveSlideOpacity={0.8}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            vertical={true}
            loop={true}
            enableMomentum={true}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
      </View>
    );
  }
}

export default connector(RoomCarousel);