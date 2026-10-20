'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from '@/components/ui/dialog';
import { getActiveHref, navigation, type NavItem } from '@/components/layout/sidebar-config';
import { useSidebar } from '@/components/layout/sidebar-provider';

const SIDEBAR_WIDTH = 248;
const SIDEBAR_COLLAPSED_WIDTH = 72;

function BrandLink({
    collapsed = false,
    onNavigate,
}: {
    collapsed?: boolean;
    onNavigate?: () => void;
}) {
    return (
        <Link
            href="/"
            onClick={onNavigate}
            aria-label="CYNERZA dashboard"
            className={cn(
                'flex h-16 shrink-0 items-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
                collapsed ? 'justify-center px-3' : 'gap-3 px-5'
            )}
        >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-[15px] font-semibold tracking-tight text-white ring-1 ring-inset ring-white/15">
                C
            </span>
            {!collapsed && (
                <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[15px] font-semibold leading-tight tracking-[0.12em] text-zinc-900 dark:text-zinc-50">
                        CYNERZA
                    </span>
                    <span className="truncate text-[10px] font-medium uppercase leading-tight tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                        Property Management
                    </span>
                </span>
            )}
        </Link>
    );
}

function NavLink({
    item,
    active,
    collapsed,
    onNavigate,
}: {
    item: NavItem;
    active: boolean;
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [tooltipTop, setTooltipTop] = useState<number | null>(null);
    const Icon = item.icon;

    const showTooltip = () => {
        if (!collapsed || !linkRef.current) {
            return;
        }

        const rect = linkRef.current.getBoundingClientRect();
        setTooltipTop(rect.top + rect.height / 2);
    };

    const hideTooltip = () => setTooltipTop(null);

    return (
        <>
            <Link
                ref={linkRef}
                href={item.href}
                onClick={() => {
                    hideTooltip();
                    onNavigate?.();
                }}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                aria-current={active ? 'page' : undefined}
                aria-describedby={collapsed && tooltipTop !== null ? `sidebar-tooltip-${item.name}` : undefined}
                className={cn(
                    'group relative flex h-10 items-center rounded-lg text-sm font-medium outline-none transition-colors duration-150 motion-reduce:transition-none',
                    'focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
                    collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                    active
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100/80 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20'
                        : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                )}
            >
                <Icon
                    className={cn(
                        'size-[18px] shrink-0 transition-colors',
                        active
                            ? 'text-indigo-600 dark:text-indigo-300'
                            : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                    )}
                    aria-hidden="true"
                />
                <span className={collapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
            </Link>

            {collapsed &&
                tooltipTop !== null &&
                createPortal(
                    <span
                        id={`sidebar-tooltip-${item.name}`}
                        role="tooltip"
                        style={{ top: tooltipTop }}
                        className="pointer-events-none fixed left-[84px] z-[60] -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        {item.name}
                    </span>,
                    document.body
                )}
        </>
    );
}

function SidebarNav({
    collapsed,
    onNavigate,
}: {
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const activeHref = getActiveHref(pathname);

    return (
        <nav
            aria-label="Primary"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden py-5"
        >
            {navigation.map((group, groupIndex) => {
                const isLastGroup = groupIndex === navigation.length - 1;

                return (
                    <div
                        key={group.label}
                        className={cn(
                            groupIndex > 0 && 'pt-5',
                            isLastGroup && 'mt-auto'
                        )}
                    >
                        {collapsed && groupIndex > 0 && (
                            <div
                                role="separator"
                                className="mx-3 mb-2 h-px bg-zinc-100 dark:bg-zinc-800/70"
                            />
                        )}
                        <p
                            className={cn(
                                'mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500',
                                collapsed && 'sr-only'
                            )}
                        >
                            {group.label}
                        </p>
                        <ul className="space-y-0.5">
                            {group.items.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        item={item}
                                        active={activeHref === item.href}
                                        collapsed={collapsed}
                                        onNavigate={onNavigate}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </nav>
    );
}

function CollapseToggle({ collapsed }: { collapsed: boolean }) {
    const { toggleCollapsed } = useSidebar();
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

    return (
        <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
                'flex h-9 w-full items-center rounded-lg text-sm font-medium text-zinc-500 outline-none transition-colors duration-150 hover:bg-zinc-100/80 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950',
                collapsed ? 'justify-center px-0' : 'gap-2.5 px-3'
            )}
        >
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span className={collapsed ? 'sr-only' : undefined}>Collapse</span>
        </button>
    );
}

function DesktopSidebar() {
    const { collapsed, hydrated } = useSidebar();

    return (
        <aside
            data-collapsed={collapsed}
            className={cn(
                'relative hidden shrink-0 flex-col border-r border-zinc-200/80 bg-white md:flex dark:border-zinc-800 dark:bg-zinc-950',
                hydrated && 'transition-[width] duration-200 ease-out motion-reduce:transition-none'
            )}
            style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        >
            <BrandLink collapsed={collapsed} />
            <div className={cn('flex min-h-0 flex-1 flex-col', collapsed ? 'px-2.5' : 'px-3')}>
                <SidebarNav collapsed={collapsed} />
                <div className="border-t border-zinc-100 py-3 dark:border-zinc-800/70">
                    <CollapseToggle collapsed={collapsed} />
                </div>
            </div>
        </aside>
    );
}

function MobileSidebar() {
    const { mobileOpen, setMobileOpen } = useSidebar();

    return (
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogPortal>
                <DialogOverlay className="bg-zinc-950/40 md:hidden motion-reduce:animate-none" />
                <DialogContent
                    id="mobile-sidebar"
                    showCloseButton={false}
                    className={cn(
                        'fixed inset-y-0 left-0 top-0 flex h-full max-h-none w-[280px] max-w-[85vw] translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-y-0 border-l-0 border-r border-zinc-200 bg-white p-0 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950',
                        'data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left duration-200 motion-reduce:animate-none'
                    )}
                >
                    <DialogTitle className="sr-only">Navigation</DialogTitle>
                    <DialogDescription className="sr-only">
                        Primary navigation for PMS CYNERZA
                    </DialogDescription>

                    <div className="flex items-center justify-between pr-3">
                        <BrandLink onNavigate={() => setMobileOpen(false)} />
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close navigation"
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col px-3 pb-4">
                        <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const { setMobileOpen } = useSidebar();

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    return (
        <>
            <DesktopSidebar />
            <MobileSidebar />
        </>
    );
}
