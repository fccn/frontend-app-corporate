
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourses } from './api';



export const useCatalogCourses = (catalogId: string) => useQuery({
  queryKey: ['catalogCourses', catalogId],
  queryFn: () => getCourses(catalogId),
});

// export const useDeleteCourse = () => {
//   const mutation = useMutation({
//     mutationFn: async ({ pk }: { pk: number }) => api.deleteTaxonomy(pk),
//     onSuccess: () => {
//       console.log('User created successfully!')
//     },
//     onError: (error) => {
//       console.error('Failed to create user:', error)
//     }
//   })
// };

// /* Builds the mutation to delete a taxonomy.
//  * @returns A function that can be used to delete the taxonomy.
//  */
// export const useDeleteTaxonomy = () => {
//   const queryClient = useQueryClient();
//   const { mutateAsync } = useMutation({
//     mutationFn: async ({ pk }: { pk: number }) => api.deleteTaxonomy(pk),
//     onSettled: (_d, _e, args) => {
//       queryClient.invalidateQueries({ queryKey: taxonomyQueryKeys.taxonomyList() });
//       queryClient.removeQueries({ queryKey: taxonomyQueryKeys.taxonomy(args.pk) });
//     },
//   });
//   return mutateAsync;
// };