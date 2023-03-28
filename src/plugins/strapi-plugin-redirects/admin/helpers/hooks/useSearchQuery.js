import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 10;

const useSearchQuery = () => {
  const { search, pathname } = useLocation();
  const history = useHistory();

  const setNewPage = (newPage) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', newPage);

    history.push({
      pathname: pathname,
      search: '?' + searchParams,
    });
  };

  return useMemo(() => {
    const searchParams = new URLSearchParams(search);

    return {
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : DEFAULT_PAGE_SIZE,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      setNewPage,
    };
  }, [search, pathname, history]);
};

export { useSearchQuery };