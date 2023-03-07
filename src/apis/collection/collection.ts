import { fetchApi } from "@/apis/apiCaller";
import { Item } from "@/apis/item";
import { ApiResponse } from "@/types";

export interface Collection {
  id: string;
  displayName: string;
  image: string;
  cost: number;
  quantity: number;
}

export interface OpenCollection {
  dropped: Item;
  sellId: string;
  xp: number;
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

export const openCollection = (collectionId: string) => {
  return fetchApi<OpenCollection>("/collections/open", "POST", {
    collectionId,
  });
};

export const buyCollection = (collectionId: string, quantity) => {
  return fetchApi<number>("/collections/buy", "POST", {
    collectionId,
    quantity,
  });
};
