import { Building, Message, User } from '@/models';

export enum ActionType {
  ADD_BUILDING = "ADD_BUILDING",
  REMOVE_BUILDING = "REMOVE_BUILDING",
  RESET_BUILDING_SETTINGS = "RESET_BUILDING_SETTINGS",
  RESET_STATE = "RESET_STATE",
  SET_BUILDINGS = "SET_BUILDINGS",
  SET_CURRENT_USER = "SET_CURRENT_USER",
  SET_DEFAULT_BUILDING = "SET_DEFAULT_BUILDING",
  UPDATE_BUILDING_SETTINGS = "UPDATE_BUILDING_SETTINGS",
  UPDATE_DATA = "UPDATE_DATA"
};

export interface Action {
  type: ActionType,
  payload?: any
};

const actions = {
  addBuilding: (payload: Building): Action => ({ type: ActionType.ADD_BUILDING, payload: payload }),
  removeBuilding: (payload: string): Action => ({ type: ActionType.REMOVE_BUILDING, payload: payload }),
  resetState: (): Action => ({ type: ActionType.RESET_STATE }),
  setBuildings: (payload: Building[]): Action => ({ type: ActionType.SET_BUILDINGS, payload: payload }),
  setCurrentUser: (payload: User): Action => ({ type: ActionType.SET_CURRENT_USER, payload: payload }),
  setDefaultBuilding: (payload: Building): Action => ({ type: ActionType.SET_DEFAULT_BUILDING, payload: payload }),
  updateData: (payload: Message): Action => ({ type: ActionType.UPDATE_DATA, payload: payload })
};

export default actions;