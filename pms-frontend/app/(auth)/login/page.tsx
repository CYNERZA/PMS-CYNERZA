'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';
import { authApi, type AuthSetupStatus } from '@/lib/api/auth';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, signup, user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [setupStatus, setSetupStatus] = useState<AuthSetupStatus | null>(null);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const isSignupEnabled = setupStatus?.signup_enabled ?? true;

    useEffect(() => {
        if (!isAuthLoading && user) {
            router.push('/');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadSetupStatus = async () => {
            try {
                const status = await authApi.getSetupStatus();
                setSetupStatus(status);
                if (status.signup_enabled && status.user_count === 0) {
                    setIsSignupMode(true);
                }
            } catch (error) {
                console.error('Failed to load auth setup status:', error);
            }
        };
        loadSetupStatus();
    }, []);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true);
        try {
            if (isSignupMode && isSignupEnabled) {
                await signup(values.email, values.password);
                toast.success('Signup successful');
            } else {
                await login(values.email, values.password);
                toast.success('Login successful');
            }
            router.push('/');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.detail || 'Authentication failed';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">PMS-CYNERZA</CardTitle>
                    <CardDescription className="text-center">
                        {isSignupMode
                            ? 'Create your account to start using PMS-CYNERZA'
                            : 'Enter your email and password to access your account'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin@hotel.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (isSignupMode ? 'Creating account...' : 'Signing in...') : (isSignupMode ? 'Create account' : 'Sign in')}
                            </Button>
                            {isSignupEnabled && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSignupMode((prev) => !prev)}
                                    disabled={isLoading}
                                >
                                    {isSignupMode ? 'Already have an account? Sign in' : 'New user? Create account'}
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
