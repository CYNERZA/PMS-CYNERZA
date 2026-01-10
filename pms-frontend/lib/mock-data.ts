import { Booking } from '@/types/booking';
import { Customer } from '@/types/customer';
import { RoomType } from '@/types/room';

// Mock Room Types (matching RoomType interface)
export const mockRoomTypes: RoomType[] = [
    { id: 1, name: 'Standard Room', base_price: 100, total_rooms: 20, description: 'Comfortable room with basic amenities', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Deluxe Room', base_price: 150, total_rooms: 15, description: 'Spacious room with premium amenities', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: 3, name: 'Suite', base_price: 250, total_rooms: 10, description: 'Luxurious suite with separate living area', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: 4, name: 'Family Room', base_price: 200, total_rooms: 12, description: 'Large room perfect for families', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Mock Customers (matching Customer interface)
export const mockCustomers: Customer[] = [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0101', address: '123 Main St', created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z', total_balance_due: 0 },
    { id: 2, name: 'Emma Johnson', email: 'emma.j@email.com', phone: '+1 555-0102', address: '456 Oak Ave', created_at: '2024-02-20T14:30:00Z', updated_at: '2024-02-20T14:30:00Z', total_balance_due: 500 },
    { id: 3, name: 'Michael Brown', email: 'm.brown@email.com', phone: '+1 555-0103', address: '789 Pine Rd', created_at: '2024-03-10T09:15:00Z', updated_at: '2024-03-10T09:15:00Z', total_balance_due: 0 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.w@email.com', phone: '+1 555-0104', address: '321 Elm St', created_at: '2024-04-05T16:45:00Z', updated_at: '2024-04-05T16:45:00Z', total_balance_due: 1400 },
    { id: 5, name: 'David Lee', email: 'd.lee@email.com', phone: '+1 555-0105', address: '654 Maple Dr', created_at: '2024-05-12T11:20:00Z', updated_at: '2024-05-12T11:20:00Z', total_balance_due: 0 },
];

// Mock Bookings (matching Booking interface)
export const mockBookings: Booking[] = [
    {
        id: 1,
        customer_id: 1,
        customer_name: 'John Smith',
        customer_email: 'john.smith@email.com',
        room_type_id: 2,
        room_type_name: 'Deluxe Room',
        check_in: '2024-12-20',
        check_out: '2024-12-25',
        num_rooms: 1,
        total_amount: 750,
        amount_paid: 750,
        balance_due: 0,
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'Early check-in requested',
        created_at: '2024-12-01T10:00:00Z',
        num_adults: 2,
        num_children: 1,
    },
    {
        id: 2,
        customer_id: 2,
        customer_name: 'Emma Johnson',
        customer_email: 'emma.j@email.com',
        room_type_id: 3,
        room_type_name: 'Suite',
        check_in: '2024-12-22',
        check_out: '2024-12-28',
        num_rooms: 1,
        total_amount: 1500,
        amount_paid: 500,
        balance_due: 1000,
        status: 'pending',
        payment_status: 'partial',
        notes: 'Anniversary celebration',
        created_at: '2024-12-05T14:00:00Z',
        num_adults: 2,
        num_children: 0,
    },
    {
        id: 3,
        customer_id: 3,
        customer_name: 'Michael Brown',
        customer_email: 'm.brown@email.com',
        room_type_id: 1,
        room_type_name: 'Standard Room',
        check_in: '2024-12-18',
        check_out: '2024-12-20',
        num_rooms: 2,
        total_amount: 400,
        amount_paid: 400,
        balance_due: 0,
        status: 'checked_in',
        payment_status: 'paid',
        notes: '',
        created_at: '2024-12-10T09:00:00Z',
        num_adults: 1,
        num_children: 0,
    },
    {
        id: 4,
        customer_id: 4,
        customer_name: 'Sarah Wilson',
        customer_email: 'sarah.w@email.com',
        room_type_id: 4,
        room_type_name: 'Family Room',
        check_in: '2024-12-24',
        check_out: '2024-12-31',
        num_rooms: 1,
        total_amount: 1400,
        amount_paid: 0,
        balance_due: 1400,
        status: 'confirmed',
        payment_status: 'pending',
        notes: 'Holiday booking - late checkout',
        created_at: '2024-12-08T11:00:00Z',
        num_adults: 2,
        num_children: 2,
    },
    {
        id: 5,
        customer_id: 5,
        customer_name: 'David Lee',
        customer_email: 'd.lee@email.com',
        room_type_id: 2,
        room_type_name: 'Deluxe Room',
        check_in: '2024-12-15',
        check_out: '2024-12-17',
        num_rooms: 1,
        total_amount: 300,
        amount_paid: 300,
        balance_due: 0,
        status: 'checked_out',
        payment_status: 'paid',
        notes: '',
        created_at: '2024-12-02T16:00:00Z',
        num_adults: 1,
        num_children: 0,
    },
    {
        id: 6,
        customer_id: 1,
        customer_name: 'John Smith',
        customer_email: 'john.smith@email.com',
        room_type_id: 1,
        room_type_name: 'Standard Room',
        check_in: '2024-12-10',
        check_out: '2024-12-12',
        num_rooms: 1,
        total_amount: 200,
        amount_paid: 0,
        balance_due: 200,
        status: 'cancelled',
        payment_status: 'refunded',
        notes: 'Cancelled due to schedule change',
        created_at: '2024-11-28T10:00:00Z',
        num_adults: 2,
        num_children: 0,
    },
];

// Helper to simulate API response
export function getMockBookings(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const items = mockBookings.slice(start, start + limit);
    return {
        items,
        total: mockBookings.length,
        page,
        limit,
        pages: Math.ceil(mockBookings.length / limit),
    };
}

export function getMockBookingById(id: number) {
    return mockBookings.find(b => b.id === id);
}

export function getMockCustomers(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const items = mockCustomers.slice(start, start + limit);
    return {
        items,
        total: mockCustomers.length,
        page,
        limit,
        pages: Math.ceil(mockCustomers.length / limit),
    };
}

export function getMockCustomerById(id: number) {
    return mockCustomers.find(c => c.id === id);
}

export function getMockRoomTypes() {
    return mockRoomTypes;
}
