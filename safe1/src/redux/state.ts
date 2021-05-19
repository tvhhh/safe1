import User from '@/models/users';
import Building from '@/models/buildings';

export type State = {
  currentUser: User | null,
  buildings: Building[],
  defaultBuilding?: Building,
  currentBuildingSettings?: Building
};

const initialState: State = {
  currentUser: null,
  buildings: [],
  currentBuildingSettings: {
    name: "",
    devices: [],
    role: "admin"
  }
};

export default initialState;