import { Author } from "./author";

export interface Book {
  id: number;
  title: string;
  author?: Author | null;
  author_id?: number | null;
}

export interface BookPayload {
  title: string;
  slug: string;
  author_id: number | null;
}
