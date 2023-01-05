import { TimeInInterface, TimeOutInterface } from './UserDashboardInterface';

export interface DashboarDetailsInterface {
  timeIn?: boolean | undefined;
  // Add TimeIn(optional) and TimeOut(optional)
  time_in?: TimeInInterface | undefined;
  time_out?: TimeOutInterface | undefined;
  camera: React.MutableRefObject<any>;
}
