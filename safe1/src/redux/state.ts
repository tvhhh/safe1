import User from '@/models/users';

export type State = {
  currentUser: User | null
};

const initialState: State = {
  currentUser: null
};

export default initialState;