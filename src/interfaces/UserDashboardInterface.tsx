import { PositionInterface } from '../services/api/TimeInOut/PostTimeInOut';

export interface TimeInInterface {
  timeIn?: string | undefined;
  in_location?: string | undefined;
  timein_image?: string | undefined;
}

export interface TimeOutInterface {
  timeOut?: string | undefined;
  out_location?: string | undefined;
  timeout_image?: string | undefined;
}

export interface UserDashboardInterface extends PositionInterface {
  id?: string | undefined;
  time_in?: TimeInInterface | undefined;
  time_out?: TimeOutInterface | undefined;
  setProfileImage: React.Dispatch<React.SetStateAction<string>>;
  address?: string | undefined;
  time?: string | undefined;
}
