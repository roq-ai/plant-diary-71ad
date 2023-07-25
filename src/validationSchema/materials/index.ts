import * as yup from 'yup';

export const materialValidationSchema = yup.object().shape({
  name: yup.string().required(),
  link: yup.string().required(),
  user_id: yup.string().nullable(),
});
