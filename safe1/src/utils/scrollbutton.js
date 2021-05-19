import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default class ScrollingButtonMenu extends React.Component {

    constructor(props) {
        super(props);

        this.scroll = React.createRef();
        this.dataSourceCords = [];

        this.state = {
            index: false,
        };
    }

    componentDidUpdate(prevProps) {
        const {selected} = this.props;
        if (selected && selected.length > 0 && prevProps.selected != this.state.index) {
            this.setState({index: selected});
        }
    }

    componentDidMount() {
        const {selected} = this.props;
        if (selected) {
            this.setState({index: selected}, () => {
                setTimeout(() => {
                    this._scrollTo();
                }, 200);
            });
        }
    }

    _scrollTo() {

        const {index} = this.state;
        const screen1 = screenWidth / 2;
        const elementOffset = this.dataSourceCords[index];
        if (elementOffset !== undefined) {
            let x = elementOffset.x - (screen1 - (elementOffset.width / 2));
            this.scroll.scrollTo({
                y: 0,
                x: x,
                animated: true,
            });
        }

    }

    render() {
        const {items, upperCase, selectedOpacity, activeBackgroundColor, activeColor, buttonStyle, containerStyle} = this.props;
        const {index} = this.state;

        return (
            <View style={[
                styles.scrollArea,
                containerStyle,
            ]}>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={(node) => this.scroll = node}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEventThrottle={200}
                    lazy={false}
                >
                    {
                        items.map((route, i) => (
                            <TouchableOpacity
                                style={[
                                    styles.tabItem,
                                    (index === route.id ? styles.tabItemFocused : {}),
                                    (buttonStyle ? buttonStyle : false),
                                    (index === route.id && activeBackgroundColor ? {backgroundColor: activeBackgroundColor} : false),
                                ]}
                                key={(route.id ? route.id : i).toString()}
                                onPress={() => this.setState({index: route.id}, () => setTimeout(() => {
                                        this._scrollTo();
                                        return this.props.onPress(route);
                                    }, 50)
                                )}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    this.dataSourceCords[route.id] = layout;
                                }}
                                activeOpacity={selectedOpacity}
                            >
                                <Text style={[
                                    styles.tabItemText,
                                    (index == route.id ? styles.tabItemTextFocused : {}),
                                    (index == route.id && activeColor ? {color: activeColor} : false),
                                ]}>
                                    {upperCase ? route.name.toUpperCase() : route.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

ScrollingButtonMenu.propTypes = {
    items: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    upperCase: PropTypes.bool,
    textStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    selected: PropTypes.number,
    selectedOpacity: PropTypes.number,
    containerStyle: PropTypes.object,
};

ScrollingButtonMenu.defaultProps = {
    upperCase: false,
    textStyle: {
        position: 'absolute',
        fontFamily: 'Roboto', 
        padding: 10,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',

    },
    buttonStyle: {
        borderRadius: 10,
        marginRight: 10,
    },
    activeColor: '#FFFFFF',
    activeBackgroundColor: '#434FEA',
    selected: '',
    onPress: () => {

    },
    selectedOpacity: 0.7,
    containerStyle: {},
};

const styles = StyleSheet.create({
    scrollArea: {
        paddingTop: 15,
    },
    scroll: {},
    scrollContainer: {},
    tabItem: {
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        width: screenWidth/3,
    },
    tabItemText: {
        color: '#000000',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'center',
        lineHeight: 20,
    },
    tabItemFocused: {
        borderWidth: 0,
    },
    tabItemTextFocused: {
        color: '#fff',
    },
});