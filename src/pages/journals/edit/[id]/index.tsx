import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { getJournalById, updateJournalById } from 'apiSdk/journals';
import { journalValidationSchema } from 'validationSchema/journals';
import { JournalInterface } from 'interfaces/journal';
import { PlantingInterface } from 'interfaces/planting';
import { UserInterface } from 'interfaces/user';
import { getPlantings } from 'apiSdk/plantings';
import { getUsers } from 'apiSdk/users';

function JournalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<JournalInterface>(
    () => (id ? `/journals/${id}` : null),
    () => getJournalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: JournalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateJournalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/journals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<JournalInterface>({
    initialValues: data,
    validationSchema: journalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Journals',
              link: '/journals',
            },
            {
              label: 'Update Journal',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Journal
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.entry}
            label={'Entry'}
            props={{
              name: 'entry',
              placeholder: 'Entry',
              value: formik.values?.entry,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.tag}
            label={'Tag'}
            props={{
              name: 'tag',
              placeholder: 'Tag',
              value: formik.values?.tag,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<PlantingInterface>
            formik={formik}
            name={'planting_id'}
            label={'Select Planting'}
            placeholder={'Select Planting'}
            fetcher={getPlantings}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/journals')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'journal',
    operation: AccessOperationEnum.UPDATE,
  }),
)(JournalEditPage);
