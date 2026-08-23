import { useQuery } from "@tanstack/react-query";
import { fetchInitialMockData } from "./mockDataService";
import type { RawMockData } from "./mockDataService";

export const BOARD_QUERY_KEY = ["board-initial-data"];

export const useInitialBoardQuery = () => {
  return useQuery<RawMockData>({
    queryKey: BOARD_QUERY_KEY,
    queryFn: fetchInitialMockData,
    staleTime: Infinity, // Keep initial data cached; Zustand store handles client state mutations
  });
};
