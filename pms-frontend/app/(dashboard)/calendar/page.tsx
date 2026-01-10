'use client';

import { useState } from 'react';
import { MonthView } from '@/components/calendar/month-view';
import { TimelineView } from '@/components/calendar/timeline-view';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, GanttChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
    const router = useRouter();
    const [view, setView] = useState<'month' | 'timeline'>('month');

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <div className="flex items-center space-x-2">
                    {/* View Toggle */}
                    <div className="flex items-center rounded-md border bg-background p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-8 px-3',
                                view === 'month' && 'bg-muted'
                            )}
                            onClick={() => setView('month')}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Month
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-8 px-3',
                                view === 'timeline' && 'bg-muted'
                            )}
                            onClick={() => setView('timeline')}
                        >
                            <GanttChart className="mr-2 h-4 w-4" />
                            Timeline
                        </Button>
                    </div>
                    <Button onClick={() => router.push('/bookings/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Booking
                    </Button>
                </div>
            </div>
            {view === 'month' ? <MonthView /> : <TimelineView />}
        </div>
    );
}
