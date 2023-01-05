import * as yup from 'yup';
import {
  minPassword,
  validationMessage,
} from '../constants/loginValidationMessages';

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(validationMessage.emailInvalid)
    .required(validationMessage.emailRequired),
  password: yup
    .string()
    .required(validationMessage.passwordRequired)
    .min(minPassword, validationMessage.passwordMinRequired),
});
