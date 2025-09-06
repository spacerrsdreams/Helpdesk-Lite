import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { PostT, TicketStatusT, TicketT } from "@/schemas/tickets.schema";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { getWithInDays } from "@/lib/utils";

function transformPostsToTickets(posts: PostT[]): TicketT[] {
  const statuses: TicketStatusT[] = ["open", "ack", "resolved"];

  return posts.map((post, index) => {
    const updatedAt = post?.manuallyGenerated?.updatedAt
      ? new Date(post.manuallyGenerated.updatedAt)
      : getWithInDays(30);

    const createdAt = post?.manuallyGenerated?.createdAt
      ? new Date(post.manuallyGenerated.createdAt)
      : getWithInDays(60);

    const status = post?.manuallyGenerated?.status ? post.manuallyGenerated.status : statuses[index % statuses.length];
    const assigneeId = post.userId;

    return {
      ...post,
      status,
      assigneeId,
      updatedAt,
      createdAt,
    };
  });
}

export const UseFetchTicketsQueryKey = "fetch-tickets";

// This is POSTS which then is transformed to TICKETS
function useFetchPosts() {
  const { data, ...rest } = useQuery({
    queryKey: [UseFetchTicketsQueryKey],
    queryFn: () => apiRequest<TicketT[]>(ApiRoutes.posts.getAll),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const modifiedData = useMemo(() => (data ? transformPostsToTickets(data) : []), [data]);

  return {
    data: modifiedData,
    ...rest,
  };
}

export function useFetchTickets() {
  const { data, isLoading, error, refetch } = useFetchPosts();

  const tickets = useMemo(() => (data ? transformPostsToTickets(data) : []), [data]);

  return {
    data: tickets,
    isLoading,
    error,
    refetch,
  };
}
