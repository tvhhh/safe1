import { Reducer } from '@reduxjs/toolkit';
import { Action, ActionType } from '@/redux/actions';
import initialState, { State } from '@/redux/state';
import Building from '@/models/buildings';
import Device from '@/models/devices';

const reducer: Reducer<State, Action> = (state=initialState, action: Action): State => {
  switch(action.type) {
  case ActionType.ADD_BUILDING:
    return { ...state, buildings: [ ...state.buildings, action.payload ] };
  case ActionType.REMOVE_BUILDING:
    return { ...state, buildings: state.buildings.filter((building: Building) => building.name !== action.payload) };
  case ActionType.RESET_BUILDING_SETTINGS:
    return { ...state, currentBuildingSettings: initialState.currentBuildingSettings };
  case ActionType.RESET_STATE:
    return initialState;
  case ActionType.SET_CURRENT_USER:
    return { ...state, currentUser: action.payload };
  case ActionType.UPDATE_BUILDING_SETTINGS:
    return { ...state, currentBuildingSettings: { ...state.currentBuildingSettings, ...action.payload } };
  case ActionType.UPDATE_DATA:
    let { name, data } = action.payload;
    let buildings = state.buildings.map((building: Building) => ({ 
      ...building, 
      devices: building.devices.map((device: Device) =>
        device.name === name ? { ...device, data: [ ...device.data, data ] } : data)
    }));
    return { ...state, buildings: buildings };
  default:
    return state;
  }
};

export default reducer;