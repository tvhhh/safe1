import React from 'react';
import { Provider } from 'react-redux';
import Safe1Container from '@/containers';
import store from '@/redux/store';

export default class Safe1 extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Safe1Container />
      </Provider>
    );
  }
}