import * as yup from 'yup';

export const journalValidationSchema = yup.object().shape({
  entry: yup.string().required(),
  tag: yup.string(),
  planting_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
