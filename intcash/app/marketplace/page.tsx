"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@radix-ui/react-checkbox';
import { 
    Search, 
    Grid3X3, 
    List, 
    SlidersHorizontal,
    X,
    Star,
    Shield,
    Globe,
    TrendingUp,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    tokenId?: string;
    isVerified: boolean;
    isNew: boolean;
    isTrending: boolean;
    blockchain: string;
    seller: string;
    views: number;
    likes: number;
    tags: string[];
}

// Mock data for demonstration
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Digital Art NFT Collection',
        price: '2.5 ETH',
        image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop',
        category: 'Digital Art',
        description: 'Unique digital artwork verified on blockchain',
        rating: 4.8,
        reviews: 124,
        tokenId: 'NFT001',
        isVerified: true,
        isNew: true,
        isTrending: true,
        blockchain: 'Ethereum',
        seller: '0x1234...5678',
        views: 1250,
        likes: 89,
        tags: ['art', 'collectible', 'rare']
    },
    {
        id: '2',
        name: 'Smart Contract Template',
        price: '0.8 ETH',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=400&fit=crop',
        category: 'Smart Contracts',
        description: 'Audited smart contract templates for DeFi',
        rating: 4.9,
        reviews: 89,
        tokenId: 'SC002',
        isVerified: true,
        isNew: false,
        isTrending: true,
        blockchain: 'Ethereum',
        seller: '0x9876...5432',
        views: 890,
        likes: 67,
        tags: ['smart-contract', 'defi', 'template']
    },
    {
        id: '3',
        name: 'Metaverse Virtual Land',
        price: '5.2 ETH',
        image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=400&fit=crop',
        category: 'Virtual Real Estate',
        description: 'Prime virtual land in popular metaverse',
        rating: 4.7,
        reviews: 156,
        tokenId: 'LAND003',
        isVerified: true,
        isNew: false,
        isTrending: false,
        blockchain: 'Polygon',
        seller: '0xabcd...efgh',
        views: 2100,
        likes: 145,
        tags: ['metaverse', 'land', 'investment']
    },
    {
        id: '4',
        name: 'Gaming Token Pack',
        price: '1.2 ETH',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop',
        category: 'Gaming',
        description: 'Exclusive gaming tokens and power-ups',
        rating: 4.6,
        reviews: 78,
        tokenId: 'GAME004',
        isVerified: true,
        isNew: true,
        isTrending: false,
        blockchain: 'Binance Smart Chain',
        seller: '0x4567...8901',
        views: 567,
        likes: 34,
        tags: ['gaming', 'tokens', 'power-ups']
    },
    {
        id: '5',
        name: 'DeFi Yield Strategy',
        price: '0.5 ETH',
        image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=400&fit=crop',
        category: 'DeFi',
        description: 'Automated yield farming strategy',
        rating: 4.9,
        reviews: 203,
        tokenId: 'DEFI005',
        isVerified: true,
        isNew: false,
        isTrending: true,
        blockchain: 'Ethereum',
        seller: '0x2345...6789',
        views: 3400,
        likes: 234,
        tags: ['defi', 'yield', 'strategy']
    },
    {
        id: '6',
        name: 'Music NFT Album',
        price: '3.0 ETH',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        category: 'Music',
        description: 'Exclusive music album with royalties',
        rating: 4.8,
        reviews: 92,
        tokenId: 'MUSIC006',
        isVerified: true,
        isNew: true,
        isTrending: false,
        blockchain: 'Ethereum',
        seller: '0x7890...1234',
        views: 1890,
        likes: 156,
        tags: ['music', 'album', 'royalties']
    }
];

const categories = [
    'All Categories',
    'Digital Art',
    'Smart Contracts',
    'Virtual Real Estate',
    'Gaming',
    'DeFi',
    'Music'
];

