import { useState, useEffect } from 'react';
import * as qs from 'qs';
import { useFetchClient } from '@strapi/helper-plugin';
import { usePrevious } from '../../../helpers/hooks/usePrevious';
import { useDebounce } from '../../../helpers/hooks/useDebounce';

const useRedirects = ({ pageSize, page, searchValue, sortBy, sortOrder }) => {
  const { get, del } = useFetchClient();
  const [redirects, setRedirects] = useState([]);
  const [totalNumberOfRedirects, setTotalNumberOfRedirects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const prevDebouncedSearchValue = usePrevious(debouncedSearchValue);

  useEffect(() => {
    const fetchRedirects = async () => {
      try {
        setIsLoading(true);

        const query = qs.stringify({
          sort: [`${sortBy}:${sortOrder}`],
          pagination: { pageSize, page },
          filters: {
            $or: [{ from: { $contains: searchValue } }, { to: { $contains: searchValue } }],
          },
        }, { encodeValuesOnly: true });

        const { data } = await get(`/redirects?${query}`);
        setRedirects(data.redirects);
        setTotalNumberOfRedirects(data.total);
      } catch (error) {
        setRedirects([]);
        setTotalNumberOfRedirects(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedirects();
  }, [page, pageSize, sortBy, sortOrder, debouncedSearchValue]);

  const deleteRedirect = async (id) => {
    try {
      await del(`/redirects/${id}`);
      await fetchRedirects(1); // Refetch the first page of redirects after deletion
    } catch (error) {
      console.error('Failed to delete redirect:', error);
    }
  };

  return { redirects, totalNumberOfRedirects, isLoading, deleteRedirect };
};

export default useRedirects;