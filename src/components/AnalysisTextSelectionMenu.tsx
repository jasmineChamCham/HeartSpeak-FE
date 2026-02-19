import React, { useState, useEffect, useRef } from "react";
import { MessageSquarePlus, X, Send, Trash2, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisTextSelectionMenuProps {
    children: React.ReactNode;
    onRefine: (selection: string, comment: string) => string; // Returns ID
    onDelete?: (id: string) => void;
    onEdit?: (id: string, newComment: string) => void;
}

export function AnalysisTextSelectionMenu({
    children,
    onRefine,
    onDelete,
    onEdit,
}: AnalysisTextSelectionMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<string>("");
    const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [comment, setComment] = useState("");

    const isPopoverOpenRef = useRef(isPopoverOpen);
    const [currentRange, setCurrentRange] = useState<Range | null>(null);
    const [viewingComment, setViewingComment] = useState<string | null>(null);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [viewingPosition, setViewingPosition] = useState<{ top: number; left: number } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editComment, setEditComment] = useState("");

    useEffect(() => {
        isPopoverOpenRef.current = isPopoverOpen;
    }, [isPopoverOpen]);

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-selection-menu]')) {
                return;
            }

            // Check for clicks on existing highlights
            const highlight = target.closest('[data-highlight-comment]');
            if (highlight) {
                const comment = (highlight as HTMLElement).dataset.comment;
                const id = (highlight as HTMLElement).dataset.id;

                if (comment && id) {
                    const rect = highlight.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();

                    if (containerRect) {
                        setViewingComment(comment);
                        setViewingId(id);
                        setEditComment(comment);
                        setIsEditing(false); // Reset edit state
                        setViewingPosition({
                            top: rect.bottom - containerRect.top + 10,
                            left: rect.left - containerRect.left + rect.width / 2
                        });
                        setSelection("");
                        setPopoverPosition(null);
                        setIsPopoverOpen(false);
                        return;
                    }
                }
            } else {
                // If clicking elsewhere (and not in the viewing popover), close viewing comment
                if (!target.closest('[data-viewing-popover]')) {
                    setViewingComment(null);
                    setViewingId(null);
                    setViewingPosition(null);
                    setIsEditing(false);
                }
            }


            setTimeout(() => {
                const activeSelection = window.getSelection();

                if (!activeSelection || activeSelection.isCollapsed) {
                    if (!isPopoverOpenRef.current) {
                        setSelection("");
                        setPopoverPosition(null);
                        setCurrentRange(null);
                    }
                    return;
                }

                const text = activeSelection.toString().trim();
                if (!text) return;

                if (containerRef.current && containerRef.current.contains(activeSelection.anchorNode)) {
                    setViewingComment(null);
                    setViewingId(null);
                    setViewingPosition(null);

                    const range = activeSelection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    setCurrentRange(range);

                    setSelection(text);
                    setPopoverPosition({
                        top: rect.bottom - containerRect.top + 10,
                        left: rect.left - containerRect.left + rect.width / 2,
                    });
                }
            }, 10);
        };

        const handleDocumentClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isPopoverOpen && target.closest('[data-selection-menu]')) {
                return;
            }

            // Don't close viewing popover if clicking inside
            if (viewingComment && target.closest('[data-viewing-popover]')) {
                return;
            }

            if (!window.getSelection()?.toString() && isPopoverOpen) {
                setIsPopoverOpen(false);
                setSelection("");
                setPopoverPosition(null);
                setCurrentRange(null);
            }
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, [isPopoverOpen, viewingComment]);


    const handleSubmit = () => {
        if (comment.trim() && selection && currentRange) {

            const id = onRefine(selection, comment);

            try {
                const span = document.createElement('span');
                span.className = 'bg-[#58c4b5]/20 border-b-2 border-[#58c4b5] cursor-pointer hover:bg-[#58c4b5]/30 transition-colors';
                span.dataset.highlightComment = "true";
                span.dataset.comment = comment;
                span.dataset.id = id;
                currentRange.surroundContents(span);
            } catch (e) {
                console.warn("Could not highlight selection (complex range):", e);
            }

            setComment("");
            setIsPopoverOpen(false);
            setSelection("");
            setPopoverPosition(null);
            setCurrentRange(null);
            window.getSelection()?.removeAllRanges();
        }
    };

    const handleDelete = () => {
        if (!viewingId) return;

        // Visual cleanup
        const highlight = containerRef.current?.querySelector(`[data-id="${viewingId}"]`);
        if (highlight) {
            // Unwrap the span
            const parent = highlight.parentNode;
            while (highlight.firstChild) {
                parent?.insertBefore(highlight.firstChild, highlight);
            }
            parent?.removeChild(highlight);
        }

        if (onDelete) onDelete(viewingId);

        setViewingComment(null);
        setViewingId(null);
        setViewingPosition(null);
    };

    const handleSaveEdit = () => {
        if (!viewingId || !editComment.trim()) return;

        // Update visual
        const highlight = containerRef.current?.querySelector(`[data-id="${viewingId}"]`) as HTMLElement;
        if (highlight) {
            highlight.dataset.comment = editComment;
        }

        if (onEdit) onEdit(viewingId, editComment);

        setViewingComment(editComment);
        setIsEditing(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsPopoverOpen(open);
        if (!open) {
            setComment("");
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {children}

            <AnimatePresence>
                {/* Viewing Comment Popover */}
                {viewingComment && viewingPosition && (
                    <div
                        style={{
                            position: "absolute",
                            top: viewingPosition.top,
                            left: viewingPosition.left,
                            transform: "translate(-50%, 0)",
                            zIndex: 40,
                            pointerEvents: "auto"
                        }}
                        data-viewing-popover
                    >
                        <div className="bg-popover text-popover-foreground shadow-xl border rounded-lg p-3 w-72 text-sm animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-[#58c4b5] text-xs uppercase tracking-wider">
                                    {isEditing ? "Edit Comment" : "Comment"}
                                </span>
                                <div className="flex items-center gap-1">
                                    {!isEditing && (
                                        <>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={handleDelete}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                                        setViewingComment(null);
                                        setViewingId(null);
                                        setIsEditing(false);
                                    }}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <Textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="min-h-[60px] text-sm resize-none focus-visible:ring-[#58c4b5]"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button size="sm" className="h-7 text-xs gap-1 bg-[#58c4b5] hover:bg-[#40b9a8] text-white" onClick={handleSaveEdit}>
                                            <Check className="h-3 w-3" /> Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm break-words whitespace-pre-wrap">{viewingComment}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* New Refinement Popover */}
                {popoverPosition && (
                    <div
                        style={{
                            position: "absolute",
                            top: popoverPosition.top,
                            left: popoverPosition.left,
                            transform: "translate(-50%, 0)", // Align top-center to point
                            zIndex: 40,
                            pointerEvents: "auto"
                        }}
                        data-selection-menu
                    >
                        <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
                            <PopoverTrigger asChild>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1, opacity: 0, transition: { duration: 0 } }}
                                >
                                    <Button
                                        size="sm"
                                        className="h-8 gap-2 bg-[#58c4b5] text-white hover:bg-[#40b9a8] shadow-lg rounded-full"
                                        onClick={() => setIsPopoverOpen(true)}
                                    >
                                        <MessageSquarePlus className="h-4 w-4" />
                                        Add Comment
                                    </Button>
                                </motion.div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-3 shadow-xl"
                                align="center"
                                sideOffset={5}
                                data-selection-menu
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-medium text-sm text-foreground">
                                            Add Refinement Comment
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 -mr-2 -mt-2"
                                            onClick={() => setIsPopoverOpen(false)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <Textarea
                                        placeholder="What would you like to ask or refine about this text?"
                                        className="min-h-[80px] text-sm resize-none focus-visible:ring-[#58c4b5]"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        autoFocus
                                    />

                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={handleSubmit}
                                            disabled={!comment.trim()}
                                            className="gap-2 bg-[#58c4b5] hover:bg-[#40b9a8] text-white"
                                        >
                                            <Send className="h-3 w-3" />
                                            Add Comment
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
