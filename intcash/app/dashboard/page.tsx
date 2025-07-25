/* eslint-disable */

"use client";

import React, { useEffect, useState } from 'react';
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
    Search,
    BadgeCheck as LucideBadge
} from 'lucide-react';
import { useLogin, useWallets, useFundWallet } from '@privy-io/react-auth';
import { SelfAppBuilder, SelfQRcodeWrapper } from '@selfxyz/qrcode';
import { useBalance } from 'wagmi';
import { useVerifySelfIdentity } from '@/components/selfProtocol/useVerifySelfIdentity';
import { stringToBytes } from 'viem';
// import { useIntMaxClient } from '@/components/hooks/useIntmaxClient';

export default function UserDashboard() {
    const [showPrivateData, setShowPrivateData] = useState(false);
    const [userVerified, setUserVerified] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [SelfApp, setSelfApp] = useState<SelfAppBuilder | any>(null);
    const { isVerified, isVerifying } = useVerifySelfIdentity();
    const { login } = useLogin();
    const { ready, wallets } = useWallets();
    const { fundWallet } = useFundWallet();

    // const { login: intMaxLogin } = useIntMaxClient();

    const walletAddress = wallets.find(wallet => wallet.address);

    const { data, isError, isLoading } = useBalance({
        address: walletAddress?.address as `0x${string}`
    });

    const handleSuccessfulVerification = () => {
        setUserVerified(true);
        console.log('User successfully verified!');
    }

    useEffect(() => {
        if (!walletAddress?.address || isVerifying) return;
    
        setUserVerified(!!isVerified);

        console.log('Wallet Address:', walletAddress.address);
    
        const isValidEthAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress.address);
        if (!isValidEthAddress) {
            console.error('Invalid wallet address:', walletAddress.address);
            return; // ⬅️ this prevents the SelfAppBuilder from being called
        }
    
        const builder = new SelfAppBuilder({
            appName: 'IntCash Shop',
            scope: 'intmax',
            endpoint: '0x02CB960aEaCb8325Da67ee3f34D82B5AC84EB8CB',
            userId: walletAddress.address, // ✅ Validated earlier
            userIdType: 'hex',
            disclosures: {
                name: true,
                nationality: true,
                date_of_birth: true,
                passport_number: true,
                minimumAge: 18,
                excludedCountries: ['IRN', 'PRK'],
                ofac: true
            },
            devMode: false,
            userDefinedData: JSON.stringify({
                intmaxAddress: walletAddress.address,
                evmAddress: walletAddress,
                destinationChainSelector: '16015286601757825753' // Sepolia Chain
            }),
            version: 1,
            chainID: 44787, // Sepolia Testnet Chain ID
        });
    
        setSelfApp(builder);
    }, [isVerifying, isVerified, walletAddress?.address]);
    

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

    const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });

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
            <Button size="lg" onClick={login} className="bg-accent hover:bg-accent/90 text-white">
                <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                
                {/* Wallet Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center sm:space-x-4 justify-center sm:justify-start">
                <div className="w-12 h-12 bg-accent/20 flex items-center justify-center rounded-full mb-2 sm:mb-0">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-base font-medium">Connected Wallet</h3>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <code className="text-white text-sm">{formatAddress(walletAddress.address)}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(walletAddress.address)}>
                        <Copy className="w-3 h-3" />
                    </Button>

                    <h3 className="text-base font-medium">IntMax Wallet</h3>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <code className="text-white text-sm">{formatAddress("iAeHVHhGgCj2Jvt9S5P5TLexx9qY6cCYzXgEZd71auASGFdAkLY2WZ5L5Y7jmdhqKmLTQWZcmzSjWioycRjuNL72LdtRxnc")}</code>

                </div>
                    </div>
                </div>
                </div>

                {/* Balance + Fund Wallet */}
                <div className="flex flex-col items-center sm:items-center justify-center space-y-1">
                <h4 className="text-sm text-muted-foreground">Balance</h4>
                <div className="text-lg text-white font-semibold">
                    {
                    data && !isLoading && !isError ? (
                        <span>{Number(data.formatted).toFixed(2)} ETH</span>
                    ) : (
                        <span className="text-red-500">Loading...</span>
                    )
                    }
                </div>
                <Button 
                    variant="outline" 
                    className="text-sm text-white"
                    onClick={() => fundWallet(walletAddress.address)}
                >
                    Fund Wallet
                </Button>
                </div>

                {/* Wallet Status */}
                <div className="flex justify-center items-center">
                {
                    userVerified ? (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 px-4 py-1">
                        <div className="flex items-center space-x-2">
                        <LucideBadge className="text-xs text-green-600" />
                            <span className="text-sm">Verified User</span>
                        </div>
                    </Badge>
                    )
                    :
                    (
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30 px-4 py-1">
                        <div className="flex items-center space-x-2">
                        <Button className="text-sm text-red-600"
                            onClick={() => {
                                setIsDialogOpen(true);
                            }}
                        >
                            Get Verified
                        </Button>
                        {isDialogOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-background rounded-lg p-6 max-w-md w-full relative">
                                <button
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setIsDialogOpen(false)}
                                    aria-label="Close dialog"
                                >
                                    ✕
                                </button>

                                <h2 className="text-xl font-semibold mb-4">Verify Your Identity</h2>

                                {SelfApp ? (
                                    <SelfQRcodeWrapper
                                    selfApp={SelfApp}
                                    onSuccess={() => {
                                        handleSuccessfulVerification();
                                        setIsDialogOpen(false);
                                    }}
                                    onError={() => {
                                        console.error("Error: Failed to verify identity");
                                    }}
                                    />
                                ) : (
                                    <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Loading QR Code...</p>
                                    </div>
                                )}
                                </div>
                            </div>
                            )}
                        </div>
                    </Badge>
                    )
                }
                </div>

            </div>
            </Card>

        {/* Privacy Notice */}
        <Card className="bg-background border-border p-4 mb-8">
            <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="text-sm text-white mb-1">Privacy Protected</h4>
                <p className="text-xs text-white-foreground">
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