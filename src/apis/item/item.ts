import { fetchApi } from "../apiCaller";

export interface Item {
  id: string;
  name: string;
  displayName: string;
  image: string;
  class: string;
  cost: number;
  chance: number;
  sellId?: string
}

export interface ItemParams {
  search?: string;
  sort: {
    direction: string;
    type: string;
  };
  filters: {
    classes?: string[];
  };
}

export const getItems = async (params: ItemParams) => {
  return fetchApi<Utils.ApiResponse<Item[]>>("/items", "GET", null, params);
};
