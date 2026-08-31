import { useQuery } from "@tanstack/react-query";

import { getConversations } from "../api/getConversations";

export function useConversations() {
  return useQuery({
    queryKey: ["chat-conversations"],

    queryFn: getConversations,

    staleTime: 10_000,

    refetchOnWindowFocus: true,
  });
}