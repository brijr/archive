"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE_NAME = "upload_auth";

function getCookie(name: string) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (getCookie(COOKIE_NAME) === "1") {
      setAuthed(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    try {
      const res = await fetch("/api/archive", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      router.push("/");
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setPwError("");

    try {
      const res = await fetch("/api/upload-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthed(true);
        setPassword("");
      } else {
        setPwError(data.error || "Incorrect password");
      }
    } catch (err) {
      setPwError("Authentication failed");
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  if (!authed) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Password Required</h1>
        <form onSubmit={handlePassword}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ marginRight: "1rem" }}
            disabled={authLoading}
          />
          <button type="submit" disabled={authLoading}>
            {authLoading ? "Verifying..." : "Enter"}
          </button>
        </form>
        {pwError && <p style={{ color: "red" }}>{pwError}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload Images</h1>
      <input type="file" multiple onChange={handleChange} />
      <button
        onClick={handleUpload}
        disabled={!files || uploading}
        style={{ marginLeft: "1rem" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
