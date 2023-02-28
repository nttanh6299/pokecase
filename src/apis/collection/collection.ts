import { fetchApi } from "@/apis/apiCaller";
import { Item } from "@/apis/item";
import { ApiResponse } from "@/types";

export interface Collection {
  id: string;
  displayName: string;
  image: string;
  cost: number;
}

export interface CollectionDetail extends Collection {
  items: Item[];
}

export const getCollections = async () => {
  return fetchApi<ApiResponse<Collection[]>>("/collections", "GET");
};

export const getCollection = (collectionId: string) => {
  return fetchApi<CollectionDetail>("/collections/" + collectionId, "GET");
};
