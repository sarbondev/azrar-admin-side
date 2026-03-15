import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type QueryState = Record<string, string>;

export const useQueryParams = (initialState: QueryState = {}) => {
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(initialState).toString(),
  );

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams.entries()) as QueryState,
    [searchParams],
  );

  const updateQueryParams = (params: Partial<QueryState>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (!value) newParams.delete(key);
      else newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const resetQueryParams = () => {
    if (Object.keys(initialState).length) setSearchParams(initialState);
    else setSearchParams({});
  };

  useEffect(() => {
    if (Object.keys(initialState).length) {
      updateQueryParams({ ...initialState, ...queryParams });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { queryParams, updateQueryParams, resetQueryParams };
};
