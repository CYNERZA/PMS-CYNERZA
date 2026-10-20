'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import {
    ArrowRight,
    BarChart3,
    Building2,
    CalendarCheck,
    Check,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
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

const highlights = [
    {
        icon: CalendarCheck,
        title: 'Bookings that stay in sync',
        description: 'Live availability, arrivals, and departures in one view.',
    },
    {
        icon: BarChart3,
        title: 'Clarity on every metric',
        description: 'Revenue and occupancy insights without the spreadsheets.',
    },
    {
        icon: Users,
        title: 'Built for your whole team',
        description: 'Front desk, housekeeping, and management on the same page.',
    },
];

function getPasswordStrength(password: string) {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const map = [
        { label: 'Too short', color: 'bg-rose-400' },
        { label: 'Weak', color: 'bg-rose-400' },
        { label: 'Fair', color: 'bg-amber-400' },
        { label: 'Good', color: 'bg-emerald-400' },
        { label: 'Strong', color: 'bg-emerald-500' },
    ];

    return { score, ...map[score] };
}

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

    const passwordValue = form.watch('password');
    const passwordStrength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true);
        try {
            if (isSignupMode && isSignupEnabled) {
                await signup(values.email, values.password);
                toast.success('Account created successfully');
            } else {
                await login(values.email, values.password);
                toast.success('Welcome back');
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

    const switchMode = (signupMode: boolean) => {
        if (isLoading) return;
        setIsSignupMode(signupMode);
        form.clearErrors();
    };

    return (
        <main className="min-h-svh bg-[#f4f6f1] lg:grid lg:grid-cols-[1.02fr_0.98fr]">
            <section className="relative isolate hidden overflow-hidden bg-[#0b2a22] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_0%_0%,#1d5a48_0%,#0b2a22_55%,#071f19_100%)]" />
                <div
                    className="absolute inset-0 -z-10 opacity-[0.16]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)',
                        backgroundSize: '26px 26px',
                    }}
                />
                <div className="absolute -right-32 -top-24 -z-10 size-[420px] rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute -bottom-40 -left-24 -z-10 size-[380px] rounded-full bg-[#c9b98a]/15 blur-3xl" />

                <a
                    href="/login"
                    className="flex w-fit items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                        <Building2 aria-hidden="true" className="size-5" />
                    </span>
                    <span>
                        <span className="block text-sm font-semibold tracking-[0.14em]">CYNERZA</span>
                        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.2em] text-white/60">
                            HOTEL OPERATIONS
                        </span>
                    </span>
                </a>

                <div className="max-w-xl py-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#e2d5ad] backdrop-blur-sm">
                        <Sparkles aria-hidden="true" className="size-3.5" />
                        HOSPITALITY, IN SYNC
                    </span>
                    <h1 className="mt-6 text-[42px] font-semibold leading-[1.08] tracking-tight xl:text-[52px]">
                        Every stay,
                        <br />
                        <span className="text-[#dccf9f]">thoughtfully managed.</span>
                    </h1>
                    <p className="mt-5 max-w-md text-[15px] leading-7 text-white/70">
                        The calm, connected workspace for the people and details behind a
                        remarkable guest experience.
                    </p>

                    <ul className="mt-9 space-y-3">
                        {highlights.map((item) => (
                            <li
                                key={item.title}
                                className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm"
                            >
                                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#e2d5ad] ring-1 ring-white/10">
                                    <item.icon aria-hidden="true" className="size-4" />
                                </span>
                                <span>
                                    <span className="block text-sm font-medium text-white">
                                        {item.title}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-5 text-white/60">
                                        {item.description}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3 text-sm text-white/75">
                        <ShieldCheck aria-hidden="true" className="size-5 text-[#dccf9f]" />
                        <span>Secure, role-based access for your property team.</span>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] text-white/35">
                        © CYNERZA
                    </span>
                </div>
            </section>

            <section className="relative flex min-h-svh items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_100%_0%,#e6eee5_0%,transparent_60%)]" />
                <div className="relative w-full max-w-[440px]">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#0f3a2e] text-white">
                            <Building2 aria-hidden="true" className="size-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold tracking-[0.14em] text-[#163a2e]">
                                CYNERZA
                            </span>
                            <span className="mt-0.5 block text-[10px] font-medium tracking-[0.18em] text-[#7e8d83]">
                                HOTEL OPERATIONS
                            </span>
                        </span>
                    </div>

                    <div className="rounded-[28px] border border-[#e2e8df] bg-white/85 p-6 shadow-[0_30px_80px_-40px_rgba(12,42,32,0.45)] backdrop-blur-xl sm:p-8">
                        <div className="mb-7">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#738478]">
                                {isSignupMode ? 'A better way to host' : 'Your property, in good hands'}
                            </p>
                            <h2 className="mt-2.5 text-[30px] font-semibold leading-tight tracking-tight text-[#122b22]">
                                {isSignupMode ? 'Create your account' : 'Welcome back'}
                            </h2>
                            <p className="mt-2.5 text-sm leading-6 text-[#6a786f]">
                                {isSignupMode
                                    ? 'Set up secure access to your CYNERZA workspace in a few seconds.'
                                    : 'Sign in to continue to your hotel workspace.'}
                            </p>
                        </div>

                        {isSignupEnabled && (
                            <div
                                className="mb-6 grid grid-cols-2 rounded-xl border border-[#e2e8df] bg-[#eef2ec] p-1"
                                role="group"
                                aria-label="Choose account access"
                            >
                                <button
                                    type="button"
                                    onClick={() => switchMode(false)}
                                    aria-pressed={!isSignupMode}
                                    disabled={isLoading}
                                    className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6a53] disabled:opacity-60 ${
                                        !isSignupMode
                                            ? 'bg-white text-[#163a2e] shadow-sm ring-1 ring-black/[0.04]'
                                            : 'text-[#6f7f75] hover:text-[#163a2e]'
                                    }`}
                                >
                                    Sign in
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMode(true)}
                                    aria-pressed={isSignupMode}
                                    disabled={isLoading}
                                    className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6a53] disabled:opacity-60 ${
                                        isSignupMode
                                            ? 'bg-white text-[#163a2e] shadow-sm ring-1 ring-black/[0.04]'
                                            : 'text-[#6f7f75] hover:text-[#163a2e]'
                                    }`}
                                >
                                    Create account
                                </button>
                            </div>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[13px] font-medium text-[#2a3d34]">
                                                Work email
                                            </FormLabel>
                                            <FormControl>
                                                <span className="relative block">
                                                    <Mail
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#8b998f]"
                                                    />
                                                    <Input
                                                        type="email"
                                                        autoComplete="email"
                                                        placeholder="you@yourhotel.com"
                                                        className="h-12 rounded-xl border-[#dbe2d8] bg-white/90 pl-11 text-sm text-[#1c332a] shadow-sm placeholder:text-[#a3aca6] transition focus-visible:border-[#3f7a62] focus-visible:ring-4 focus-visible:ring-[#3f7a62]/15"
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
                                                <FormLabel className="text-[13px] font-medium text-[#2a3d34]">
                                                    Password
                                                </FormLabel>
                                                {!isSignupMode && (
                                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8b998f]">
                                                        <ShieldCheck aria-hidden="true" className="size-3.5" />
                                                        Protected sign in
                                                    </span>
                                                )}
                                            </div>
                                            <FormControl>
                                                <span className="relative block">
                                                    <LockKeyhole
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#8b998f]"
                                                    />
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        autoComplete={
                                                            isSignupMode
                                                                ? 'new-password'
                                                                : 'current-password'
                                                        }
                                                        placeholder={
                                                            isSignupMode
                                                                ? 'Create a strong password'
                                                                : 'Enter your password'
                                                        }
                                                        className="h-12 rounded-xl border-[#dbe2d8] bg-white/90 pl-11 pr-12 text-sm text-[#1c332a] shadow-sm placeholder:text-[#a3aca6] transition focus-visible:border-[#3f7a62] focus-visible:ring-4 focus-visible:ring-[#3f7a62]/15"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword((visible) => !visible)
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? 'Hide password'
                                                                : 'Show password'
                                                        }
                                                        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#7c8b81] transition-colors hover:bg-[#eef2ec] hover:text-[#204b3a] focus-visible:outline-2 focus-visible:outline-[#3f7a62]"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff aria-hidden="true" className="size-[18px]" />
                                                        ) : (
                                                            <Eye aria-hidden="true" className="size-[18px]" />
                                                        )}
                                                    </button>
                                                </span>
                                            </FormControl>
                                            {isSignupMode && passwordValue && (
                                                <div className="pt-1.5">
                                                    <div className="flex gap-1.5">
                                                        {[0, 1, 2, 3].map((index) => (
                                                            <span
                                                                key={index}
                                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                                    index < passwordStrength.score
                                                                        ? passwordStrength.color
                                                                        : 'bg-[#e4e9e2]'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] text-[#8b998f]">
                                                        Password strength:{' '}
                                                        <span className="font-medium text-[#5c7267]">
                                                            {passwordStrength.label}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-2 h-12 w-full rounded-xl bg-linear-to-b from-[#2a644e] to-[#1b4938] text-sm font-semibold text-white shadow-lg shadow-[#1b4938]/20 transition hover:from-[#2f6d55] hover:to-[#1f523f] focus-visible:ring-4 focus-visible:ring-[#3f7a62]/30 active:translate-y-px"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                                            {isSignupMode
                                                ? 'Creating your account...'
                                                : 'Signing you in...'}
                                        </>
                                    ) : (
                                        <>
                                            {isSignupMode ? 'Create account' : 'Sign in to workspace'}
                                            <ArrowRight aria-hidden="true" className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[#7c8b81]">
                            <span className="inline-flex items-center gap-1.5">
                                <Check aria-hidden="true" className="size-3.5 text-[#3f7a62]" />
                                Encrypted session
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Check aria-hidden="true" className="size-3.5 text-[#3f7a62]" />
                                Role-based access
                            </span>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[11px] tracking-wide text-[#98a29b]">
                        {isSignupMode
                            ? 'Already have access? Switch to sign in above.'
                            : 'Need access? Ask your property administrator.'}
                    </p>
                </div>
            </section>
        </main>
    );
}
