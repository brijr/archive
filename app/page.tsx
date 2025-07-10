import { list } from "@vercel/blob";

import Image from "next/image";

import type { ListBlobResultBlob } from "@vercel/blob";

export default async function Home() {
  let blobs: ListBlobResultBlob[] = [];

  try {
    const result = await list({ prefix: "archive/" });
    blobs = result.blobs;
  } catch (error: Error | unknown) {
    console.error("Error fetching blobs:", error);
  }

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
            style={{ width: "100%", height: "auto" }}
            placeholder="blur"
          />
        ))}
      </div>
    </div>
  );
}
