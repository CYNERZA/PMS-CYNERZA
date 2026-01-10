import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '@/lib/api/calendar';

export function useCalendarAvailability(startDate: string, endDate: string, roomTypeId?: number) {
    return useQuery({
        queryKey: ['calendar', 'availability', startDate, endDate, roomTypeId],
        queryFn: () => calendarApi.getAvailability(startDate, endDate, roomTypeId),
        enabled: !!startDate && !!endDate,
    });
}

export function useCalendarBookings(
    startDate: string,
    endDate: string,
    roomTypeId?: number,
    includeCancelled?: boolean
) {
    return useQuery({
        queryKey: ['calendar', 'bookings', startDate, endDate, roomTypeId, includeCancelled],
        queryFn: () => calendarApi.getBookings(startDate, endDate, roomTypeId, includeCancelled),
        enabled: !!startDate && !!endDate,
    });
}
