import { Reducer } from '@reduxjs/toolkit';
import { Action, ActionType } from '@/redux/actions';
import initialState, { State } from '@/redux/state';
import User from '@/models/users';

const reducer: Reducer<State, Action> = (state=initialState, action: Action): State => {
  switch(action.type) {
  case ActionType.SET_CURRENT_USER:
    return { ...state, currentUser: action.payload as User };
  }
};

export default reducer;