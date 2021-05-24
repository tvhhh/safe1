import { Building, User } from '@/models';

export type State = {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding?: Building,
  isConnected: boolean
};

const initialState: State = {
  currentUser: null,
  buildings: [],
  isConnected: false
};

export default initialState;