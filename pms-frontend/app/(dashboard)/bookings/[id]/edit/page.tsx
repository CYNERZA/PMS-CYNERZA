'use client';

import { BookingForm } from '@/components/bookings/booking-form';
import { useBooking } from '@/lib/hooks/use-bookings';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditBookingPage() {
    const params = useParams<{ id: string }>();
    const bookingId = Number(params.id);
    const { data: booking, isLoading } = useBooking(bookingId);

    if (isLoading) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!booking) {
        return <div>Booking not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Booking</h1>
                <p className="text-zinc-500">Modify booking details.</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <BookingForm initialData={booking} bookingId={bookingId} />
            </div>
        </div>
    );
}
