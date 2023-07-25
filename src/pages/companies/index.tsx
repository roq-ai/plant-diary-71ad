import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from '@roq/nextjs';
import { compose } from 'lib/compose';
import { Box, Button, Flex, IconButton, Link, Text, TextProps } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Error } from 'components/error';
import { SearchInput } from 'components/search-input';
import Table from 'components/table';
import { useDataTableParams, ListDataFiltersType } from 'components/table/hook/use-data-table-params.hook';
import { DATE_TIME_FORMAT } from 'const';
import d from 'dayjs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { withAppLayout } from 'lib/hocs/with-app-layout.hoc';
import { AccessInfo } from 'components/access-info';
import { getCompanies, deleteCompanyById } from 'apiSdk/companies';
import { CompanyInterface } from 'interfaces/company';

type ColumnType = ColumnDef<CompanyInterface, unknown>;

interface CompanyListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
}

export function CompanyListPage(props: CompanyListPageProps) {
  const { filters = {}, titleProps = {}, showSearchFilter = true, hidePagination, hideTableBorders, pageSize } = props;
  const { hasAccess } = useAuthorizationApi();
  const { onFiltersChange, onSearchTermChange, params, onPageChange, onPageSizeChange, setParams } = useDataTableParams(
    {
      filters,
      searchTerm: '',
      pageSize,
      order: [
        {
          desc: true,
          id: 'created_at',
        },
      ],
    },
  );

  const fetcher = useCallback(
    async () =>
      getCompanies({
        relations: ['user'],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: ['description.contains', 'image.contains', 'name.contains'],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<CompanyInterface>>(
    () => `/companies?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCompanyById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: CompanyInterface) => {
    if (hasAccess('company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/companies/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    { id: 'description', header: 'Description', accessorKey: 'description' },
    { id: 'image', header: 'Image', accessorKey: 'image' },
    { id: 'name', header: 'Name', accessorKey: 'name' },
    { id: 'tenant_id', header: 'Tenant Id', accessorKey: 'tenant_id' },
    hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'user',
          header: 'User',
          accessorKey: 'user',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/users/view/${record.user?.id}`}>
              {record.user?.email}
            </Link>
          ),
        }
      : null,
    {
      id: 'actions',
      header: '',
      accessorKey: 'actions',
      cell: ({ row: { original: record } }: any) => (
        <Flex justifyContent="flex-end">
          <NextLink href={`/companies/view/${record.id}`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              mr={2}
              padding="0rem 8px"
              height="24px"
              fontSize="0.75rem"
              variant="solid"
              backgroundColor="state.neutral.transparent"
              color="state.neutral.main"
              borderRadius="6px"
            >
              View
            </Button>
          </NextLink>
          {hasAccess('company', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/companies/edit/${record.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                padding="0rem 0.5rem"
                height="24px"
                fontSize="0.75rem"
                variant="outline"
                color="state.info.main"
                borderRadius="6px"
                border="1px"
                borderColor="state.info.transparent"
                leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
              >
                Edit
              </Button>
            </NextLink>
          )}
          {hasAccess('company', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
              padding="0rem 0.5rem"
              variant="outline"
              aria-label="edit"
              height={'24px'}
              fontSize="0.75rem"
              color="state.error.main"
              borderRadius="6px"
              borderColor="state.error.transparent"
              icon={<FiTrash width="12px" height="12px" color="error.main" />}
            />
          )}
        </Flex>
      ),
    },
  ].filter(Boolean) as ColumnType[];

  return (
    <Box p={4} rounded="md" shadow="none">
      <Flex justifyContent="space-between" mb={4}>
        <Flex alignItems="center" gap={1}>
          <Text as="h1" fontSize="1.875rem" fontWeight="bold" color="base.content" {...titleProps}>
            Companies
          </Text>
          <AccessInfo entity="company" />
        </Flex>
        {hasAccess('company', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/companies/create`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              height={'2rem'}
              padding="0rem 0.75rem"
              fontSize={'0.875rem'}
              fontWeight={600}
              bg="state.info.main"
              borderRadius={'6px'}
              color="base.100"
              _hover={{
                bg: 'state.info.focus',
              }}
              mr="4"
              as="a"
            >
              <FiPlus size={16} color="state.info.content" style={{ marginRight: '0.25rem' }} />
              Create
            </Button>
          </NextLink>
        )}
      </Flex>
      {showSearchFilter && (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          mb={4}
          gap={{ base: 2, md: 0 }}
        >
          <Box></Box>
          <Box>
            <SearchInput value={params.searchTerm} onChange={onSearchTermChange} />
          </Box>
        </Flex>
      )}

      {error && (
        <Box mb={4}>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box mb={4}>
          <Error error={deleteError} />{' '}
        </Box>
      )}
      <>
        <Table
          hidePagination={hidePagination}
          hideTableBorders={hideTableBorders}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          columns={columns}
          data={data?.data}
          totalCount={data?.totalCount || 0}
          pageSize={params.pageSize}
          pageIndex={params.pageNumber}
          order={params.order}
          setParams={setParams}
          onRowClick={handleView}
        />
      </>
    </Box>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'company',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(CompanyListPage);
