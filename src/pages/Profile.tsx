import * as React from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Save, X, Edit, Mail, Calendar, Heart, Star, Sparkles, MessageCircle, Gift, HandHeart, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile, updateMyProfile } from "@/api/user/user.api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MBTI, ZodiacSign, LoveLanguage } from "@/common/enums";
import type { User } from "@/types/user";

const mbtiOptions = [
    { value: "INTJ", description: "The Architect", image: "/mbti/mbti_intj_architect_1769330519394.png" },
    { value: "INTP", description: "The Logician", image: "/mbti/mbti_intp_logician_1769330535596.png" },
    { value: "ENTJ", description: "The Commander", image: "/mbti/mbti_entj_commander_1769330553403.png" },
    { value: "ENTP", description: "The Debater", image: "/mbti/mbti_entp_debater_1769330570005.png" },
    { value: "INFJ", description: "The Advocate", image: "/mbti/mbti_infj_advocate_1769330584466.png" },
    { value: "INFP", description: "The Mediator", image: "/mbti/mbti_infp_mediator_1769330598854.png" },
    { value: "ENFJ", description: "The Protagonist", image: "/mbti/mbti_enfj_protagonist_1769330613633.png" },
    { value: "ENFP", description: "The Campaigner", image: "/mbti/mbti_enfp_campaigner_1769330628884.png" },
    { value: "ISTJ", description: "The Logistician", image: "/mbti/mbti_istj_logistician_1769330644548.png" },
    { value: "ISFJ", description: "The Defender", image: "/mbti/mbti_isfj_defender_1769330657827.png" },
    { value: "ESTJ", description: "The Executive", image: "/mbti/mbti_estj_executive_1769330674381.png" },
    { value: "ESFJ", description: "The Consul", image: "/mbti/mbti_esfj_consul_1769330689282.png" },
    { value: "ISTP", description: "The Virtuoso", image: "/mbti/mbti_istp_virtuoso_1769330704359.png" },
    { value: "ISFP", description: "The Adventurer", image: "/mbti/mbti_isfp_adventurer_1769330718249.png" },
    { value: "ESTP", description: "The Entrepreneur", image: "/mbti/mbti_estp_entrepreneur_1769330732201.png" },
    { value: "ESFP", description: "The Entertainer", image: "/mbti/mbti_esfp_entertainer_1769330748403.png" },
];

const zodiacOptions: Record<string, { emoji: string; dates: string }> = {
    aries: { emoji: "♈", dates: "Mar 21 - Apr 19" },
    taurus: { emoji: "♉", dates: "Apr 20 - May 20" },
    gemini: { emoji: "♊", dates: "May 21 - Jun 20" },
    cancer: { emoji: "♋", dates: "Jun 21 - Jul 22" },
    leo: { emoji: "♌", dates: "Jul 23 - Aug 22" },
    virgo: { emoji: "♍", dates: "Aug 23 - Sep 22" },
    libra: { emoji: "♎", dates: "Sep 23 - Oct 22" },
    scorpio: { emoji: "♏", dates: "Oct 23 - Nov 21" },
    sagittarius: { emoji: "♐", dates: "Nov 22 - Dec 21" },
    capricorn: { emoji: "♑", dates: "Dec 22 - Jan 19" },
    aquarius: { emoji: "♒", dates: "Jan 20 - Feb 18" },
    pisces: { emoji: "♓", dates: "Feb 19 - Mar 20" },
};

const loveLanguageIcons: Record<string, { icon: any; color: string }> = {
    WORDS_OF_AFFIRMATION: { icon: MessageCircle, color: "text-rose-500" },
    QUALITY_TIME: { icon: Users, color: "text-indigo-500" },
    RECEIVING_GIFTS: { icon: Gift, color: "text-orange-500" },
    ACTS_OF_SERVICE: { icon: HandHeart, color: "text-teal-500" },
    PHYSICAL_TOUCH: { icon: Heart, color: "text-pink-500" },
};

const loveLanguageOptions = [
    {
        value: LoveLanguage.WORDS_OF_AFFIRMATION,
        label: "Words of Affirmation",
        icon: MessageCircle,
        description: "Verbal compliments and expressions of love",
        bgColor: "bg-rose-100",
        iconColor: "text-rose-500",
    },
    {
        value: LoveLanguage.QUALITY_TIME,
        label: "Quality Time",
        icon: Users,
        description: "Undivided attention and meaningful connection",
        bgColor: "bg-indigo-100",
        iconColor: "text-indigo-500",
    },
    {
        value: LoveLanguage.RECEIVING_GIFTS,
        label: "Receiving Gifts",
        icon: Gift,
        description: "Thoughtful presents and tokens of affection",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
    },
    {
        value: LoveLanguage.ACTS_OF_SERVICE,
        label: "Acts of Service",
        icon: HandHeart,
        description: "Helpful actions and thoughtful gestures",
        bgColor: "bg-teal-100",
        iconColor: "text-teal-500",
    },
    {
        value: LoveLanguage.PHYSICAL_TOUCH,
        label: "Physical Touch",
        icon: Heart,
        description: "Physical affection and closeness",
        bgColor: "bg-pink-100",
        iconColor: "text-pink-500",
    },
];

