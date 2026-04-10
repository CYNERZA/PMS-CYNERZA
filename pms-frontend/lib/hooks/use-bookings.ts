import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api/bookings';
import { BookingCreate } from '@/types/booking';
import { toast } from 'sonner';

// Helper function to extract error message from API response
function getErrorMessage(error: any): string {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string') {
        return detail;
    }

    // Handle FastAPI validation error format (array of errors)
    if (Array.isArray(detail)) {
        return detail.map((err: any) => {
            const field = err.loc?.slice(1).join('.') || 'field';
            return `${field}: ${err.msg}`;
        }).join(', ');
    }

    // Handle object format
    if (typeof detail === 'object' && detail !== null) {
        return JSON.stringify(detail);
    }

    return error.message || 'An unexpected error occurred';
}

export function useBookings(page = 1, limit = 10, status?: string, dateFrom?: string, dateTo?: string) {
    return useQuery({
        queryKey: ['bookings', page, limit, status, dateFrom, dateTo],
        queryFn: () => bookingApi.getAll(page, limit, status, dateFrom, dateTo),
        staleTime: 30000, // 30 seconds
    });
}

export function useBooking(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingApi.getById(id),
        enabled: isValidId,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookingApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success('Booking created successfully');
        },
        onError: (error: any) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useModifyBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<BookingCreate> }) =>
            bookingApi.modify(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success('Booking updated successfully');
        },
        onError: (error: any) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
            bookingApi.cancel(id, reason),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success('Booking cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(getErrorMessage(error));
        },
    });
}
