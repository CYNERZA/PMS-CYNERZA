import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/lib/api/customers';
import { CustomerCreate, CustomerUpdate } from '@/types/customer';
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

    // Handle 405 Method Not Allowed
    if (error.response?.status === 405) {
        return 'This action is not supported. Customers are created automatically when making a booking.';
    }

    return error.message || 'An unexpected error occurred';
}

export function useCustomers(page = 1, limit = 10, search?: string) {
    return useQuery({
        queryKey: ['customers', page, limit, search],
        queryFn: () => customerApi.getAll(page, limit, search),
        staleTime: 30000,
    });
}

export function useCustomer(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerApi.getById(id),
        enabled: isValidId,
    });
}

export function useCustomerHistory(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;
    return useQuery({
        queryKey: ['customer-history', id],
        queryFn: () => customerApi.getHistory(id),
        enabled: isValidId,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer created successfully');
        },
        onError: (error: any) => {
            toast.error(getErrorMessage(error));
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CustomerUpdate }) =>
            customerApi.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
            toast.success('Customer updated successfully');
        },
        onError: (error: any) => {
            toast.error(getErrorMessage(error));
        },
    });
}
