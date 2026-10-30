import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
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

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username: string;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
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
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(payload: AuthPayload): Promise<User> {
  const response = await api.post<User>("/auth/register", payload);
  return response.data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const response = await api.post<User>("/auth/login", payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(payload: UpdateUserPayload): Promise<User> {
  const response = await api.patch<User>("/users/me", payload);
  return response.data;
}
