'use client';

import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { useSidebar } from '@/components/layout/sidebar-provider';

export function Header() {
    const { mobileOpen, setMobileOpen } = useSidebar();

    return (
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-1 items-center justify-between gap-3 px-4 md:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation"
                        aria-controls="mobile-sidebar"
                        aria-expanded={mobileOpen}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="w-full max-w-md">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                            </div>
                            <Input
                                type="search"
                                className="pl-10"
                                placeholder="Search bookings, customers..."
                                aria-label="Search bookings and customers"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75 motion-reduce:animate-none"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        </span>
                    </Button>
                    <div
                        className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-100 sm:flex dark:bg-zinc-800"
                        aria-hidden="true"
                    >
                        <User className="h-5 w-5 text-zinc-500" />
                    </div>
                </div>
            </div>
        </header>
    );
}
