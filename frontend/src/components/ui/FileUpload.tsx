import React, { useRef, useState } from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = "*/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = "Upload Files",
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let errorMsg: string | null = null;

    for (const file of fileArray) {
      if (file.size > maxSize) {
        errorMsg = `File "${file.name}" exceeds maximum size of ${maxSize / 1024 / 1024}MB`;
        break;
      }
      validFiles.push(file);
    }

    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError(null);
    onFilesSelected(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-stack-sm">
      <div
        className={`
          border-2 border-dashed p-8 text-center cursor-pointer transition-all
          ${dragOver ? "border-secondary bg-secondary-container/10" : "border-outline-variant"}
          ${error ? "border-error" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          cloud_upload
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          {label}
        </p>
        <p className="font-caption text-caption text-on-surface-variant/60">
          Drag & drop or click to browse
        </p>
        {error && (
          <p className="font-caption text-caption text-error mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};
