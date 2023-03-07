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
}

export const getItems = async () => {
  return fetchApi<ApiResponse<Item[]>>("/items", "GET");
};
