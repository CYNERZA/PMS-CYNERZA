'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from 'react';

const STORAGE_KEY = 'cynerza-sidebar-collapsed';
const listeners = new Set<() => void>();

function subscribeToCollapsed(listener: () => void) {
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) {
            listener();
        }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', handleStorage);
    };
}

function getCollapsedSnapshot() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

function getServerCollapsedSnapshot() {
    return false;
}

const subscribeToHydration = () => () => {};

interface SidebarContextValue {
    collapsed: boolean;
    hydrated: boolean;
    mobileOpen: boolean;
    toggleCollapsed: () => void;
    setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const collapsed = useSyncExternalStore(
        subscribeToCollapsed,
        getCollapsedSnapshot,
        getServerCollapsedSnapshot
    );
    const hydrated = useSyncExternalStore(
        subscribeToHydration,
        () => true,
        () => false
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => {
        const next = !collapsed;

        try {
            window.localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
            // Keep the in-memory preference when storage is unavailable.
        }

        listeners.forEach((listener) => listener());
    }, [collapsed]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setMobileOpen(false);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const value = useMemo(
        () => ({
            collapsed,
            hydrated,
            mobileOpen,
            toggleCollapsed,
            setMobileOpen,
        }),
        [collapsed, hydrated, mobileOpen, toggleCollapsed]
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }

    return context;
}
