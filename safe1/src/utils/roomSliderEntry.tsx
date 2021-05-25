import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { ParallaxImage } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/sliderEntry'

const DEVICE = 'sensors'

interface Props {
    data: {
        title: string, 
        num: string,
        illustration: string
    },
    even: boolean,
    parallax: boolean,
    parallaxProps: Object
}

export default class SliderEntry extends Component<Props> {
    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, num }, even } = this.props;

        const Title = num ? (
            <View style={styles.topTextContainer}>
                <Text
                    style={styles.title}
                    numberOfLines={2}
                >
                    { num } {DEVICE}
                </Text>
                <Icon 
                    name={'circle-slice-8'}
                    size={20}
                    color={'green'}
                    style={{    
                        position: 'absolute',
                        padding: 13,
                        right: 0,
                    }}
                />
            </View>
            
        ) : false;
        
        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, , even ? styles.titleEven : {color: 'black'}]}
            >
                { title }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { Alert.alert(`You've clicked '${title}'`); }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                </View>
                <View style={[styles.roomTextContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                </View>
                {Title}
            </TouchableOpacity>
        );
    }
}