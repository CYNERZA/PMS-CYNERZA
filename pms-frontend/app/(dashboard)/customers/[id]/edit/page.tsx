'use client';

import { CustomerForm } from '@/components/customers/customer-form';
import { useCustomer } from '@/lib/hooks/use-customers';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditCustomerPage() {
    const params = useParams<{ id: string }>();
    const customerId = Number(params.id);
    const { data: customer, isLoading } = useCustomer(customerId);

    if (isLoading) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Customer</h1>
                <p className="text-zinc-500">Update customer information.</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <CustomerForm initialData={customer} customerId={customerId} />
            </div>
        </div>
    );
}
