"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookmarkIcon } from "@/components/icons/bookmark"
import type { BookmarkIconHandle } from "@/components/icons/bookmark"
import { CalendarDaysIcon } from "@/components/icons/calendar"
import type { CalendarDaysIconHandle } from "@/components/icons/calendar"
import { FoldersIcon } from "@/components/icons/folder"
import type { FoldersIconHandle } from "@/components/icons/folder"
import { KeyIcon } from "@/components/icons/key"
import type { KeyIconHandle } from "@/components/icons/key"
import { LinkIcon } from "@/components/icons/link"
import type { LinkIconHandle } from "@/components/icons/link"
import { GalleryHorizontalEndIcon } from "@/components/icons/notes"
import type { GalleryHorizontalEndIconHandle } from "@/components/icons/notes"

export default function FirstPage() {
    const [isOpen, setIsOpen] = useState(false);
    const foldersRef = useRef<FoldersIconHandle>(null);
    const bookmarkRef = useRef<BookmarkIconHandle>(null);
    const calendarRef = useRef<CalendarDaysIconHandle>(null);
    const notesRef = useRef<GalleryHorizontalEndIconHandle>(null);
    const keyRef = useRef<KeyIconHandle>(null);
    const linkRef = useRef<LinkIconHandle>(null);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative">
            <motion.button
                onClick={() => setIsOpen(true)}
                layoutId="btn"
                className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-800 cursor-pointer rounded-full hover:bg-neutral-100 transition-colors"
            >
                <motion.span layoutId="btn-text">Create New</motion.span> <Plus />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        layoutId="btn"
                        className="absolute z-10 h-50 w-70 border border-neutral-300 rounded-xl flex flex-col items-center bg-neutral-800 shadow-2xl"
                    >
                        <div className="h-10 w-full bg-neutral-800 rounded-t-xl flex items-center justify-between px-3">
                            <motion.h2 layoutId="btn-text" className="text-white">Create New</motion.h2>
                            <Plus
                                className="text-white rotate-45 cursor-pointer hover:text-neutral-300 transition-colors"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                        <div className="h-38 w-68 bg-white rounded-b-xl rounded-t-sm p-1 flex flex-col">
                            <div className="h-19 w-full rounded-xl flex items-center justify-between">
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => foldersRef.current?.startAnimation()}
                                    onMouseLeave={() => foldersRef.current?.stopAnimation()}
                                >
                                    <FoldersIcon ref={foldersRef} className="text-neutral-500" />
                                    <p className="text-xs">Folder</p>
                                </div>
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => bookmarkRef.current?.startAnimation()}
                                    onMouseLeave={() => bookmarkRef.current?.stopAnimation()}
                                >
                                    <BookmarkIcon ref={bookmarkRef} className="text-neutral-500" />
                                    <p className="text-xs">Bookmark</p>
                                </div>
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => calendarRef.current?.startAnimation()}
                                    onMouseLeave={() => calendarRef.current?.stopAnimation()}
                                >
                                    <CalendarDaysIcon ref={calendarRef} className="text-neutral-500" />
                                    <p className="text-xs">Calendar</p>
                                </div>
                            </div>
                            <div className="h-19 w-full rounded-xl flex items-center justify-between">
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => notesRef.current?.startAnimation()}
                                    onMouseLeave={() => notesRef.current?.stopAnimation()}
                                >
                                    <GalleryHorizontalEndIcon ref={notesRef} className="text-neutral-500" />
                                    <p className="text-xs">Notes</p>
                                </div>
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => keyRef.current?.startAnimation()}
                                    onMouseLeave={() => keyRef.current?.stopAnimation()}
                                >
                                    <KeyIcon ref={keyRef} className="text-neutral-500" />
                                    <p className="text-xs">Password</p>
                                </div>
                                <div
                                    className="h-full w-1/3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100 transition-colors duration-100"
                                    onMouseEnter={() => linkRef.current?.startAnimation()}
                                    onMouseLeave={() => linkRef.current?.stopAnimation()}
                                >
                                    <LinkIcon ref={linkRef} className="text-neutral-500" />
                                    <p className="text-xs">Link</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const Plus = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
    return (
        <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
    )
}

