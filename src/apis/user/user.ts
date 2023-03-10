import { fetchApi } from "@/apis/apiCaller";

export const sellItems = (sellIds: string[]) => {
  return fetchApi<number>("/users/sell", "POST", {
    sellIds,
  });
};
