export interface Source {
  pageNumber: number;
  similarity: number;
  content: string;
}

export interface ChatMessageData {
  id?: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  feedback?: "LIKE" | "DISLIKE" | null;
}
