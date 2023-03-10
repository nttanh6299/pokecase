export interface Option {
  label: string;
  value: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: Meta;
}

export type Nullable<T> = T | null;
