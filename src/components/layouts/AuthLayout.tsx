import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const VIDEOS = [
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/zxve5zanjjdkgxsfww6t.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/ym3dwvl62zkdgknsy3tw.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/nhjefqf2oma8n8hgg9g9.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/hbrgguokmoel1sutehph.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/nlazobitm1wdszqsium1.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/kcptlxapbdio6mz1zmgt.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/cxpckkg1qva6bqer0qmm.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,w_1280,vc_h264,f_mp4/landing-page-videos/rgt6amutnqlvxdnkhgea.mov",
];

const CLIP_DURATION_MS = 5000;
const FADE_MS = 700;

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const { t } = useTranslation();

    // Two permanent video slots — we alternate which one is visible.
    // No DOM remounting = no blink; CSS opacity does the crossfade.
    const [srcA, setSrcA] = React.useState(VIDEOS[0]);
    const [srcB, setSrcB] = React.useState("");
    const [activeSlot, setActiveSlot] = React.useState<"a" | "b">("a");
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);

    // Refs for use inside timers / event handlers (avoid stale closures)
    const activeSlotRef = React.useRef<"a" | "b">("a");
    const currentIndexRef = React.useRef(0);
    const lockRef = React.useRef(false); // prevent overlapping transitions
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const refA = React.useRef<HTMLVideoElement>(null);
    const refB = React.useRef<HTMLVideoElement>(null);

    const clearTimer = () => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const goTo = React.useCallback((nextIdx: number) => {
        if (lockRef.current) return;
        lockRef.current = true;
        clearTimer();

        const nextSlot: "a" | "b" = activeSlotRef.current === "a" ? "b" : "a";

        // Load next video into the inactive slot
        if (nextSlot === "b") setSrcB(VIDEOS[nextIdx]);
        else setSrcA(VIDEOS[nextIdx]);

        // Wait two frames so the browser applies the new src, then play & crossfade
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const vid = nextSlot === "a" ? refA.current : refB.current;
                if (vid) {
                    vid.currentTime = 0;
                    vid.play().catch(() => { });
                }
                activeSlotRef.current = nextSlot;
                currentIndexRef.current = nextIdx;
                setActiveSlot(nextSlot);
                setCurrentVideoIndex(nextIdx);
                setTimeout(() => { lockRef.current = false; }, FADE_MS);
            });
        });
    }, []);

    // Auto-advance: fires whenever the active slot changes
    React.useEffect(() => {
        const vid = activeSlot === "a" ? refA.current : refB.current;
        if (!vid) return;
        clearTimer();

        let fired = false;
        const onEnded = () => {
            if (fired) return;
            fired = true;
            goTo((currentIndexRef.current + 1) % VIDEOS.length);
        };

        vid.addEventListener("ended", onEnded);
        timerRef.current = setTimeout(onEnded, CLIP_DURATION_MS);

        return () => {
            fired = true;
            clearTimer();
            vid.removeEventListener("ended", onEnded);
        };
    }, [activeSlot, goTo]);

    // Boot: play slot A on first mount
    React.useEffect(() => {
        const vid = refA.current;
        if (!vid) return;
        vid.muted = true;
        vid.currentTime = 0;
        vid.play().catch(() => { });
    }, []);

    const handleNext = () => {
        clearTimer();
        goTo((currentIndexRef.current + 1) % VIDEOS.length);
    };

    const videoClass = (slot: "a" | "b") =>
        `absolute inset-0 w-full h-full object-cover object-center transition-opacity ease-in-out duration-700 ${activeSlot === slot ? "opacity-100" : "opacity-0"
        }`;

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Video Slideshow */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">

                {/* Slot A */}
                <video ref={refA} muted playsInline preload="auto" src={srcA} className={videoClass("a")} />
                {/* Slot B */}
                <video ref={refB} muted playsInline preload="auto" src={srcB} className={videoClass("b")} />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

                {/* UI overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-10 text-white">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/logo-primary-color-without-bg.png"
                            alt="Encantta Logo"
                            className="h-8 w-auto object-contain drop-shadow-lg mt-1.5"
                        />
                        <span className="font-display text-xl font-semibold text-primary tracking-tight drop-shadow-lg">Encantta</span>
                    </Link>

                    <div />

                    {/* Bottom row: copyright | dots + next */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-white/70 drop-shadow-md">
                            {t('auth.rights')}
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Dot indicators */}
                            <div className="flex items-center gap-1.5">
                                {VIDEOS.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === currentVideoIndex ? "bg-white" : "bg-white/35"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Next */}
                            <button
                                onClick={handleNext}
                                aria-label="Next video"
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <ChevronRight className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col items-center justify-center bg-background px-4 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
