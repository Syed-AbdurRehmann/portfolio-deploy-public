import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVideo, deleteVideo, getAdminVideos, getPublicVideos, getVideoCategories, type VideoInput, updateVideo } from "@/lib/video-service";

const PUBLIC_VIDEOS_QUERY_KEY = ["videos"];
const ADMIN_VIDEOS_QUERY_KEY = ["admin-videos"];

export const useVideos = () => {
  const query = useQuery({
    queryKey: PUBLIC_VIDEOS_QUERY_KEY,
    queryFn: getPublicVideos,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const videos = useMemo(() => query.data ?? [], [query.data]);
  const categories = useMemo(() => getVideoCategories(videos), [videos]);

  return {
    ...query,
    videos,
    categories,
  };
};

export const useAdminVideos = (enabled = true) => {
  const query = useQuery({
    queryKey: ADMIN_VIDEOS_QUERY_KEY,
    queryFn: getAdminVideos,
    enabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    videos: query.data ?? [],
  };
};

export const useCreateVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VideoInput) => createVideo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_VIDEOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_VIDEOS_QUERY_KEY });
    },
  });
};

export const useUpdateVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VideoInput }) => updateVideo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_VIDEOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_VIDEOS_QUERY_KEY });
    },
  });
};

export const useDeleteVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_VIDEOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_VIDEOS_QUERY_KEY });
    },
  });
};
