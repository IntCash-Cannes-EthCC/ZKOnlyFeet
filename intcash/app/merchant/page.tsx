"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Search, 
    Package,
    DollarSign,
    Shield,
    Zap,
    Hash,
    Save
} from 'lucide-react';

import { useLogin, useWallets } from '@privy-io/react-auth';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    status: 'active' | 'draft' | 'archived';
    stock: number;
    tokenId: string;
    isPrivate: boolean;
    sales: number;
    views: number;
    createdAt: string;
}

export default function MerchantDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { login } = useLogin();
    
    const { ready, wallets } = useWallets();

    const walletAddress = wallets.find(wallet => wallet.address);

    const [products, setProducts] = useState<Product[]>([
        {
        id: '1',
        name: 'Digital Art Collection',
        description: 'Exclusive NFT artwork with blockchain verification',
        price: '0.5 ETH',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
        category: 'Digital Art',
        status: 'active',
        stock: 10,
        tokenId: 'TOKEN001',
        isPrivate: false,
        sales: 45,
        views: 1250,
        createdAt: '2024-01-15'
        },
        {
        id: '2',
        name: 'Privacy Software License',
        description: 'Zero-knowledge encryption software with lifetime updates',
        price: '0.2 ETH',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop',
        category: 'Software',
        status: 'active',
        stock: 100,
        tokenId: 'TOKEN002',
        isPrivate: true,
        sales: 23,
        views: 890,
        createdAt: '2024-01-20'
        },
        {
        id: '3',
        name: 'Blockchain Course',
        description: 'Complete Web3 development course with certification',
        price: '0.1 ETH',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop',
        category: 'Education',
        status: 'draft',
        stock: 50,
        tokenId: 'TOKEN003',
        isPrivate: false,
        sales: 12,
        views: 567,
        createdAt: '2024-01-25'
        }
    ]);

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: 0,
        isPrivate: false,
        status: 'draft'
    });

    const stats = {
        totalProducts: products.length,
        totalSales: products.reduce((sum, p) => sum + p.sales, 0),
        totalViews: products.reduce((sum, p) => sum + p.views, 0),
        totalRevenue: '2.8 ETH'
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddProduct = () => {
        const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name || '',
        description: newProduct.description || '',
        price: newProduct.price || '',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
        category: newProduct.category || '',
        status: newProduct.status as 'active' | 'draft' | 'archived' || 'draft',
        stock: newProduct.stock || 0,
        tokenId: `TOKEN${Date.now()}`,
        isPrivate: newProduct.isPrivate || false,
        sales: 0,
        views: 0,
        createdAt: new Date().toISOString().split('T')[0]
        };

        setProducts([...products, product]);
        setNewProduct({ name: '', description: '', price: '', category: '', stock: 0, isPrivate: false, status: 'draft' });
        setIsAddProductOpen(false);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = () => {
        if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
        }
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!ready) {
        return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl mb-4">Merchant Dashboard</h2>
            <p className="text-muted-foreground mb-8">
                Connect your wallet to access your merchant dashboard and manage your products.
            </p>
            <Button onClick={login} className="bg-accent hover:bg-accent/90 text-white">
                Connect Wallet
            </Button>
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="text-3xl mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
                Connected: {formatAddress(walletAddress?.address ?? '')}
            </p>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                    Create a new product with blockchain verification and privacy features.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                    />
                    </div>
                    <div>
                    <Label htmlFor="price">Price (ETH)</Label>
                    <Input
                        id="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0.1 ETH"
                    />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Product description"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        placeholder="100"
                    />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                    id="private"
                    checked={newProduct.isPrivate}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, isPrivate: checked })}
                    />
                    <Label htmlFor="private">Private Product (Requires special access)</Label>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                    </Button>
                    <Button onClick={handleAddProduct} className="bg-accent hover:bg-accent/90 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Create Product
                    </Button>
                </div>
                </div>
            </DialogContent>
            </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-primary" />
                    <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl">{stats.totalProducts}</p>
                    </div>
                </div>
                </Card>
                <Card className="p-6">
                <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-accent" />
                    <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl">{stats.totalSales}</p>
                    </div>
                </div>
                </Card>
                <Card className="p-6">
                <div className="flex items-center space-x-3">
                    <Zap className="w-8 h-8 text-accent" />
                    <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl">{stats.totalRevenue}</p>
                    </div>
                </div>
                </Card>
            </div>

            {/* Recent Products */}
            <Card className="p-6">
                <h3 className="text-lg mb-4">Recent Products</h3>
                <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 border border-border">
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover"
                    />
                    <div className="flex-1">
                        <h4 className="text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">{product.price}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                    </Badge>
                    </div>
                ))}
                </div>
            </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
            {/* Search and Filters */}
            <Card className="p-6">
                <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </Card>

            {/* Products Table */}
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                        <div className="flex items-center space-x-3">
                            <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover"
                            />
                            <div>
                            <p className="text-sm">{product.name}</p>
                            <div className="flex items-center space-x-2">
                                <Hash className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{product.tokenId}</span>
                                {product.isPrivate && (
                                <Shield className="w-3 h-3 text-accent" />
                                )}
                            </div>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status}
                        </Badge>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>{product.views}</TableCell>
                        <TableCell>
                        <div className="flex items-center space-x-2">
                            <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                            >
                            <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg mb-4">Sales Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Top Selling Products</h4>
                    <div className="space-y-2">
                    {products
                        .sort((a, b) => b.sales - a.sales)
                        .slice(0, 5)
                        .map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border border-border">
                            <span className="text-sm">{product.name}</span>
                            <span className="text-sm text-accent">{product.sales} sales</span>
                        </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Category Performance</h4>
                    <div className="space-y-2">
                    {['Digital Art', 'Software', 'Education'].map((category) => {
                        const categoryProducts = products.filter(p => p.category === category);
                        const totalSales = categoryProducts.reduce((sum, p) => sum + p.sales, 0);
                        return (
                        <div key={category} className="flex items-center justify-between p-3 border border-border">
                            <span className="text-sm">{category}</span>
                            <span className="text-sm text-accent">{totalSales} sales</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>
            </Card>
            </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                Update your product details and settings.
                </DialogDescription>
            </DialogHeader>
            {editingProduct && (
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                    </div>
                    <div>
                    <Label htmlFor="edit-price">Price (ETH)</Label>
                    <Input
                        id="edit-price"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                    </div>
                </div>
                <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label>Status</Label>
                    <Select
                        value={editingProduct.status}
                        onValueChange={(value) => setEditingProduct({ ...editingProduct, status: value as never })}
                    >
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input
                        id="edit-stock"
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                    checked={editingProduct.isPrivate}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, isPrivate: checked })}
                    />
                    <Label>Private Product</Label>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                    </Button>
                    <Button onClick={handleUpdateProduct} className="bg-accent hover:bg-accent/90 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Update Product
                    </Button>
                </div>
                </div>
            )}
            </DialogContent>
        </Dialog>
        </div>
    );
}