import { View, Text } from 'react-native';
import React from 'react';
import CameraPreview from './CameraPreview/CameraPreview';
import { DashboarDetailsInterface } from '../../interfaces/DashboardDefaultInterface';
import { DashboardContext } from '../../context/DashboardProviderContext';
import DashboardStyles from './DashboardStyles';

const DashboardDetails: React.FC<DashboarDetailsInterface> = ({
  camera,
  time_in = undefined,
  time_out = undefined,
  timeIn = false,
}) => {
  return (
    <DashboardContext.Consumer>
      {(context) => (
        <>
          <CameraPreview camera={camera} />
          <View style={DashboardStyles.addressTextContainer}>
            <Text style={DashboardStyles.addressText}>
              {timeIn &&
                (time_in !== undefined
                  ? time_in.in_location
                  : context.time_in?.in_location !== 'No Address'
                  ? context.time_in?.in_location
                  : context.address)}
              {!timeIn &&
                (time_out !== undefined
                  ? time_out.out_location
                  : context.time_out?.out_location !== 'No Address'
                  ? context.time_out?.out_location
                  : context.address)}
            </Text>
          </View>
          <View style={DashboardStyles.timeTextContainer}>
            <Text style={DashboardStyles.timeText}>
              {timeIn &&
                (time_in !== undefined
                  ? time_in.timeIn
                  : context.time_in?.timeIn !== 'NA'
                  ? context.time_in?.timeIn
                  : context.time)}
              {!timeIn &&
                (time_out !== undefined
                  ? time_out.timeOut
                  : context.time_out?.timeOut !== 'NA'
                  ? context.time_out?.timeOut
                  : context.time)}
            </Text>
          </View>
        </>
      )}
    </DashboardContext.Consumer>
  );
};

export default DashboardDetails;
