"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { 
    Wallet, 
    Shield, 
    Download, 
    ExternalLink, 
    Copy, 
    Eye, 
    EyeOff,
    Calendar,
    Clock,
    CheckCircle,
    Filter,
    Search
} from 'lucide-react';
import { useLogin, useWallets } from '@privy-io/react-auth';
import { useFundWallet } from '@privy-io/react-auth';

export default function UserDashboard() {
    const [showPrivateData, setShowPrivateData] = useState(false);

    const { login } = useLogin();

    const { ready, wallets } = useWallets();
    
    const { fundWallet } = useFundWallet();

    const walletAddress = wallets.find(wallet => wallet.address);

    const mockPurchases = [
    {
        id: 1,
        product: 'Premium Security Suite',
        tokenId: 'PSS-001',
        price: '0.5 ETH',
        date: '2024-01-15',
        status: 'completed',
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=150&fit=crop'
    },
    {
        id: 2,
        product: 'Encrypted Hardware Wallet',
        tokenId: 'EHW-002',
        price: '1.2 ETH',
        date: '2024-01-10',
        status: 'completed',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=150&fit=crop'
    },
    {
        id: 3,
        product: 'Privacy VPN Service',
        tokenId: 'PVS-003',
        price: '0.1 ETH',
        date: '2024-01-05',
        status: 'completed',
        txHash: '0x567890abcdef1234567890abcdef1234567890ab',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=150&fit=crop'
    }
    ];

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    if (!ready || !walletAddress) {
        return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <Card className="bg-background border-border p-12 text-center">
            <div className="w-16 h-16 bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Connect your wallet to access your private purchase history and download your products.
            </p>
            <Button 
                size="lg"
                onClick={login}
                className="bg-accent hover:bg-accent/90 text-white"
            >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
            </Button>
            </Card>
        </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl mb-2">Dashboard</h1>
                </div>
            </div>
        </div>

        {/* Wallet Info */}
        <Card className="bg-accent/10 border-accent/20 p-6 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h3 className="text-lg">Connected Wallet</h3>
                    <div className="flex items-center space-x-2">
                    <code className="text-accent">{formatAddress(walletAddress.address)}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(walletAddress.address)}>
                        <Copy className="w-3 h-3" />
                    </Button>
                    </div>
                </div>
                </div>

                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                <div className="w-2 h-2 bg-green-600 mr-2"></div>
                Connected
                </Badge>
            </div>

            {/* Wallet Balance */}
            <div className="mt-4 text-right">
                <h4 className="text-sm text-muted-foreground mb-1">Balance</h4>
                <div className="text-lg text-accent font-medium">
                {walletAddress?.balance ?? '0.00'} ETH
                </div>
                <button onClick={() => fundWallet(walletAddress.address)}>
                    Fund Wallet
                </button>
            </div>
            </Card>


        {/* Privacy Notice */}
        <Card className="bg-background border-border p-4 mb-8">
            <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="text-sm text-accent mb-1">Privacy Protected</h4>
                <p className="text-xs text-muted-foreground">
                Your purchase history is encrypted and only accessible with your wallet signature. 
                No personal data is stored on our servers.
                </p>
            </div>
            </div>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Purchases Tab */}
            <TabsContent value="purchases" className="mt-6">
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" className="border-border">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    </Button>
                    <Button variant="outline" size="sm" className="border-border">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    {mockPurchases.length} purchases found
                </div>
                </div>

                {/* Purchase List */}
                <div className="space-y-4">
                {mockPurchases.map((purchase) => (
                    <Card key={purchase.id} className="bg-background border-border p-6">
                    <div className="flex items-start space-x-4">
                        <ImageWithFallback
                        src={purchase.image}
                        alt={purchase.product}
                        className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                            <h3 className="text-lg mb-1">{purchase.product}</h3>
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs border-border">
                                Token: {purchase.tokenId}
                                </Badge>
                                <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                                </Badge>
                            </div>
                            </div>
                            <div className="text-right">
                            <div className="text-accent text-lg">{purchase.price}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(purchase.date)}</div>
                            </div>
                        </div>

                        {showPrivateData && (
                            <div className="bg-secondary/20 p-3 mb-4">
                            <div className="text-sm text-muted-foreground mb-1">Transaction Hash</div>
                            <div className="flex items-center space-x-2">
                                <code className="text-xs text-accent">{purchase.txHash}</code>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(purchase.txHash)}>
                                <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                            <Download className="w-3 h-3 mr-2" />
                            Download
                            </Button>
                            <Button size="sm" variant="outline" className="border-border">
                            <ExternalLink className="w-3 h-3 mr-2" />
                            View on Blockchain
                            </Button>
                        </div>
                        </div>
                    </div>
                    </Card>
                ))}
                </div>
            </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="mt-6">
            <div className="space-y-4">
                {mockPurchases.map((purchase) => (
                <Card key={purchase.id} className="bg-background border-border p-6">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/20 flex items-center justify-center">
                        <Download className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                        <h3 className="text-sm">{purchase.product}</h3>
                        <div className="text-xs text-muted-foreground">Available for download</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs border-border">
                        v2.1.0
                        </Badge>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                        </Button>
                    </div>
                    </div>
                </Card>
                ))}
            </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-6">
            <div className="space-y-4">
                {showPrivateData ? (
                mockPurchases.map((purchase) => (
                    <Card key={purchase.id} className="bg-background border-border p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm">Purchase: {purchase.product}</span>
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                                Success
                            </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(purchase.date)}</span>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>14:32 UTC</span>
                            </div>
                        </div>
                        </div>
                        <div className="text-right">
                        <div className="text-accent">{purchase.price}</div>
                        <div className="flex items-center space-x-1 text-xs">
                            <code className="text-muted-foreground">{formatAddress(purchase.txHash)}</code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(purchase.txHash)}>
                            <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                        </div>
                    </div>
                    </Card>
                ))
                ) : (
                <Card className="bg-background border-border p-12 text-center">
                    <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <EyeOff className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg mb-2">Transaction Details Hidden</h3>
                    <p className="text-muted-foreground mb-4">
                    Enable &quot;Show Details&quot; to view your transaction history
                    </p>
                    <Button 
                    onClick={() => setShowPrivateData(true)}
                    className="bg-accent hover:bg-accent/90 text-white"
                    >
                    <Eye className="w-4 h-4 mr-2" />
                    Show Transaction Details
                    </Button>
                </Card>
                )}
            </div>
            </TabsContent>
        </Tabs>
        </div>
    );
}