import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryParams = (initialState = {}) => {
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(initialState).toString()
  );

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const update = (params) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const reset = () => {
    if (Object.keys(initialState).length) {
      setSearchParams(initialState);
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (!!Object.keys(initialState).length) {
      update({
        ...initialState,
        ...queryParams,
      });
    }
  }, []);

  return {
    queryParams,
    updateQueryParams: update,
    resetQueryParams: reset,
  };
};
