"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCartStore } from './contexts/store/cartStore';
import { Shield, Wallet, Home, User, ShoppingBag, Store, Search } from 'lucide-react';
import { useLogin, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function Header() {
    const { itemCount, openCart } = useCartStore();
    const [currentPage] = React.useState<string>('home');

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const { login } = useLogin();

    const router = useRouter();

    const { ready, wallets } = useWallets();

    const walletAddress = wallets.find((wallet) => wallet.address);
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={
                () => (
                    router.push("/")
                )
            }
            >
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-accent ring">
                IntCash Shop
                </span>
            </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
                <button
                onClick={() => router.push('home')}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                    currentPage === 'home' 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                >
                <Home className="w-4 h-4" />
                <span>Home</span>
                </button>
                
                <button
                onClick={() => router.push('marketplace')}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                    currentPage === 'marketplace' 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                >
                <Search className="w-4 h-4" />
                <span>Marketplace</span>
                </button>
                
                <button
                onClick={() => router.push('/dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                    currentPage === 'dashboard' 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
                </button>

                <button
                onClick={() => router.push('merchant')}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                    currentPage === 'merchant' 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                >
                <Store className="w-4 h-4" />
                <span>Merchant</span>
                </button>
            </nav>

            {/* Cart and Wallet Connection */}
            <div className="flex items-center space-x-4">
                {/* Shopping Cart */}
                <Button
                variant="ghost"
                size="sm"
                onClick={openCart}
                className="relative p-2"
                >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                    <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                    >
                    <Badge className="bg-accent text-white h-5 min-w-[20px] text-xs flex items-center justify-center px-1">
                        {itemCount}
                    </Badge>
                    </motion.div>
                )}
                </Button>

                {ready ? (
                <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                    <div className="w-2 h-2 bg-white mr-2"></div>
                    Connected
                    </Badge>
                    <div className="flex items-center space-x-2 bg-secondary/20 px-3 py-2">
                    <Wallet className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">
                        {walletAddress?.address ? formatAddress(walletAddress.address) : 'N/A'}
                    </span>
                    </div>
                </div>
                ) : (
                <Button
                    onClick={login}
                    className="bg-accent hover:bg-accent/90 text-white"
                >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                </Button>
                )}
            </div>
            </div>
        </div>
        </header>
    );
}