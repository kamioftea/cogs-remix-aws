import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { Upload } from "~/upload/upload-model.server";
import { FiFileText, FiUpload, FiDownload, FiLoader } from "react-icons/fi";

export interface FileUploadProps {
  name: string;
  uploadId: string | undefined;
  uploadUrl: string;
  downloadUrl: string;
}

export const FileUpload = (props: FileUploadProps) => {
  // This is a super hacky work around to only render on the browser because
  // dropzone doesn't play nicely with SSR.
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  useEffect(
    () => setShouldRender(typeof window !== "undefined"),
    [typeof window]
  );

  return shouldRender ? <FileUploadImpl {...props} /> : null;
};

const FileUploadImpl = ({
  name,
  uploadId,
  uploadUrl,
  downloadUrl,
}: FileUploadProps) => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDrop = useCallback(
    ([file]: File[]) => {
      const body = new FormData();
      body.append("file", file);
      setError(null);
      setIsUploading(true);

      fetch(uploadUrl, {
        method: "POST",
        body,
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }

          throw new Error("Failed to upload image");
        })
        .then((json) => {
          setCurrentId((json as { uploadId: string }).uploadId);
        })
        .catch((err) => setError(err?.message ?? "Failed to upload image"))
        .finally(() => setIsUploading(false));
    },
    [uploadUrl, setCurrentId, setError]
  );

  useEffect(() => setCurrentId(uploadId ?? null), [uploadId]);

  useEffect(() => {
    if (!currentId) {
      setFilename(null);
    } else {
      fetch(`${uploadUrl}/${currentId}`, { method: "GET" })
        .then((res) => res.json())
        .then((json: Upload) => setFilename(json.filename));
    }
  }, [currentId]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
    });

  return (
    <div className="dropzone-container">
      <div
        className={`dropzone${isDragActive ? " active" : ""}${
          isDragReject ? " reject" : ""
        }`}
        {...getRootProps()}
      >
        <input id={name} {...getInputProps()} />
        {isUploading && <FiLoader className="icon-spin" size={"3em"} />}
        {!isUploading &&
          (currentId ? <FiFileText size={"3em"} /> : <FiUpload size={"3em"} />)}
        <input type="hidden" name={name} value={currentId ?? ""} />
        <div className="message">
          {currentId && <p>{filename || "Loading ..."}</p>}
          Select, or drop a file here to {currentId ? "replace" : "upload"}.
          {error && <div className="form-error">{error}</div>}
        </div>
      </div>
      {downloadUrl && uploadId && filename && (
        <a
          href={downloadUrl}
          download={filename}
          target={"_blank"}
          className="button primary"
        >
          <FiDownload /> Download
        </a>
      )}
    </div>
  );
};
