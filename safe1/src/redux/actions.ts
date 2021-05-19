import Building from '@/models/buildings';
import Message from '@/models/messages';
import User from '@/models/users';

export enum ActionType {
  ADD_BUILDING = "ADD_BUILDING",
  REMOVE_BUILDING = "REMOVE_BUILDING",
  RESET_BUILDING_SETTINGS = "RESET_BUILDING_SETTINGS",
  RESET_STATE = "RESET_STATE",
  SET_CURRENT_USER = "SET_CURRENT_USER",
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
  resetBuildingSettings: (): Action => ({ type: ActionType.RESET_BUILDING_SETTINGS }),
  resetState: (): Action => ({ type: ActionType.RESET_STATE }),
  setCurrentUser: (payload: User | null): Action => ({ type: ActionType.SET_CURRENT_USER, payload: payload }),
  updateBuildingSettings: (payload: any): Action => ({ type: ActionType.UPDATE_BUILDING_SETTINGS, payload: payload }),
  updateData: (payload: Message): Action => ({ type: ActionType.UPDATE_DATA, payload: payload })
};

export default actions;