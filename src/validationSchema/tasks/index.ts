import * as yup from 'yup';

export const taskValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.boolean().required(),
  user_id: yup.string().nullable(),
});
