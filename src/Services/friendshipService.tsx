import { apiClient } from "../API/urlApi";
import type Friendship from "../types/friendship";
import type FriendRequest from "../types/friendship";

export const friendshipService = {
  async sendRequest(
    friendId: number
  ): Promise<{ message: string; friendshipId: number }> {
    const response = await apiClient.post("/friendship/request", { friendId });
    return response.data;
  },

  async respondToRequest(
    friendshipId: number,
    accept: boolean
  ): Promise<{ message: string; friendshipId: number }> {
    const response = await apiClient.post("/friendship/respond", {
      friendshipId,
      accept,
    });
    return response.data;
  },

  async getFriends(): Promise<Friendship[]> {
    const response = await apiClient.get("/friendship");
    return response.data;
  },

  async getPendingRequests(): Promise<Friendship[]> {
    const response = await apiClient.get("/friendship/pending");
    return response.data;
  },

  async removeFriend(friendId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/friendship/${friendId}`);
    return response.data;
  },

  async blockUser(userIdToBlock: number): Promise<{ message: string }> {
    const response = await apiClient.post(`/friendship/block/${userIdToBlock}`);
    return response.data;
  },
};
