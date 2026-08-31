import { useQuery } from "@tanstack/react-query";

import {
  getCategoryReels,
} from "../api/getCategoryReels";

export function useCategoryReels(
  slug?: string
) {
  return useQuery({
    queryKey: [
      "category-reels",
      slug,
    ],

    queryFn: () =>
      getCategoryReels(slug!),

    enabled: Boolean(slug),
  });
}