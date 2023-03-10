import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Nullable } from "@/types";

interface UrlFilter {
  slug: string;
  values: string[];
}

type State = {
  filters: Nullable<UrlFilter[]>;
  keyword?: Nullable<string>;
  sortBy?: Nullable<string>;
  sortDirection?: Nullable<string>;
};

type GetValueOptions<T> = {
  parse?: (value: string) => T;
  defaultValue?: T;
};

type ForceOption = "push" | "stay";

type FilterKey = keyof State;

const getValue = <T>(key: FilterKey, options?: GetValueOptions<T>) => {
  if (typeof window === "undefined") {
    // Not available in an SSR context
    return null;
  }
  const query = new URLSearchParams(window.location.search);
  const value = query.get(key);

  if (value !== null) {
    return options?.parse ? options.parse(value) : (value as unknown as T);
  }
  return options?.defaultValue || null;
};

// saleType.ON_AUCTION.ON_SALE;collection.0x00000.0x11111
// => [{ slug: 'saleType', values: ['ON_AUCTION', 'ON_SALE'] }, { slug: 'collection', values: ['0x00000', ''0x11111'] }]
const parseQueryFilters = (query: string): UrlFilter[] => {
  const filters: UrlFilter[] = [];
  query.split(";").forEach((attributeWithValues) => {
    const splitted = attributeWithValues.split(".");
    const attributeFilter = { slug: splitted[0], values: splitted.slice(1) };
    if (attributeFilter.values.length > 0) {
      filters.push(attributeFilter);
    }
  });
  return filters;
};

// { slug: 'saleType', values: ['ON_AUCTION', 'ON_SALE'] } => saleType.ON_AUCTION.ON_SALE
const serializeQueryFilters = (attributes: UrlFilter[]): string =>
  attributes
    ?.filter((attribute) => attribute.values?.length > 0)
    .map((attribute) => [attribute.slug, ...attribute.values].join("."))
    .join(";");

const calculateAddFilter = (
  filtersState: UrlFilter[],
  slug: string,
  newValues: string[]
) => {
  let filters = filtersState || [];
  const existingFilter = filters.find((filter) => filter.slug === slug);
  if (!existingFilter) {
    const newFilter = { slug, values: [...newValues] };
    filters = [...filters, newFilter];
  } else {
    filters = [
      ...filters.filter((filter) => filter.slug !== existingFilter.slug),
      { ...existingFilter, values: [...newValues] },
    ];
  }
  return filters;
};

const calculateRemoveFilter = (
  filtersState: UrlFilter[],
  slug: string,
  removedValue: string
) => {
  const filters = filtersState || [];
  const newFilters = filters?.reduce(
    (result: UrlFilter[], filter: UrlFilter) => {
      if (filter.slug !== slug) {
        return [...result, filter];
      }

      const newFilterValues = filter.values.filter(
        (value) => value !== removedValue
      );
      if (newFilterValues?.length) {
        return [...result, { ...filter, values: newFilterValues }];
      }
      return result;
    },
    []
  );

  return newFilters?.length ? newFilters : null;
};

const parseQueryString = (newState: State) => {
  const query = new URLSearchParams(window.location.search);
  const setQuery = <T>(
    key: string,
    serialize: (value: T) => Nullable<string>,
    value: Nullable<T> | undefined
  ) => {
    if (value === null || value === undefined) {
      query.delete(key);
      return;
    }

    const queryString = serialize(value);
    if (!queryString) {
      query.delete(key);
    } else {
      query.set(key, queryString);
    }
  };

  Object.keys(newState).forEach((key: keyof State) => {
    switch (key) {
      case "keyword":
      case "sortBy":
      case "sortDirection":
        setQuery(key, (value) => value, newState[key]);
        break;
      default:
        setQuery(
          key,
          serializeQueryFilters,
          newState[key as FilterKey] as UrlFilter[]
        );
    }
  });

  return query.toString();
};

type IHookArgs = {
  defaultSortBy?: string;
  defaultSortDirection?: string;
  defer?: boolean;
};

export const allOption = {
  label: "All",
  value: "all",
};

const useFilter = (props?: IHookArgs) => {
  const { defaultSortBy, defaultSortDirection, defer } = props ?? {};
  const router = useRouter();

  const urlFilters = getValue("filters", {
    parse: parseQueryFilters,
    defaultValue: [],
  });
  const urlSortBy = getValue("sortBy", { defaultValue: defaultSortBy || "" });
  const urlSortDirection = getValue("sortDirection", {
    defaultValue: defaultSortDirection || "",
  });
  const urlKeyword = getValue("keyword", { defaultValue: "" });

  const [state, setState] = useState<State>({
    filters: urlFilters,
    sortBy: urlSortBy,
    sortDirection: urlSortDirection,
    keyword: urlKeyword,
  });

  const pushState = (newState: State) => {
    const search = parseQueryString(newState);
    const {
      location: { hash },
    } = window;
    const url = {
      pathname: router.pathname,
      hash,
      search,
    };
    const as = {
      pathname: window.location.pathname,
      hash,
      search,
    };
    const options = { scroll: false, shallow: false };
    router.push(url, as, options);
  };

  const setNewState = (newState: State, force?: ForceOption) => {
    setState(newState);

    if (force === "stay") {
      return;
    }

    if (!defer || force === "push") {
      pushState(newState);
    }
  };

  const modify = <T>(key: FilterKey, value: T, force?: ForceOption) => {
    const newState: State = {
      ...state,
      [key]: value,
    };
    setNewState(newState, force);
  };

  const addFilters = (slug: string, newValues: string[]) =>
    modify("filters", calculateAddFilter(state.filters || [], slug, newValues));
  const addKeyword = (value: string) => modify("keyword", value, "push");
  const addSortBy = (value: string) => modify("sortBy", value, "push");
  const addSortDirection = (value: string) =>
    modify("sortDirection", value, "push");

  const removeFilter = (slug: string, removedValue: string) => {
    const newState: State = { ...state };
    newState.filters = calculateRemoveFilter(
      state.filters || [],
      slug,
      removedValue
    );
    setNewState(newState);
  };

  const clearAllFilters = (includedKeyword?: boolean, force?: ForceOption) => {
    const newState: State = {
      ...state,
      filters: null,
      sortBy: null,
      sortDirection: null,
    };

    if (typeof includedKeyword === "boolean" && includedKeyword) {
      newState.keyword = null;
    }

    setNewState(newState, force);
  };

  const submitFilter = () => {
    pushState(state);
  };

  const checkFilterChecked = (slug: string, value: string) => {
    return filters
      ?.find((filter) => filter.slug === slug)
      ?.values?.includes(value);
  };

  const hasFilterValues = (slug: string) => {
    return filters?.find((filter) => filter.slug === slug)?.values?.length > 0;
  };

  const filters = useMemo(() => state.filters, [state.filters]);
  const keyword = useMemo(() => state.keyword, [state.keyword]);
  const sortBy = useMemo(() => state.sortBy, [state.sortBy]);
  const sortDirection = useMemo(
    () => state.sortDirection,
    [state.sortDirection]
  );

  return {
    filters,
    keyword,
    sortBy,
    sortDirection,
    urlFilters,
    urlSortBy,
    addFilters,
    addKeyword,
    addSortBy,
    addSortDirection,
    removeFilter,
    clearAllFilters,
    submitFilter,
    checkFilterChecked,
    hasFilterValues,
  };
};

export default useFilter;
