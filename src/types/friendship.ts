export interface User {
  id: number;
  userName: string;
  email?: string;
}

export interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  friendUsername: string;
  status: "Pending" | "Accepted" | "Rejected" | "Blocked";
  createdAt: string;
}

export interface FriendRequest {
  friendId: number;
}

export interface FriendResponse {
  friendshipId: number;
  accept: boolean;
}
export interface BlockUser {
  userIdToBlock: number;
}
