import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface MediaLightboxProps {
    url: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MediaLightbox({ url, isOpen, onClose }: MediaLightboxProps) {
    if (!url) return null;

    const isVideo = url.includes("/video/upload/") || url.split("?")[0].match(/\.(mp4|webm|ogg|mov)$/i);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-black/95 shadow-2xl sm:rounded-2xl">
                <DialogTitle className="sr-only">Media Preview</DialogTitle>
                <div className="relative flex min-h-[40vh] max-h-[90vh] w-full items-center justify-center p-2 sm:p-6">
                    {isVideo ? (
                        <video
                            src={url}
                            controls
                            autoPlay
                            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl outline-none"
                        />
                    ) : (
                        <img
                            src={url}
                            alt="Full size preview"
                            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
