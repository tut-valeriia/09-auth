import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

interface FilterNotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilterNotesProps): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] || "all";
  const formattedTag =
    currentTag === "all" ? "All notes" : `Notes tagged "${currentTag}"`;

  return {
    title: `${formattedTag} | NoteHub`,
    description: `Browse ${formattedTag.toLowerCase()} in your personal workspace.`,
    openGraph: {
      title: `${formattedTag} | NoteHub`,
      description: `Browse ${formattedTag.toLowerCase()} in your personal workspace.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Notes Filter",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: FilterNotesProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] || "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentTag, 1, ""],
    queryFn: () => fetchNotes({ tag: currentTag, page: 1, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
