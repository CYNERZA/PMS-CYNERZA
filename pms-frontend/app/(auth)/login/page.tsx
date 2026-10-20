'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
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
    const [showPassword, setShowPassword] = useState(false);
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
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = isAxiosError<{ detail?: string }>(error)
                ? error.response?.data?.detail || 'Authentication failed'
                : 'Authentication failed';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
                                <main className="min-h-screen bg-[#f6f7f2] lg:grid lg:grid-cols-[1.04fr_0.96fr]">
                                    <section
                                        className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden bg-[#183c32] bg-cover bg-center px-6 py-7 text-white sm:min-h-[340px] sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85')" }}
                                        aria-label="Hotel resort"
                                    >
                                        <div className="absolute inset-0 -z-10 bg-[#10231d]/35" />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10231d]/90 via-[#10231d]/10 to-[#10231d]/30" />
                                        <a href="/login" className="flex w-fit items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                                            <span className="flex size-11 items-center justify-center rounded-md bg-white/15 backdrop-blur-sm">
                                                <Building2 aria-hidden="true" className="size-6" />
                                            </span>
                                            <span>
                                                <span className="block text-sm font-semibold tracking-[0.08em]">CYNERZA</span>
                                                <span className="mt-0.5 block text-[10px] font-medium tracking-[0.18em] text-white/75">HOTEL OPERATIONS</span>
                                            </span>
                                        </a>
                                        <div className="max-w-xl pb-1 sm:pb-4 lg:pb-10">
                                            <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-[#d6c79f]">HOSPITALITY, IN SYNC</p>
                                            <h1 className="max-w-lg text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[52px]">Make every stay feel considered.</h1>
                                            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                                                A thoughtful space for the people and details behind a great guest experience.
                                            </p>
                                            <div className="mt-7 hidden items-center gap-3 border-t border-white/25 pt-5 text-sm text-white/85 sm:flex lg:mt-10">
                                                <ShieldCheck aria-hidden="true" className="size-5 text-[#d6c79f]" />
                                                <span>One secure place for your property team.</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="flex min-h-[calc(100svh-270px)] items-center justify-center px-5 py-10 sm:min-h-[calc(100svh-340px)] sm:px-10 sm:py-14 lg:min-h-screen lg:px-12">
                                        <div className="w-full max-w-[430px]">
                                            <div className="mb-8 lg:mb-10">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587166]">
                                                    {isSignupMode ? 'A better way to host' : 'Your property, in good hands'}
                                                </p>
                                                <h2 className="mt-3 text-[30px] font-semibold leading-tight text-[#1b2e27] sm:text-4xl">
                                                    {isSignupMode ? 'Create your account' : 'Welcome back'}
                                                </h2>
                                                <p className="mt-3 text-sm leading-6 text-[#69766f] sm:text-base">
                                                    {isSignupMode ? 'Set up your secure access to CYNERZA.' : 'Sign in to continue to your hotel workspace.'}
                                                </p>
                                            </div>
                                            {isSignupEnabled && (
                                                <div className="mb-7 grid grid-cols-2 rounded-md border border-[#dfe4dc] bg-[#edf0e9] p-1" role="group" aria-label="Choose account access">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSignupMode(false)}
                                                        aria-pressed={!isSignupMode}
                                                        className={`min-h-10 rounded-[4px] px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315d4d] ${!isSignupMode ? 'bg-white text-[#203b30] shadow-sm' : 'text-[#68766e] hover:text-[#203b30]'}`}
                                                        disabled={isLoading}
                                                    >Sign in</button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSignupMode(true)}
                                                        aria-pressed={isSignupMode}
                                                        className={`min-h-10 rounded-[4px] px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315d4d] ${isSignupMode ? 'bg-white text-[#203b30] shadow-sm' : 'text-[#68766e] hover:text-[#203b30]'}`}
                                                        disabled={isLoading}
                                                    >Create account</button>
                                                </div>
                                            )}
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                                    <FormField
                                                        control={form.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[13px] font-medium text-[#293a32]">Work email</FormLabel>
                                                                <FormControl>
                                                                    <span className="relative block">
                                                                        <Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#849188]" />
                                                                        <Input
                                                                            type="email"
                                                                            autoComplete="email"
                                                                            placeholder="you@yourhotel.com"
                                                                            className="h-[50px] rounded-md border-[#d9e0d8] bg-white pl-11 text-sm text-[#20312a] placeholder:text-[#a1aaa4] focus-visible:border-[#527963] focus-visible:ring-[#527963]/20"
                                                                            {...field}
                                                                        />
                                                                    </span>
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
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <FormLabel className="text-[13px] font-medium text-[#293a32]">Password</FormLabel>
                                                                    {!isSignupMode && <span className="text-xs text-[#849188]">Protected sign in</span>}
                                                                </div>
                                                                <FormControl>
                                                                    <span className="relative block">
                                                                        <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#849188]" />
                                                                        <Input
                                                                            type={showPassword ? 'text' : 'password'}
                                                                            autoComplete={isSignupMode ? 'new-password' : 'current-password'}
                                                                            placeholder="Enter your password"
                                                                            className="h-[50px] rounded-md border-[#d9e0d8] bg-white pl-11 pr-12 text-sm text-[#20312a] placeholder:text-[#a1aaa4] focus-visible:border-[#527963] focus-visible:ring-[#527963]/20"
                                                                            {...field}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowPassword((visible) => !visible)}
                                                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                                            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-[#78877d] transition-colors hover:bg-[#f0f3ee] hover:text-[#294b3d] focus-visible:outline-2 focus-visible:outline-[#527963]"
                                                                        >
                                                                            {showPassword ? <EyeOff aria-hidden="true" className="size-[18px]" /> : <Eye aria-hidden="true" className="size-[18px]" />}
                                                                        </button>
                                                                    </span>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        className="mt-2 h-[50px] w-full rounded-md bg-[#214b3b] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#193d30]"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (isSignupMode ? 'Creating account...' : 'Signing in...') : (isSignupMode ? 'Create account' : 'Sign in to workspace')}
                                                        {!isLoading && <ArrowRight aria-hidden="true" className="size-4" />}
                                                    </Button>
                                                </form>
                                            </Form>
                                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#7a877e]">
                                                <ShieldCheck aria-hidden="true" className="size-4 text-[#66806e]" />
                                                <span>Your account details are kept secure.</span>
                                            </div>
                                            <p className="mt-8 text-center text-[11px] text-[#9aa39c]">CYNERZA PROPERTY MANAGEMENT</p>
                                        </div>
                                    </section>
                                </main>
    );
}
