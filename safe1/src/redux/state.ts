import { Building, User } from '@/models';

export type State = {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding?: Building,
};

const initialState: State = {
  currentUser: null,
  buildings: [],
};

export default initialState;