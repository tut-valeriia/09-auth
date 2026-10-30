import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function checkSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const response = await api.get<User | null>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const { page = 1, perPage = 12, search = "", tag } = params;
  const requestParams: Record<string, string | number> = { page, perPage };

  if (search.trim()) {
    requestParams.search = search.trim();
  }
  if (tag && tag.toLowerCase() !== "all") {
    requestParams.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: requestParams,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
