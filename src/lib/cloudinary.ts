/**
 * Upload a file to Cloudinary using unsigned upload
 * @param file - The file to upload
 * @param onProgress - Optional progress callback (0-100)
 * @param folder - Optional folder path in Cloudinary (default: "media/sessions")
 * @returns Promise with Cloudinary URL
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void,
  folder: string = "media/sessions",
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (error) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    );
    xhr.send(formData);
  });
}

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param onProgress - Optional progress callback (0-100) for overall progress
 * @returns Promise with array of Cloudinary URLs
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  onProgress?: (progress: number) => void,
): Promise<string[]> {
  const urls: string[] = [];
  const totalFiles = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const url = await uploadToCloudinary(file, (fileProgress) => {
      if (onProgress) {
        // Calculate overall progress
        const filesCompleted = i;
        const currentFileProgress = fileProgress / 100;
        const overallProgress =
          ((filesCompleted + currentFileProgress) / totalFiles) * 100;
        onProgress(overallProgress);
      }
    });

    urls.push(url);
  }

  return urls;
}
