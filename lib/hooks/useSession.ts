import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface SessionUser {
  id: number;
  username: string;
}

export function useSession() {
  return useQuery<SessionUser | null>({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) throw new Error("Unable to load profile");
      const data = await response.json();
      return data.user;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to open profile");
      return data as SessionUser;
    },
    onSuccess: (user) => {
      queryClient.removeQueries({ queryKey: ["habits"] });
      queryClient.removeQueries({ queryKey: ["stats"] });
      queryClient.setQueryData(["session"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to switch profile");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["habits"] });
      queryClient.removeQueries({ queryKey: ["stats"] });
      queryClient.setQueryData(["session"], null);
    },
  });
}