const blockchains = [
    'All Blockchains',
    'Ethereum',
    'Polygon',
    'Binance Smart Chain',
    'Solana',
    'Avalanche'
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' }
];

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedBlockchain, setSelectedBlockchain] = useState('All Blockchains');
    const [priceRange, setPriceRange] = useState([0, 10]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const [showNewOnly, setShowNewOnly] = useState(false);
    const [showTrendingOnly, setShowTrendingOnly] = useState(false);
    
    const itemsPerPage = 12;

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        const filtered = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        const matchesBlockchain = selectedBlockchain === 'All Blockchains' || product.blockchain === selectedBlockchain;
        const matchesVerified = !showVerifiedOnly || product.isVerified;
        const matchesNew = !showNewOnly || product.isNew;
        const matchesTrending = !showTrendingOnly || product.isTrending;
        
        // Convert price to number for comparison (simplified)
        const priceValue = parseFloat(product.price.split(' ')[0]);
        const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesBlockchain && matchesVerified && 
                matchesNew && matchesTrending && matchesPrice;
        });

        // Sort products
        filtered.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
            return parseFloat(a.price.split(' ')[0]) - parseFloat(b.price.split(' ')[0]);
            case 'price-high':
            return parseFloat(b.price.split(' ')[0]) - parseFloat(a.price.split(' ')[0]);
            case 'rating':
            return b.rating - a.rating;
            case 'popular':
            return b.views - a.views;
            case 'trending':
            return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
            default:
            return 0; // newest (default order)
        }
        });

        return filtered;
    }, [searchTerm, selectedCategory, selectedBlockchain, priceRange, sortBy, showVerifiedOnly, showNewOnly, showTrendingOnly]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All Categories');
        setSelectedBlockchain('All Blockchains');
        setPriceRange([0, 10]);
        setShowVerifiedOnly(false);
        setShowNewOnly(false);
        setShowTrendingOnly(false);
        setCurrentPage(1);
    };

    const activeFiltersCount = [
        searchTerm !== '',
        selectedCategory !== 'All Categories',
        selectedBlockchain !== 'All Blockchains',
        priceRange[0] !== 0 || priceRange[1] !== 10,
        showVerifiedOnly,
        showNewOnly,
        showTrendingOnly
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                <h1 className="text-3xl mb-2">Marketplace</h1>
                <p className="text-muted-foreground">
                    Discover and purchase verified Web3 products
                </p>
                </div>
                <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-accent border-accent">
                    <Globe className="w-3 h-3 mr-1" />
                    Decentralized
                </Badge>
                <Badge variant="outline" className="text-accent border-accent">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                </Badge>
                </div>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search products, categories, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
                </div>
                
                <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                        {activeFiltersCount}
                    </Badge>
                    )}
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                
                <div className="border border-border rounded-md p-1 flex">
                    <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-1"
                    >
                    <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-1"
                    >
                    <List className="w-4 h-4" />
                    </Button>
                </div>
                </div>
            </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
            {showFilters && (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
                >
                <Card className="bg-card border-border p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    <div>
                        <label className="text-sm mb-2 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* Blockchain Filter */}
                    <div>
                        <Label className="text-sm mb-2 block">Blockchain</Label>
                        <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {blockchains.map((blockchain) => (
                            <SelectItem key={blockchain} value={blockchain}>
                                {blockchain}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="text-sm mb-2 block">
                        Price Range: {priceRange[0]} - {priceRange[1]} ETH
                        </label>
                        <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10}
                        min={0}
                        step={0.1}
                        className="mt-2"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div>
                        <label className="text-sm mb-2 block">Quick Filters</label>
                        <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                            id="verified"
                            checked={showVerifiedOnly}
                            onCheckedChange={(checked) => setShowVerifiedOnly(checked === true)}
                            />
                            <label htmlFor="verified" className="text-sm">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Verified Only
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                            id="new"
                            checked={showNewOnly}
                            onCheckedChange={(checked) => setShowNewOnly(checked === true)}
                            />
                            <label htmlFor="new" className="text-sm">
                            <Star className="w-3 h-3 inline mr-1" />
                            New Items
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                            id="trending"
                            checked={showTrendingOnly}
                            onCheckedChange={(checked) => setShowTrendingOnly(checked === true)}
                            />
                            <label htmlFor="trending" className="text-sm">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            Trending
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                        {filteredProducts.length} products found
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Clear Filters
                    </Button>
                    </div>
                </Card>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Products Grid/List */}
            <div className="mb-8">
            {paginatedProducts.length > 0 ? (
                <div className={`grid gap-6 ${
                viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                {paginatedProducts.map((product) => (
                    <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={viewMode === 'list' ? 'w-full' : ''}
                    >
                    <ProductCard
                        product={product}
                        onSelect={() => console.log(`Selected product: ${product.name}`)}
                        viewMode={viewMode}
                    />
                    </motion.div>
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                </Button>
                </div>
            )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                >
                Previous
                </Button>
                
                {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                    return (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                    >
                        {page}
                    </Button>
                    );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                }
                return null;
                })}
                
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                >
                Next
                </Button>
            </div>
            )}
        </div>
        </div>
    );
}