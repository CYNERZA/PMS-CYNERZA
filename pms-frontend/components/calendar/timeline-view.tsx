'use client';

import { useState } from 'react';
import {
    format,
    addDays,
    startOfWeek,
    addWeeks,
    subWeeks,
    differenceInDays,
    isSameDay,
    parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCalendarBookings } from '@/lib/hooks/use-calendar';
import { useRoomTypes } from '@/lib/hooks/use-rooms';
import type { BookingEvent } from '@/lib/api/calendar';

export function TimelineView() {
    const router = useRouter();
    const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    // Generate 14-day range
    const dateRange = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));
    const endDate = addDays(startDate, 13);

    // Fetch data from backend
    const { data: roomTypes, isLoading: isLoadingRoomTypes, error: roomTypesError } = useRoomTypes();
    const { data: bookings, isLoading: isLoadingBookings, error: bookingsError } = useCalendarBookings(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
        undefined,
        false // Don't include cancelled bookings
    );

    const handlePrevWeek = () => setStartDate(subWeeks(startDate, 1));
    const handleNextWeek = () => setStartDate(addWeeks(startDate, 1));
    const handleToday = () => setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

    // Get bookings for a specific room type within the date range
    const getBookingsForRoomType = (roomTypeId: number) => {
        if (!bookings) return [];

        return bookings.filter((booking) => {
            return booking.room_type_id === roomTypeId;
        });
    };

    // Calculate the position and width of a booking block
    const getBookingStyle = (booking: BookingEvent) => {
        const checkIn = parseISO(booking.start);
        const checkOut = parseISO(booking.end);
        const rangeStart = startDate;
        const rangeEnd = addDays(startDate, 13);

        // Clamp booking dates to visible range
        const visibleStart = checkIn < rangeStart ? rangeStart : checkIn;
        const visibleEnd = checkOut > rangeEnd ? rangeEnd : checkOut;

        const startOffset = differenceInDays(visibleStart, rangeStart);
        const duration = differenceInDays(visibleEnd, visibleStart);

        // Each day is 1/14 of the width (100% / 14 ≈ 7.14%)
        const left = (startOffset / 14) * 100;
        const width = (duration / 14) * 100;

        return {
            left: `${left}%`,
            width: `${Math.max(width, 7)}%`, // Minimum width for visibility
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500 hover:bg-green-600';
            case 'pending':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'checked_in':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'checked_out':
                return 'bg-zinc-400 hover:bg-zinc-500';
            default:
                return 'bg-indigo-500 hover:bg-indigo-600';
        }
    };

    // Loading state
    if (isLoadingRoomTypes || isLoadingBookings) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Error state
    if (roomTypesError || bookingsError) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <p className="text-destructive">Failed to load timeline data</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    // No data state
    if (!roomTypes || roomTypes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <p className="text-muted-foreground">No room types available</p>
                <Button onClick={() => router.push('/rooms')}>Add Room Types</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                        {format(startDate, 'MMM d')} - {format(addDays(startDate, 13), 'MMM d, yyyy')}
                    </h2>
                    <div className="flex items-center rounded-md border bg-background shadow-sm">
                        <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleToday} className="h-8 px-2 font-normal">
                            Today
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNextWeek} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-green-500"></div>
                        <span>Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-yellow-500"></div>
                        <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-blue-500"></div>
                        <span>Checked In</span>
                    </div>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="rounded-lg border bg-background shadow overflow-hidden">
                {/* Date Header */}
                <div className="flex border-b bg-muted/50">
                    <div className="w-40 flex-shrink-0 p-3 font-medium border-r">
                        Room Type
                    </div>
                    <div className="flex-1 grid grid-cols-14">
                        {dateRange.map((date) => (
                            <div
                                key={date.toISOString()}
                                className={cn(
                                    'p-2 text-center text-xs border-r last:border-r-0',
                                    isSameDay(date, new Date()) && 'bg-indigo-50 dark:bg-indigo-950/30'
                                )}
                            >
                                <div className="font-medium">{format(date, 'EEE')}</div>
                                <div className={cn(
                                    'text-muted-foreground',
                                    isSameDay(date, new Date()) && 'text-indigo-600 font-semibold'
                                )}>
                                    {format(date, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Type Rows */}
                {roomTypes.map((roomType) => {
                    const roomBookings = getBookingsForRoomType(roomType.id);

                    return (
                        <div key={roomType.id} className="flex border-b last:border-b-0 hover:bg-muted/30">
                            <div className="w-40 flex-shrink-0 p-3 border-r">
                                <div className="font-medium text-sm">{roomType.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {roomType.total_rooms} rooms
                                </div>
                            </div>
                            <div className="flex-1 relative min-h-[60px]">
                                {/* Grid lines for dates */}
                                <div className="absolute inset-0 grid grid-cols-14">
                                    {dateRange.map((date) => (
                                        <div
                                            key={date.toISOString()}
                                            className={cn(
                                                'border-r last:border-r-0',
                                                isSameDay(date, new Date()) && 'bg-indigo-50/50 dark:bg-indigo-950/20'
                                            )}
                                            onClick={() => router.push(`/bookings/new?room_type_id=${roomType.id}&check_in=${format(date, 'yyyy-MM-dd')}`)}
                                        />
                                    ))}
                                </div>

                                {/* Booking blocks */}
                                {roomBookings.map((booking) => {
                                    const style = getBookingStyle(booking);
                                    return (
                                        <div
                                            key={booking.booking_id}
                                            className={cn(
                                                'absolute top-2 bottom-2 rounded-md px-2 py-1 text-white text-xs cursor-pointer transition-colors overflow-hidden',
                                                getStatusColor(booking.status)
                                            )}
                                            style={style}
                                            onClick={() => router.push(`/bookings/${booking.booking_id}`)}
                                            title={`${booking.customer_name || 'Guest'} - ${booking.status}`}
                                        >
                                            <div className="font-medium truncate">
                                                {booking.customer_name || 'Guest'}
                                            </div>
                                            <div className="text-[10px] opacity-80 truncate">
                                                {booking.num_rooms} room{booking.num_rooms > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
