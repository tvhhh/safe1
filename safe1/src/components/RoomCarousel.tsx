import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import RoomSliderEntry from '@/components/RoomSliderEntry';
import { sliderHeight, itemHeight, itemWidth } from '@/styles/roomSliderEntry';
import styles from '@/styles/roomCarousel';
import {ENTRIES1} from '@/assets/entries';

const SLIDER_1_FIRST_ITEM = 0;

interface IMyComponentState {
  slider1ActiveSlide: number
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

export default class RoomCarousel extends PureComponent<{}, IMyComponentState> {
  private _slider1Ref: React.RefObject<HTMLInputElement>;
  constructor (props: any) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
    this._slider1Ref = React.createRef();
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
            data={ENTRIES1}
            renderItem={this._renderItemWithParallax}
            sliderHeight={sliderHeight}
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={SLIDER_1_FIRST_ITEM}
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

