"use client";

import {
  upload,
  UploadResponse,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit");
        return false;
      }
    }
    
    // Image validation
    if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size exceeds 10MB limit");
        return false;
      }
    }
    
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      
      if (!authRes.ok) {
        throw new Error("Failed to get authentication token");
      }
      
      const auth = await authRes.json();

      const response = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      onSuccess(response);
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload file";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <label 
          htmlFor="file-upload" 
          className={`
            flex items-center justify-center w-full px-4 py-3
            border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${uploading 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 cursor-not-allowed' 
              : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }
            ${error ? 'border-red-400 bg-red-50 dark:bg-red-950/20' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            {uploading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium text-blue-600">Uploading...</span>
              </>
            ) : (
              <>
                <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Click to upload {fileType || "file"}
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {fileType === "video" ? "Max 100MB" : "Max 10MB"}
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
        
        <input
          id="file-upload"
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;