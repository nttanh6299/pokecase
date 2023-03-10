import { fetchApi } from "../apiCaller";
import { ApiResponse } from "@/types";

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
  return fetchApi<ApiResponse<Item[]>>("/items", "GET", null, params);
};
