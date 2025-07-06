/* eslint-disable */

"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { Shield, Lock, Zap, Eye, ChevronRight } from 'lucide-react';
import { useLogin } from '@privy-io/react-auth';
import { useRouter} from 'next/navigation';

export default function Homepage() {
  const { login } = useLogin();

  const router = useRouter();

  const featuredProducts = [
      {
        id: '1',
        name: 'Premium Security Suite',
        price: '0.5 ETH',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
        tokenId: 'PSS-001',
        category: 'Software',
        description: 'Advanced security tools for your digital life.',
        rating: 4.8,
        reviews: 120,
        isVerified: true,
        isNew: false,
        tags: ['security', 'software', 'privacy'],
        blockchain: 'Ethereum',
        seller: 'SecureTech',
        views: 500,
        likes: 120,
      },
      {
        id: '2',
        name: 'Encrypted Hardware Wallet',
        price: '1.2 ETH',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
        tokenId: 'EHW-002',
        category: 'Hardware',
        blockchain: 'Ethereum',
        seller: 'CryptoVault',
        views: 800,
        likes: 200,
        rating: 4.9,
        tags: [],
        reviews: 85,
        isVerified: true,
        isNew: true,
        description: 'Securely store your cryptocurrency with this encrypted hardware wallet.',
      },
      {
        id: '3',
        name: 'Private VPN Service',
        tags: ['vpn', 'privacy', 'service'],
        blockchain: 'Polygon',
        seller: 'PrivacyNet',
        views: 300,
        likes: 90,
        price: '0.1 ETH',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop',
        tokenId: 'PVS-003',
        category: 'Service',
        description: 'Browse the internet securely and anonymously.',
        rating: 4.7,
        reviews: 200,
        isVerified: true,
        isNew: false,
      },
      {
        id: '4',
        name: 'Anonymous Email Suite',
        price: '0.3 ETH',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
        tokenId: 'AES-004',
        category: 'Software',
        description: 'Send and receive emails without compromising your identity.',
        rating: 4.6,
        reviews: 150,
        isVerified: true,
        isNew: true,
        tags: ['email', 'software', 'privacy'],
        blockchain: 'Ethereum',
        seller: 'PrivacyMail',
        views: 250,
        likes: 75
      }
    ];

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Payments',
      description: 'Complete transaction privacy using advanced cryptographic protocols'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data encrypted locally before transmission to our servers'
    },
    {
      icon: Eye,
      title: 'No Personal Data',
      description: 'No account required. Your blockchain identity is your only credential'
    },
    {
      icon: Zap,
      title: 'Instant Settlement',
      description: 'Blockchain-based payments settle in seconds, not days'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-accent text-white border-accent">
              Privacy-First eCommerce
            </Badge>
            <h1 className="text-4xl lg:text-6xl max-w-4xl mx-auto mb-6 text-foreground">
              Shop Securely with Blockchain Technology
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience true privacy in eCommerce. No accounts, no tracking, no compromises. 
              Your identity stays yours while you access premium digital products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() => { router.push('/marketplace') }
                }
              >
                Explore Products
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-border text-muted-foreground hover:bg-secondary/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">
              Built for Privacy &amp; Security
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every transaction is designed to protect your privacy while ensuring security and authenticity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <Card key={index} className="bg-card border-border p-6 text-center">
                <div className="w-12 h-12 bg-accent flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl mb-4">Featured Products</h2>
              <p className="text-muted-foreground">
                Curated selection of premium privacy and security tools
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-border text-muted-foreground hover:bg-secondary/20"
              onClick={() => { router.push('/marketplace') }
              }
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Ready to Shop Privately?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your wallet and start experiencing truly private eCommerce today.
          </p>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => {
              login()
            }
            }
          >
            Connect Wallet &amp; Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
}