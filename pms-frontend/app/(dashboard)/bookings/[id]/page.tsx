'use client';

// ... standard imports based on previous card components
import { useBooking } from '@/lib/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { BookingStatusBadge } from '@/components/bookings/booking-status-badge';
import { CustomerDetailsCard } from '@/components/customers/customer-details-card';

export default function BookingDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const bookingId = Number(params.id);
    const { data: booking, isLoading } = useBooking(bookingId);

    if (isLoading) {
        return <div className="p-8 text-center">Loading booking details...</div>;
    }

    if (!booking) {
        return <div className="p-8 text-center text-red-500">Booking not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">Booking #{booking.id}</h1>
                        <BookingStatusBadge status={booking.status} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={() => router.push(`/bookings/${bookingId}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modify
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Reservation Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Check In</p>
                                <p className="text-lg font-semibold">{format(new Date(booking.check_in), 'EEEE, MMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Check Out</p>
                                <p className="text-lg font-semibold">{format(new Date(booking.check_out), 'EEEE, MMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Duration</p>
                                <p className="text-lg">
                                    {Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))} Nights
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Room Type</p>
                                <p className="text-lg">{booking.room_type_name || 'Standard Room'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Number of Rooms</p>
                                <p className="text-lg">{booking.num_rooms} Room(s)</p>
                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Payment Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-zinc-600">Total Amount</span>
                                <span className="text-xl font-bold">${Number(booking.total_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Paid So Far</span>
                                <span>${Number(booking.amount_paid || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-medium">
                                <span>Remaining Balance</span>
                                <span className={(Number(booking.balance_due || 0)) > 0 ? "text-red-600" : "text-green-600"}>
                                    ${Number(booking.balance_due || 0).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <CustomerDetailsCard customer={{
                        id: booking.customer_id,
                        name: booking.customer_name,
                        email: booking.customer_email,
                        phone: '',
                        created_at: booking.created_at,
                        total_balance_due: booking.balance_due,
                        booking_count: 0,
                    }} />
                </div>
            </div>
        </div>
    );
}