export default function Profile() {
    const { user: authUser, isLoading: authLoading, signOut, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Modal states
    const [showMBTIModal, setShowMBTIModal] = React.useState(false);
    const [showZodiacModal, setShowZodiacModal] = React.useState(false);
    const [showLoveLanguagesModal, setShowLoveLanguagesModal] = React.useState(false);

    // Form state
    const [formData, setFormData] = React.useState({
        displayName: "",
        mbti: "",
        zodiacSign: "",
        loveLanguages: [] as string[],
    });

    // Redirect unauthenticated users
    React.useEffect(() => {
        if (!authLoading && !authUser) {
            navigate("/login");
        }
    }, [authUser, authLoading, navigate]);

    // Fetch profile data
    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!authUser) return;

            try {
                setIsLoading(true);
                const data = await getMyProfile();
                setProfile(data);

                // Initialize form data
                setFormData({
                    displayName: data.displayName || "",
                    mbti: data.mbti || "",
                    zodiacSign: data.zodiacSign || "",
                    loveLanguages: data.loveLanguages || [],
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [authUser]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleLoveLanguage = (lang: string) => {
        setFormData((prev) => ({
            ...prev,
            loveLanguages: prev.loveLanguages.includes(lang)
                ? prev.loveLanguages.filter((l) => l !== lang)
                : [...prev.loveLanguages, lang],
        }));
    };

    const handleSave = async () => {
        if (!profile) return;

        setIsSaving(true);
        try {
            let avatarUrl = profile.avatarUrl;

            // Upload avatar if changed
            if (avatarFile) {
                avatarUrl = await uploadToCloudinary(avatarFile, undefined, "media/users");
            }

            // Prepare update data
            const updateData: any = {};
            if (formData.displayName !== profile.displayName) {
                updateData.displayName = formData.displayName;
            }
            if (formData.mbti !== profile.mbti) {
                updateData.mbti = formData.mbti as MBTI;
            }
            if (formData.zodiacSign !== profile.zodiacSign) {
                updateData.zodiacSign = formData.zodiacSign as ZodiacSign;
            }
            if (JSON.stringify(formData.loveLanguages) !== JSON.stringify(profile.loveLanguages)) {
                updateData.loveLanguages = formData.loveLanguages as LoveLanguage[];
            }
            if (avatarUrl !== profile.avatarUrl) {
                updateData.avatarUrl = avatarUrl;
            }

            // Only update if there are changes
            if (Object.keys(updateData).length === 0) {
                toast.info("No changes to save");
                setIsEditing(false);
                return;
            }

            const updatedProfile = await updateMyProfile(updateData);
            setProfile(updatedProfile);
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);

            // Update localStorage with the updated user data
            localStorage.setItem("user", JSON.stringify(updatedProfile));

            // Refresh auth context to update header
            if (refreshUser) {
                refreshUser();
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) return;

        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        setFormData({
            displayName: profile.displayName || "",
            mbti: profile.mbti || "",
            zodiacSign: profile.zodiacSign || "",
            loveLanguages: profile.loveLanguages || [],
        });
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const formatLoveLanguage = (lang: string) => {
        return lang
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center gradient-calm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!authUser || !profile) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col gradient-calm">
            <Header
                user={authUser}
                onProfileClick={() => navigate("/profile")}
                onSignOut={signOut}
            />

            <main className="container py-8 flex-1 max-w-7xl mx-auto px-4">

                {/* Two Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden sticky top-6">
                            {/* Gradient Header with Edit Button */}
                            <div className="relative h-24 bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                                <div className="absolute top-3 right-3">
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} size="sm" variant="secondary" className="shadow-md">
                                            <Edit className="mr-1.5 h-3.5 w-3.5" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleCancel}
                                                variant="outline"
                                                size="sm"
                                                disabled={isSaving}
                                                className="bg-white/90"
                                            >
                                                <X className="mr-1 h-3.5 w-3.5" />
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSave} size="sm" disabled={isSaving}>
                                                {isSaving ? (
                                                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Save className="mr-1 h-3.5 w-3.5" />
                                                )}
                                                Save
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Avatar Section */}
                            <div className="px-6 pb-6">
                                <div className="relative -mt-16 mb-4">
                                    <div className="relative inline-block">
                                        <div className="h-32 w-32 rounded-full border-4 border-card bg-card overflow-hidden shadow-xl">
                                            {avatarPreview || profile.avatarUrl ? (
                                                <img
                                                    src={avatarPreview || profile.avatarUrl}
                                                    alt={profile.displayName || "User avatar"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                                                    <Sparkles className="h-12 w-12 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-1 right-1 rounded-full bg-primary text-primary-foreground p-2.5 shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* Display Name */}
                                <div className="mb-4">
                                    {isEditing ? (
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1.5 block">Display Name</Label>
                                            <Input
                                                value={formData.displayName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, displayName: e.target.value }))
                                                }
                                                placeholder="Enter your display name"
                                                className="text-lg font-semibold"
                                            />
                                        </div>
                                    ) : (
                                        <h2 className="text-2xl font-bold">
                                            {profile.displayName || "Not set"}
                                        </h2>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm truncate">{profile.email}</span>
                                </div>

                                {/* Role Badge */}
                                <div className="mb-4">
                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                                        {profile.role}
                                    </span>
                                </div>

                                {/* Member Since */}
                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {formatDate(profile.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - About You Card */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col"
                            style={{ maxHeight: 'calc(100vh - 120px)' }}
                        >
                            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-border flex-shrink-0">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    About You
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">Your personality and preferences</p>
                            </div>
                            <div className="p-6 space-y-8 overflow-y-auto">
                                {/* MBTI */}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        MBTI Personality Type
                                    </Label>
                                    {isEditing ? (
                                        <div
                                            className="inline-flex items-center gap-3 bg-white rounded-lg px-4 py-3 border-2 border-dashed border-primary/40 shadow-sm cursor-pointer hover:border-primary hover:shadow-md transition-all"
                                            onClick={() => setShowMBTIModal(true)}
                                        >
                                            {formData.mbti ? (
                                                <>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg">{formData.mbti}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {mbtiOptions.find(o => o.value === formData.mbti)?.description || ""}
                                                        </p>
                                                    </div>
                                                    {mbtiOptions.find(o => o.value === formData.mbti)?.image && (
                                                        <div className="w-12 h-12 flex-shrink-0">
                                                            <img
                                                                src={mbtiOptions.find(o => o.value === formData.mbti)!.image}
                                                                alt={formData.mbti}
                                                                className="h-full w-auto object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">Click to select MBTI type</p>
                                            )}
                                        </div>
                                    ) : profile.mbti ? (
                                        <div className="inline-flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-border shadow-sm">
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{profile.mbti}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {mbtiOptions.find(o => o.value === profile.mbti)?.description || ""}
                                                </p>
                                            </div>
                                            {mbtiOptions.find(o => o.value === profile.mbti)?.image && (
                                                <div className="w-14 h-14 flex-shrink-0">
                                                    <img
                                                        src={mbtiOptions.find(o => o.value === profile.mbti)!.image}
                                                        alt={profile.mbti}
                                                        className="h-full w-auto object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Not set</p>
                                    )}
                                </div>

                                {/* Zodiac Sign */}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Zodiac Sign
                                    </Label>
                                    {isEditing ? (
                                        <div
                                            className="inline-flex items-center gap-3 bg-white rounded-lg px-4 py-3 border-2 border-dashed border-primary/40 shadow-sm cursor-pointer hover:border-primary hover:shadow-md transition-all"
                                            onClick={() => setShowZodiacModal(true)}
                                        >
                                            {formData.zodiacSign ? (
                                                <>
                                                    <span className="text-3xl">
                                                        {zodiacOptions[formData.zodiacSign.toLowerCase()]?.emoji || "✨"}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-lg capitalize">{formData.zodiacSign}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {zodiacOptions[formData.zodiacSign.toLowerCase()]?.dates || ""}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">Click to select zodiac sign</p>
                                            )}
                                        </div>
                                    ) : profile.zodiacSign ? (
                                        <div className="inline-flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-border shadow-sm">
                                            <span className="text-3xl">
                                                {zodiacOptions[profile.zodiacSign.toLowerCase()]?.emoji || "✨"}
                                            </span>
                                            <div>
                                                <p className="font-bold text-lg capitalize">{profile.zodiacSign}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {zodiacOptions[profile.zodiacSign.toLowerCase()]?.dates || ""}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Not set</p>
                                    )}
                                </div>

                                {/* Love Languages */}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        Love Languages
                                    </Label>
                                    {isEditing ? (
                                        <div
                                            className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-3 border-2 border-dashed border-primary/40 shadow-sm cursor-pointer hover:border-primary hover:shadow-md transition-all"
                                            onClick={() => setShowLoveLanguagesModal(true)}
                                        >
                                            {formData.loveLanguages && formData.loveLanguages.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.loveLanguages.map((lang) => {
                                                        const IconComponent = loveLanguageIcons[lang]?.icon || Heart;
                                                        const iconColor = loveLanguageIcons[lang]?.color || "text-pink-500";
                                                        return (
                                                            <span
                                                                key={lang}
                                                                className="inline-flex items-center gap-1.5 text-xs font-semibold"
                                                            >
                                                                <IconComponent className={`h-3.5 w-3.5 ${iconColor}`} />
                                                                {formatLoveLanguage(lang)}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground text-sm">Click to select love languages</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {profile.loveLanguages && profile.loveLanguages.length > 0 ? (
                                                profile.loveLanguages.map((lang) => {
                                                    const IconComponent = loveLanguageIcons[lang]?.icon || Heart;
                                                    const iconColor = loveLanguageIcons[lang]?.color || "text-pink-500";
                                                    return (
                                                        <div
                                                            key={lang}
                                                            className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-border shadow-sm"
                                                        >
                                                            <div className="p-2 rounded-lg bg-white">
                                                                <IconComponent className={`h-5 w-5 ${iconColor}`} />
                                                            </div>
                                                            <span className="text-sm font-semibold">
                                                                {formatLoveLanguage(lang)}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-muted-foreground text-sm">Not set</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Selection Modals */}
                <Dialog open={showMBTIModal} onOpenChange={setShowMBTIModal}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-primary" />
                                Select Your MBTI Personality Type
                            </DialogTitle>
                            <DialogDescription>
                                Click on your personality type. Click again to deselect.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            {mbtiOptions.map((option) => {
                                const isSelected = formData.mbti === option.value;
                                return (
                                    <motion.div
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div
                                            className={`p-3 cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${isSelected
                                                    ? "border-primary bg-sage-light/50 shadow-sm"
                                                    : "border-border bg-white hover:border-primary/30"
                                                }`}
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    mbti: isSelected ? "" : option.value
                                                }));
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{option.value}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{option.description}</p>
                                                </div>
                                                <div className="w-12 h-12 flex-shrink-0">
                                                    <img
                                                        src={option.image}
                                                        alt={option.description}
                                                        className="h-full w-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showZodiacModal} onOpenChange={setShowZodiacModal}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Select Your Zodiac Sign
                            </DialogTitle>
                            <DialogDescription>
                                Click on your zodiac sign. Click again to deselect.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                            {Object.entries(zodiacOptions).map(([key, option]) => {
                                const zodiacValue = key.charAt(0).toUpperCase() + key.slice(1);
                                const isSelected = formData.zodiacSign?.toLowerCase() === key;
                                return (
                                    <motion.div
                                        key={key}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div
                                            className={`p-3 cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${isSelected
                                                    ? "border-primary bg-sage-light/50 shadow-sm"
                                                    : "border-border bg-white hover:border-primary/30"
                                                }`}
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    zodiacSign: isSelected ? "" : zodiacValue
                                                }));
                                            }}
                                        >
                                            <div className="text-center space-y-0.5">
                                                <p className="text-3xl">{option.emoji}</p>
                                                <p className="font-semibold text-xs capitalize">{key}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showLoveLanguagesModal} onOpenChange={setShowLoveLanguagesModal}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-pink-600" />
                                Select Your Love Languages
                            </DialogTitle>
                            <DialogDescription>
                                Select up to 2 ways you prefer to give and receive love. Click again to deselect.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {loveLanguageOptions.slice(0, 3).map((option) => {
                                const Icon = option.icon;
                                const isSelected = formData.loveLanguages.includes(option.value);
                                return (
                                    <motion.div
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div
                                            className={`p-4 cursor-pointer transition-all hover:shadow-md h-full rounded-lg border-2 ${isSelected
                                                    ? "border-primary bg-sage-light/50"
                                                    : "border-border bg-white"
                                                }`}
                                            onClick={() => toggleLoveLanguage(option.value)}
                                        >
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <div className={`p-4 rounded-xl ${option.bgColor}`}>
                                                    <Icon className={`h-8 w-8 ${option.iconColor}`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-base">{option.label}</h3>
                                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loveLanguageOptions.slice(3, 5).map((option) => {
                                const Icon = option.icon;
                                const isSelected = formData.loveLanguages.includes(option.value);
                                return (
                                    <motion.div
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div
                                            className={`p-4 cursor-pointer transition-all hover:shadow-md h-full rounded-lg border-2 ${isSelected
                                                    ? "border-primary bg-sage-light/50"
                                                    : "border-border bg-white"
                                                }`}
                                            onClick={() => toggleLoveLanguage(option.value)}
                                        >
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <div className={`p-4 rounded-xl ${option.bgColor}`}>
                                                    <Icon className={`h-8 w-8 ${option.iconColor}`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-base">{option.label}</h3>
                                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
