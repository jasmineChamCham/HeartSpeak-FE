import {
  Input,
  Output,
  Conversion,
  ALL_FORMATS,
  BlobSource,
  WebMOutputFormat,
  BufferTarget,
} from "mediabunny";

/**
 * Compresses a media file (image or video)
 * @param file - The file to compress
 * @returns Promise with the compressed File
 */
export async function compressMedia(file: File): Promise<File> {
  if (file.type.startsWith("image/")) {
    return compressImage(file);
  } else if (file.type.startsWith("video/")) {
    return compressVideo(file);
  }
  return file;
}

/**
 * Compresses an image using HTML Canvas
 */
async function compressImage(file: File): Promise<File> {
  const maxWidth = 1920;
  const maxHeight = 1080;
  const quality = 0.8;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        file.type,
        quality,
      );
    };
    img.onerror = (error) => reject(error);
  });
}

/**
 * Compresses a video using Mediabunny
 */
async function compressVideo(file: File): Promise<File> {
  try {
    console.log("Starting video compression with Mediabunny for:", file.name);

    // Setup input
    const input = new Input({
      source: new BlobSource(file),
      formats: ALL_FORMATS,
    });

    // Setup output (convert to WebM which is efficient and supported)
    // We target a buffer first
    const target = new BufferTarget();
    const output = new Output({
      format: new WebMOutputFormat(),
      target: target,
    });

    // Initialize conversion
    const conversion = await Conversion.init({ input, output });

    // Execute conversion
    await conversion.execute();

    // Get result
    const buffer = target.buffer;

    // Create new File
    // Note: Changing extension to .webm as we converted format
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webm";
    return new File([buffer], newName, { type: "video/webm" });
  } catch (error) {
    console.error("Video compression failed:", error);
    // Fallback to original file if compression fails (to avoid blocking upload)
    return file;
  }
}
