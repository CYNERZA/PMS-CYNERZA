'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MoreVertical, Plug } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface Platform {
    id: string;
    name: string;
    description: string;
    logo: string;
    isConnected: boolean;
}

const platforms: Platform[] = [
    {
        id: 'makemytrip',
        name: 'MakeMyTrip',
        description: "Sync bookings from India's largest online travel company",
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KtO6UO_scXnTXfXk99apcH4k6gnFPvTkwg&s',
        isConnected: true,
    },
    {
        id: 'goibibo',
        name: 'Goibibo',
        description: 'Connect with Goibibo for travel bookings and reservations',
        logo: 'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/goibibo-app-icon.png',
        isConnected: false,
    },
    {
        id: 'oyo',
        name: 'OYO Rooms',
        description: 'Integrate with OYO network for standardized bookings',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqZ8hbAfIrRwG9fsGwYr8-Q4H5CqZWbfMJOg&s',
        isConnected: false,
    },
    {
        id: 'booking',
        name: 'Booking.com',
        description: "Connect with the world's leading accommodation provider",
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNArcbwMMF5uAN96zxVLXEvoRKdkF2-wc6tsK-H6jvaROejzsSTBdLiwM&s',
        isConnected: false,
    },
    {
        id: 'airbnb',
        name: 'Airbnb',
        description: 'Sync your property with Airbnb platform',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQaXkdtkvlTpDiPo0uHyuaaUN_u9XbZ_CbJg&s',
        isConnected: false,
    },
    {
        id: 'cleartrip',
        name: 'Cleartrip',
        description: 'Manage bookings from Cleartrip travel platform',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNceYUBIxm93YEf9fMH5fUqnGpQaE8MUMh-BpsVw0uS9JxwAxYbfvRvQc&s',
        isConnected: false,
    },
    {
        id: 'yatra',
        name: 'Yatra',
        description: 'Connect with Yatra online travel agency',
        logo: 'https://companieslogo.com/img/orig/YTRA-e2b9309c.png?t=1720244494',
        isConnected: false,
    },
    {
        id: 'easemytrip',
        name: 'EaseMyTrip',
        description: 'Integrate with EaseMyTrip booking platform',
        logo: 'https://play-lh.googleusercontent.com/9xMTcIms0WtWj8Ra4Vhlfm3Dz8zrd53tfrgyyA5kNLHnap2qjSrPDshm3YfKLElY4w',
        isConnected: false,
    },
];

export function IntegrationsTab() {
    const [connectedPlatforms, setConnectedPlatforms] = useState(
        platforms.filter((p) => p.isConnected)
    );
    const [availablePlatforms, setAvailablePlatforms] = useState(
        platforms.filter((p) => !p.isConnected)
    );

    const handleConnect = (platformId: string) => {
        const platform = availablePlatforms.find((p) => p.id === platformId);
        if (platform) {
            setConnectedPlatforms([...connectedPlatforms, { ...platform, isConnected: true }]);
            setAvailablePlatforms(availablePlatforms.filter((p) => p.id !== platformId));
        }
    };

    const handleDisconnect = (platformId: string) => {
        const platform = connectedPlatforms.find((p) => p.id === platformId);
        if (platform) {
            setAvailablePlatforms([...availablePlatforms, { ...platform, isConnected: false }]);
            setConnectedPlatforms(connectedPlatforms.filter((p) => p.id !== platformId));
        }
    };

    return (
        <div className="space-y-8">
            {/* Connected Platforms */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                        Connected Platforms
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Connected platforms provide automatic booking sync and data updates
                    </p>
                </div>

                <div className="space-y-3">
                    {connectedPlatforms.length === 0 ? (
                        <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Plug className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h4 className="text-sm font-medium mb-1">No connected platforms</h4>
                            <p className="text-sm text-muted-foreground">
                                Connect a platform below to start syncing bookings
                            </p>
                        </Card>
                    ) : (
                        connectedPlatforms.map((platform) => (
                            <Card key={platform.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 border p-2 flex-shrink-0">
                                        <img
                                            src={platform.logo}
                                            alt={`${platform.name} logo`}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
                                            {platform.name}
                                        </h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                            {platform.description}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Connected
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Settings</DropdownMenuItem>
                                            <DropdownMenuItem>Sync Now</DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDisconnect(platform.id)}
                                            >
                                                Disconnect
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Available Platforms */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                        Available Platforms
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Connect your hotel with third-party booking platforms for seamless data sync
                    </p>
                </div>

                <div className="space-y-3">
                    {availablePlatforms.map((platform) => (
                        <Card key={platform.id} className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 border p-2 flex-shrink-0">
                                    <img
                                        src={platform.logo}
                                        alt={`${platform.name} logo`}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
                                        {platform.name}
                                    </h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                        {platform.description}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConnect(platform.id)}
                                >
                                    Connect
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
