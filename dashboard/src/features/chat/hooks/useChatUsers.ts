import { useQuery } from "@tanstack/react-query";
import { getChatUsers } from "../api/getChatUsers";

export function useChatUsers(
  search?: string
) {
  return useQuery({
    queryKey: ["chat-users", search],
    queryFn: () => getChatUsers(search),
  });
}