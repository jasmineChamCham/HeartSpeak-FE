import * as React from "react";
import { Loader2, FileVideo, FileImage, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaThumbnailProps {
    file?: File;
    url?: string;
    className?: string;
    alt?: string;
}

export function MediaThumbnail({ file, url, className, alt = "Media thumbnail" }: MediaThumbnailProps) {
    const [thumbnail, setThumbnail] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [mediaType, setMediaType] = React.useState<"image" | "video" | "unknown">("unknown");

    React.useEffect(() => {
        let isMounted = true;
        let objectUrl: string | null = null;

        const generate = async () => {
            setIsLoading(true);
            setError(null);
            setThumbnail(null);

            try {
                let sourceUrl = url;
                let type: "image" | "video" | "unknown" = "unknown";

                if (file) {
                    type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "unknown";
                    objectUrl = URL.createObjectURL(file);
                    sourceUrl = objectUrl;
                } else if (url) {
                    const isCloudinary = url.includes("cloudinary.com");
                    const extension = url.split("?")[0].split(".").pop()?.toLowerCase();
                    const videoExtensions = ["mp4", "webm", "ogg", "mov"];
                    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

                    if (videoExtensions.includes(extension || "")) {
                        type = "video";
                    } else if (imageExtensions.includes(extension || "")) {
                        type = "image";
                    }

                    // Optimization: Use Cloudinary's native thumbnail support for remote videos
                    if (isCloudinary && type === "video") {
                        // Change extension to .jpg and add transformation so_0.5 (start offset 0.5s)
                        const baseUrl = url.split("/upload/")[0];
                        const remainingUrl = url.split("/upload/")[1];
                        const [version, ...pathParts] = remainingUrl.split("/");
                        const pathWithNewExt = pathParts.join("/").replace(/\.[^/.]+$/, ".jpg");

                        setThumbnail(`${baseUrl}/upload/so_0.5/${version}/${pathWithNewExt}`);
                        setMediaType("video");
                        setIsLoading(false);
                        return;
                    }

                    if (type === "unknown") {
                        // Fallback: try to detect via path if extension is missing/unknown
                        if (url.includes("/video/")) {
                            type = "video";
                        } else {
                            type = "image";
                        }
                    }
                }

                if (!isMounted) return;
                setMediaType(type);

                if (type === "image") {
                    setThumbnail(sourceUrl || null);
                    setIsLoading(false);
                } else if (type === "video" && sourceUrl) {
                    const video = document.createElement("video");
                    video.src = sourceUrl;
                    video.crossOrigin = "anonymous";
                    video.muted = true;
                    video.playsInline = true;

                    video.onloadedmetadata = () => {
                        // Seek to 0.5s to get a frame
                        video.currentTime = 0.5;
                    };

                    video.onseeked = () => {
                        if (!isMounted) return;
                        try {
                            const canvas = document.createElement("canvas");
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                setThumbnail(canvas.toDataURL("image/jpeg", 0.8));
                            } else {
                                setError("Failed to create canvas context");
                            }
                        } catch (err) {
                            console.error("Thumbnail generation error:", err);
                            setError("Security error generating thumbnail");
                        } finally {
                            setIsLoading(false);
                        }
                    };

                    video.onerror = () => {
                        if (!isMounted) return;
                        console.error("Video load error for thumbnail:", sourceUrl);
                        setError("Failed to load video");
                        setIsLoading(false);
                    };

                    // Safety timeout
                    setTimeout(() => {
                        if (isMounted && isLoading) {
                            // If still loading after 5s, maybe it's too big or slow
                            // We don't error out, but we might want to show a placeholder
                        }
                    }, 5000);

                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Thumbnail failed");
                    setIsLoading(false);
                }
            }
        };

        generate();

        return () => {
            isMounted = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [file, url, isLoading]);

    if (isLoading) {
        return (
            <div className={cn("flex items-center justify-center bg-muted/30 rounded-lg", className)}>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
            </div>
        );
    }

    if (error || !thumbnail) {
        return (
            <div className={cn("flex flex-col items-center justify-center bg-muted/50 rounded-lg border border-dashed border-border p-2", className)}>
                {mediaType === "video" ? <FileVideo className="h-6 w-6 text-muted-foreground" /> : <FileImage className="h-6 w-6 text-muted-foreground" />}
                <span className="text-[10px] text-muted-foreground mt-1 truncate max-w-full">
                    {error || "Preview unavailable"}
                </span>
            </div>
        );
    }

    return (
        <img
            src={thumbnail}
            alt={alt}
            className={cn("object-cover", className)}
        />
    );
}
