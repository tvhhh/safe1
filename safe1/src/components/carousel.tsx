import React, { PureComponent } from 'react';
import { View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '../utils/SliderEntry';
import { sliderWidth, itemWidth } from '../styles/sliderEntry';
import styles, { colors } from '../styles/carousel';
import {ENTRIES1} from '../assets/entries';

const SLIDER_1_FIRST_ITEM = 0;

interface IMyComponentState {
    slider1ActiveSlide: number
}

export default class RoomDevicesCarousel extends PureComponent<{}, IMyComponentState> {
    private _slider1Ref: any;
    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
        this._slider1Ref = React.createRef();
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
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
                  ref={(c) => {this._slider1Ref  = c}}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
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

