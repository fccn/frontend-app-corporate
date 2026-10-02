import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryKey as catalogsQueryKey } from '@src/catalogs/data/hooks';
import { catalogListQueryKey } from '@src/catalogs/catalog-list';
import { queryKey as enrollmentsQueryKey } from '@src/catalogs/enrollment-list';
import { queryKey as partnerQueryKey } from '@src/partner/data/hooks';
import { useRemoveLearners } from '@src/catalogs/learner-list/data/hooks';
import { useAddCoursesToCatalog, useDeleteCatalogCourse } from '@src/catalogs/course-list/data/hooks';
import { useUpdateCatalog } from '@src/catalogs/catalog-settings/data/hooks';

jest.mock('wouter', () => ({
  useParams: () => ({ partnerSlug: 'test-partner', catalogSlug: 'test-catalog' }),
}));

jest.mock('@src/catalogs/learner-list/data/api', () => ({
  getCatalogsLearners: jest.fn(),
  deleteLearnersFromCatalog: jest.fn().mockResolvedValue({}),
}));

jest.mock('@src/catalogs/course-list/data/api', () => ({
  ...jest.requireActual('@src/catalogs/course-list/data/api'),
  deleteCourse: jest.fn().mockResolvedValue({}),
  addCoursesToCatalog: jest.fn().mockResolvedValue([]),
}));

jest.mock('@src/catalogs/catalog-settings/data/api', () => ({
  updateCatalog: jest.fn().mockResolvedValue({ slug: 'test-catalog' }),
}));

function setup<T>(hook: () => T) {
  const queryClient = new QueryClient();
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(hook, { wrapper });
  const invalidatedKeys = () => invalidateSpy.mock.calls.map(([filters]) => filters?.queryKey);
  return { result, invalidatedKeys };
}

describe('mutation cache invalidation', () => {
  it('useRemoveLearners refreshes catalog, catalog list, enrollments and partner metrics', async () => {
    const { result, invalidatedKeys } = setup(() => useRemoveLearners());

    result.current.mutate({ catalogId: 'catalog-1', learnerIds: [1] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      catalogsQueryKey.catalogDetail('test-catalog'),
      catalogListQueryKey.catalogLists(),
      enrollmentsQueryKey.catalogEnrollments(),
      partnerQueryKey.partnerDetails('test-partner'),
    ]));
  });

  it('useDeleteCatalogCourse refreshes catalog list and partner metrics', async () => {
    const { result, invalidatedKeys } = setup(() => useDeleteCatalogCourse());

    result.current.mutate({ catalogId: 'catalog-1', data: { catalogCourseIds: [1] } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      catalogListQueryKey.catalogLists(),
      partnerQueryKey.partnerDetails('test-partner'),
    ]));
  });

  it('useAddCoursesToCatalog refreshes catalog list and partner metrics', async () => {
    const { result, invalidatedKeys } = setup(() => useAddCoursesToCatalog());

    result.current.mutate({ catalogId: 'catalog-1', courseIds: ['course-v1:A+B+C'] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      catalogListQueryKey.catalogLists(),
      partnerQueryKey.partnerDetails('test-partner'),
    ]));
  });

  it('useUpdateCatalog refreshes the catalog list', async () => {
    const { result, invalidatedKeys } = setup(() => useUpdateCatalog());

    result.current.mutate({ catalogId: 'catalog-1', data: { userLimit: 10 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidatedKeys()).toEqual(expect.arrayContaining([
      catalogListQueryKey.catalogLists(),
    ]));
  });
});
