'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HotelProfileForm } from '@/components/settings/hotel-profile-form';
import { IntegrationsTab } from '@/components/settings/integrations-tab';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Manage your hotel details and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Hotel Profile</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hotel Profile</CardTitle>
                            <CardDescription>
                                Update your hotel's public information and contact details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HotelProfileForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                    <IntegrationsTab />
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your account information and password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-zinc-500">
                                Account management features coming soon.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Preferences</CardTitle>
                            <CardDescription>
                                Configure system-wide settings and defaults.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-zinc-500">
                                System preference settings coming soon.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
