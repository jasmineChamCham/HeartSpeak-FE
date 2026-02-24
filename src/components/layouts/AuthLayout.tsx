import * as React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.play().catch(() => {
                // Autoplay was blocked, video will show poster instead
            });
        }
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Video Background */}
            <div className="hidden w-1/2 relative overflow-hidden lg:flex">
                {/* Video Background */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="https://res.cloudinary.com/dyw50hhip/video/upload/q_auto,f_auto,w_854,so_0/landing-page-videos/hbrgguokmoel1sutehph"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    {/* HLS adaptive streaming — loads only what the connection can handle */}
                    <source
                        src="https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:good,w_1280,vc_h264/landing-page-videos/hbrgguokmoel1sutehph.m3u8"
                        type="application/x-mpegURL"
                    />
                    {/* Compressed MP4 fallback */}
                    <source
                        src="https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:good,w_1280,vc_h264,f_mp4/landing-page-videos/hbrgguokmoel1sutehph.mp4"
                        type="video/mp4"
                    />
                </video>

                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo-without-background.png"
                            alt="Logo"
                            className="h-8 w-8 brightness-0 invert filter drop-shadow-lg"
                        />
                        <span className="font-display text-xl font-medium drop-shadow-lg">HeartSpeak</span>
                    </div>


                    {/* Spacer */}
                    <div></div>


                    {/* Copyright */}
                    <div className="text-sm text-white/70 drop-shadow-md">
                        &copy; {new Date().getFullYear()} HeartSpeak. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col items-center justify-center bg-background px-4 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
