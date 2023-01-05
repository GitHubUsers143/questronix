import React, { useState } from 'react';
import { SafeAreaView, View, Text, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import TimesheetStyles from '../../../screens/Timesheet/TimesheetStyles';
import { COLORS } from '../../../constants/colors';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

// interface TimesheetInterface {
//   selectedDate: string;
//   department: string;
//   milestone: string;
//   projectCode: string;
//   projectActivity: string;
//   time: string;
//   comments: string;
// }

const schema = yup.object().shape({
  selectedDate: yup.date(),
  department: yup.string(),
  milestone: yup.string().required('Required'),
  projectCode: yup.string().required('Required'),
  projectActivity: yup.string().required('Required'),
  time: yup.string(),
  comments: yup.string(),
});

const defaultValues = {
  selectedDate: new Date(),
  department: '',
  milestone: '',
  projectCode: '',
  projectActivity: '',
  time: '',
  comments: '',
};

const TimesheetScreen = () => {
  const [dateModal, setDateModal] = useState<boolean>(false);
  const {
    control,
    // handleSubmit,
    // formState: { errors },
    // formState,
    // setValue,
    // reset,
    // getValues,
    // watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const watchShowLanguage = watch('language', false);

  // const onSubmit = (data: TimesheetInterface) =>
  //   console.log(JSON.stringify(data));

  return (
    <SafeAreaView style={TimesheetStyles.root}>
      <View style={TimesheetStyles.container}>
        <View style={TimesheetStyles.timesheetFormContainer}>
          <View
            style={{
              backgroundColor: COLORS.ROYALBLUE,
              borderRadius: 6,
              paddingLeft: widthPercentageToDP(1),
              marginTop: heightPercentageToDP(2),
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              SELECTED DATE
            </Text>
          </View>
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center', //Centered vertically
                  alignItems: 'center',
                }}
              >
                <DatePicker
                  androidVariant={
                    Platform.OS === 'android' ? 'nativeAndroid' : 'iosClone'
                  }
                  mode='date'
                  textColor='white'
                  date={defaultValues.selectedDate}
                  onDateChange={onChange}
                />
                <Button
                  style={{ backgroundColor: COLORS.ROYALBLUE }}
                  icon={<Icon name='calendar' size={15} color='white' />}
                  onPress={() => setDateModal(!dateModal)}
                />
                <DatePicker
                  modal
                  androidVariant={
                    Platform.OS === 'android' ? 'nativeAndroid' : 'iosClone'
                  }
                  mode='date'
                  open={dateModal}
                  date={new Date()}
                  onConfirm={(date) => onChange(date)}
                  onCancel={() => setDateModal(!dateModal)}
                />
              </View>
            )}
            name='selectedDate'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TimesheetScreen;
