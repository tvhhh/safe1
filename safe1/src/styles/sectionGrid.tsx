import {StyleSheet, Dimensions} from 'react-native';

export const FULL_HEIGHT = Dimensions.get('window').height;
export const FULL_WIDTH = Dimensions.get('window').width;

export const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: FULL_WIDTH,
    paddingHorizontal: 12,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 16,
    marginTop: FULL_HEIGHT/20
  },
  flatList: {
    width: FULL_WIDTH,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
});