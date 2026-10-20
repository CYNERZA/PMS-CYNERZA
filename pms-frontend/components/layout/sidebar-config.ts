import {
    BookOpen,
    Calendar,
    Hotel,
    LayoutDashboard,
    Package,
    Settings,
    Users,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const navigation: NavGroup[] = [
    {
        label: 'Workspace',
        items: [
            { name: 'Dashboard', href: '/', icon: LayoutDashboard },
            { name: 'Calendar', href: '/calendar', icon: Calendar },
            { name: 'Bookings', href: '/bookings', icon: BookOpen },
        ],
    },
    {
        label: 'Management',
        items: [
            { name: 'Customers', href: '/customers', icon: Users },
            { name: 'Rooms', href: '/rooms', icon: Hotel },
            { name: 'Inventory', href: '/rooms/inventory', icon: Package },
        ],
    },
    {
        label: 'System',
        items: [{ name: 'Settings', href: '/settings', icon: Settings }],
    },
];

export function isNavItemActive(pathname: string, href: string) {
    if (href === '/') {
        return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveHref(pathname: string) {
    return navigation
        .flatMap((group) => group.items)
        .filter((item) => isNavItemActive(pathname, item.href))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
