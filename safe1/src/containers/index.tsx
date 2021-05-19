import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import User from '@/models/users';
import { State } from '@/redux/state';
import actions, { Action } from '@/redux/actions';
import MainContainer from '@/containers/MainContainer';
import SignInContainer from '@/containers/SignInContainer';
import StorageService from '@/services/storage.service';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser
});

const mapDispatchToProps = {
  setCurrentUser: actions.setCurrentUser
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  setCurrentUser: (payload: User | null) => Action
};

class Safe1Container extends React.Component<Props> {
  async componentDidMount() {
    let user = await StorageService.getUser();
    if (user != null) {
      this.props.setCurrentUser(user as User);
    }
  }

  render() {
    return (this.props.currentUser ? <MainContainer/> : <SignInContainer/>);
  }
};

export default connector(Safe1Container);