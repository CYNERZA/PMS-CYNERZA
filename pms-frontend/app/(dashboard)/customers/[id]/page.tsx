'use client';

import { useCustomer, useCustomerHistory } from '@/lib/hooks/use-customers';
import { CustomerDetailsCard } from '@/components/customers/customer-details-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge'; // Will need to create/add Badge if not exists

export default function CustomerDetailsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const customerId = Number(params.id);

    const { data: customer, isLoading: isLoadingCustomer } = useCustomer(customerId);
    const { data: history, isLoading: isLoadingHistory } = useCustomerHistory(customerId);

    if (isLoadingCustomer) {
        return <div className="p-8 text-center">Loading customer details...</div>;
    }

    if (!customer) {
        return <div className="p-8 text-center text-red-500">Customer not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Details</h1>
                </div>
                <Button onClick={() => router.push(`/customers/${customerId}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Customer
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <CustomerDetailsCard customer={customer} />
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingHistory ? (
                                <p>Loading history...</p>
                            ) : !history || history.length === 0 ? (
                                <p className="text-zinc-500 text-sm">No booking history found.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(history as Booking[]).map((booking) => (
                                            <TableRow key={booking.id} className="cursor-pointer" onClick={() => router.push(`/bookings/${booking.id}`)}>
                                                <TableCell className="font-medium">#{booking.id}</TableCell>
                                                <TableCell>
                                                    {format(new Date(booking.check_in), 'MMM d, yyyy')} - {format(new Date(booking.check_out), 'MMM d, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="capitalize">{booking.status}</span>
                                                    {/* Use Badge component later */}
                                                </TableCell>
                                                <TableCell className="text-right">${booking.total_amount.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
