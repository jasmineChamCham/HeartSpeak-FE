import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

const ImagePreview = ({ file }: { file: File }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <img
      src={previewUrl}
      alt={file.name}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const VideoPreview = ({ file }: { file: File }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <video
      src={previewUrl}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      controls={false}
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 10,
  accept = "image/*,video/*",
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
          "hover:border-primary/50 hover:bg-sage-light/30",
          isDragging
            ? "border-primary bg-sage-light/50 scale-[1.02]"
            : "border-border bg-card/50",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className="rounded-full bg-sage-light p-4"
          >
            <Upload className="h-8 w-8 text-primary" />
          </motion.div>

          <div className="space-y-2">
            <p className="font-display text-lg font-medium text-foreground">
              Drop your chat screenshots here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • Supports images and videos
            </p>
            <p className="text-xs text-muted-foreground">
              {files.length}/{maxFiles} files uploaded
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-soft"
              >
                {file.type.startsWith("image/") ? (
                  <ImagePreview file={file} />
                ) : file.type.startsWith("video/") ? (
                  <VideoPreview file={file} />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs font-medium text-primary-foreground">
                    {file.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
