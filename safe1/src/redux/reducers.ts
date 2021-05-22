import { Reducer } from '@reduxjs/toolkit';
import { Action, ActionType } from '@/redux/actions';
import initialState, { State } from '@/redux/state';
import { Building, Device } from '@/models';

const reducer: Reducer<State, Action> = (state=initialState, action: Action): State => {
  switch(action.type) {
  case ActionType.ADD_BUILDING:
    return { ...state, buildings: [ ...state.buildings, action.payload ] };
  case ActionType.REMOVE_BUILDING:
    return { ...state, buildings: state.buildings.filter((building: Building) => building.name !== action.payload) };
  case ActionType.RESET_STATE:
    return initialState;
  case ActionType.SET_BUILDINGS:
    return { ...state, buildings: action.payload };
  case ActionType.SET_CONNECTION:
    return { ...state, isConnected: action.payload };
  case ActionType.SET_CURRENT_USER:
    return { ...state, currentUser: action.payload };
  case ActionType.SET_DEFAULT_BUILDING:
    return { ...state, defaultBuilding: action.payload };
  case ActionType.UPDATE_DATA:
    let { name, data } = action.payload;
    if (name === undefined || data === undefined) return state;
    let buildings = state.buildings.map((building: Building) => ({ 
      ...building, 
      devices: building.devices.map((device: Device) =>
        device.name === name ? 
          { ...device, 
            data: [ 
              ...(device.data || []), 
              { time: new Date(), value: data } 
            ] 
          } : device)
    }));
    let defaultBuilding = state.defaultBuilding ? { 
      ...state.defaultBuilding, 
      devices: state.defaultBuilding.devices.map((device: Device) =>
        device.name === name ? 
          { ...device, 
            data: [ 
              ...(device.data || []), 
              { time: new Date(), value: data } 
            ] 
          } : device)
    } : undefined;
    return { ...state, buildings: buildings, defaultBuilding: defaultBuilding };
  default:
    return state;
  }
};

export default reducer;