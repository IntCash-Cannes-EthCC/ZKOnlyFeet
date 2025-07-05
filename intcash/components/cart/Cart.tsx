import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../contexts/store/cartStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { X, Plus, Minus, ShoppingBag, Trash2, Shield } from 'lucide-react';

interface CartProps {
    onCheckout?: () => void;
}

export function Cart({ onCheckout }: CartProps) {
    const { 
        items, 
        isOpen, 
        itemCount, 
        total, 
        closeCart, 
        removeItem, 
        updateQuantity 
    } = useCartStore();

    const handleCheckout = () => {
        if (onCheckout) {
        onCheckout();
        } else {
        // This would typically navigate to checkout
        console.log('Proceeding to checkout with items:', items);
        }
        closeCart();
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCart}
                className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Cart Slideout */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5 text-accent" />
                    <h2 className="text-lg">Shopping Cart</h2>
                    {itemCount > 0 && (
                    <Badge className="bg-accent text-white">
                        {itemCount}
                    </Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeCart}
                    className="h-8 w-8 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-6">
                        Add some products to get started
                    </p>
                    <Button 
                        onClick={closeCart}
                        className="bg-accent hover:bg-accent/90 text-white"
                    >
                        Continue Shopping
                    </Button>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex items-start space-x-4 p-4 border border-border bg-card"
                        >
                            <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                            />
                            
                            <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                <h4 className="text-sm truncate">{item.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                    {item.category}
                                    </span>
                                    {item.isPrivate && (
                                    <Shield className="w-3 h-3 text-accent" />
                                    )}
                                </div>
                                </div>
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                >
                                <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-6 w-6 p-0"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm min-w-[20px] text-center">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-6 w-6 p-0"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                                </div>
                                <span className="text-sm text-accent">
                                {item.price}
                                </span>
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    </div>
                )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-lg">Total:</span>
                    <span className="text-lg text-accent">{total}</span>
                    </div>
                    
                    <div className="space-y-2">
                    <Button
                        onClick={handleCheckout}
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                        size="lg"
                    >
                        Proceed to Checkout
                    </Button>
                    <Button
                        variant="outline"
                        onClick={closeCart}
                        className="w-full"
                    >
                        Continue Shopping
                    </Button>
                    </div>
                </div>
                )}
            </motion.div>
            </>
        )}
        </AnimatePresence>
    );
}