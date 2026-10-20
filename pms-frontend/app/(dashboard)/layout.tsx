'use client';


import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { SidebarProvider } from '@/components/layout/sidebar-provider';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                    <Sidebar />
                    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                        <Header />
                        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </ProtectedRoute>
    );
}
