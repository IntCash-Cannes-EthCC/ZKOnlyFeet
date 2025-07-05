"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCartStore } from './contexts/store/cartStore';
import { Shield, Wallet, User, ShoppingBag, Store, Search, Menu, X } from 'lucide-react';
import { useLogin, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function Header() {
    const { itemCount, openCart } = useCartStore();
    const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [currentPage] = React.useState<string>('home');

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const { login } = useLogin();
    const router = useRouter();
    const { ready, wallets } = useWallets();
    const walletAddress = wallets.find(wallet => wallet.address);

    const handleNav = (path: string) => {
        router.push(path);
        setMobileMenuOpen(false); // Close on navigation
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button onClick={() => handleNav("/")}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-accent flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-accent text-white">
                                IntCash Shop
                            </span>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {[
                            { label: 'Marketplace', icon: <Search className="w-4 h-4" />, path: 'marketplace' },
                            { label: 'Dashboard', icon: <User className="w-4 h-4" />, path: '/dashboard' },
                            { label: 'Merchant', icon: <Store className="w-4 h-4" />, path: 'merchant' }
                        ].map(({ label, icon, path }) => (
                            <button
                                key={label}
                                onClick={() => handleNav(path)}
                                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                                    currentPage === path
                                        ? 'bg-accent/20 text-accent'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Button variant="ghost" size="sm" onClick={openCart} className="relative p-2">
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

                        {/* Wallet */}
                        {ready ? (
                            <div className="hidden md:flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-secondary/20 px-3 py-2">
                                    <Wallet className="w-4 h-4 text-white" />
                                    <span className="text-sm text-muted-foreground">
                                        {walletAddress?.address ? formatAddress(walletAddress.address) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={login}
                                className="hidden md:flex bg-accent hover:bg-accent/90 text-white"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </Button>
                        )}

                        {/* Burger Menu */}
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-background border-t border-border px-4 pt-4 pb-6 space-y-4"
                    >
                        {[
                            { label: 'Marketplace', icon: <Search className="w-4 h-4" />, path: 'marketplace' },
                            { label: 'Dashboard', icon: <User className="w-4 h-4" />, path: '/dashboard' },
                            { label: 'Merchant', icon: <Store className="w-4 h-4" />, path: 'merchant' }
                        ].map(({ label, icon, path }) => (
                            <button
                                key={label}
                                onClick={() => handleNav(path)}
                                className="flex w-full items-center space-x-3 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}

                        {/* Wallet in mobile view */}
                        {ready ? (
                            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary/20 rounded-md">
                                <Wallet className="w-4 h-4 text-accent" />
                                <span className="text-sm text-muted-foreground">
                                    {walletAddress?.address ? formatAddress(walletAddress.address) : 'N/A'}
                                </span>
                            </div>
                        ) : (
                            <Button
                                onClick={login}
                                className="w-full bg-accent hover:bg-accent/90 text-white"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
