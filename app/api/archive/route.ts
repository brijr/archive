import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await list({
      prefix: "archive/",
      cursor: cursor || undefined,
      limit: Math.min(limit, 100), // Cap at 100 to prevent abuse
    });

    return NextResponse.json({
      blobs: result.blobs,
      cursor: result.cursor,
      hasMore: result.hasMore,
    });
  } catch (error: Error | unknown) {
    console.error("Error listing blobs:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error listing blobs";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploaded = [];
    for (const file of files) {
      if (file instanceof File) {
        const result = await put(`archive/${file.name}`, file, {
          access: "public",
          contentType: file.type,
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: true,
        });
        uploaded.push(result);
      }
    }
    return NextResponse.json({ uploaded });
  } catch (error: Error | unknown) {
    console.error("Error uploading files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error uploading files";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
