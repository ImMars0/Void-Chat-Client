

  interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  friendUsername: string;
  status: "Pending" | "Accepted" | "Rejected" | "Blocked";
  createdAt: string;
}
export default Friendship;




