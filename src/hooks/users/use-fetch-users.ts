import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { UserT } from "@/schemas/user.schemas";
import { apiRequest, ApiRoutes } from "@/lib/api";

const UseFetchUsersQueryKey = "fetch-users";

export const useFetchUsers = () => {
  const { data, ...rest } = useQuery({
    queryKey: [UseFetchUsersQueryKey],
    queryFn: () => apiRequest<UserT[]>(ApiRoutes.users.getAll),
    staleTime: Infinity,
  });

  const usersMap = useMemo(() => new Map(data?.map((user) => [user.id, user])), [data]);

  return {
    data,
    usersMap,
    ...rest,
  };
};
