import { fetchApi } from "@/apis/apiCaller";

export const sellItem = (sellId: string) => {
  return fetchApi<number>("/users/sell", "POST", {
    sellId,
  });
};
