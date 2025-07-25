import { list } from "@vercel/blob";
import Image from "next/image";
import type { ListBlobResultBlob } from "@vercel/blob";

async function fetchAllBlobs(): Promise<ListBlobResultBlob[]> {
  const allBlobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    try {
      const result = await list({
        prefix: "archive/",
        cursor: cursor || undefined,
        limit: 50, // Match the API route limit
      });

      allBlobs.push(...result.blobs);
      cursor = result.cursor;
      hasMore = result.hasMore;
    } catch (error) {
      console.error("Error fetching blobs:", error);
      break;
    }
  }

  return allBlobs;
}

export default async function Home() {
  const blobs = await fetchAllBlobs();

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="mb-8">
        Archive of <a href="https://bridger.to">Bridger</a>, a designer.
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {blobs.map((blob) => (
          <Image
            key={blob.url}
            src={blob.url}
            alt={blob.pathname}
            width={500}
            height={300}
            style={{ width: "100%", height: "auto" }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ))}
      </div>
    </div>
  );
}
