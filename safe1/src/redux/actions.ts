import User from '@/models/users';

export enum ActionType {
  SET_CURRENT_USER = "SET_CURRENT_USER"
};

export interface Action {
  type: ActionType,
  payload: any
}

const actions = {
  setCurrentUser: (payload: User): Action => ({ type: ActionType.SET_CURRENT_USER, payload: payload })
};

export default actions;