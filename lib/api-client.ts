import { IVideo } from "@/models/Video";
 
export type VideoFormData = Omit<IVideo, "createdAt" | "updatedAt" | "_id">;

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: Record<string, unknown>
    headers?: Record<string, string>;
};  

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            ...headers,
        };

        const response = await fetch(`/api/${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `API request failed with status ${response.status}`);
        }

        return response.json() as Promise<T>;
    }
       
    async getVideos(): Promise<IVideo[]> { 
        return this.fetch<IVideo[]>("videos");
    }

    async getVideoById(id: string): Promise<IVideo> {
        return this.fetch<IVideo>(`videos/${id}`);
    }

    async createVideo(videoData: VideoFormData): Promise<IVideo> {
        return this.fetch<IVideo>("videos", {
            method: "POST",
            body: videoData,
        });
    }

    async updateVideo(id: string, videoData: Partial<VideoFormData>): Promise<IVideo> {
        return this.fetch<IVideo>(`videos/${id}`, {
            method: "PUT",
            body: videoData,
        });
    }

    async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
        return this.fetch<{ success: boolean; message: string }>(`videos/${id}`, {
            method: "DELETE",
        });
    }
}

export const apiClient = new ApiClient();