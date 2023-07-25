import * as yup from 'yup';

export const plantingValidationSchema = yup.object().shape({
  name: yup.string().required(),
  date: yup.date().required(),
  user_id: yup.string().nullable(),
});
