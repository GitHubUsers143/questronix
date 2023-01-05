import { createContext } from 'react';
import { UserDashboardInterface } from '../interfaces/UserDashboardInterface';

export const DashboardContext = createContext<UserDashboardInterface>({
  id: undefined,
  time_in: undefined,
  time_out: undefined,
  coords: {
    latitude: 0.0,
    longitude: 0.0,
  },
  setProfileImage: () => {},
  address: undefined,
  time: undefined,
});
