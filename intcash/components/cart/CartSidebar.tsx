import React from 'react';
import { useCartStore } from '../contexts/store/cartStore';

export function CartSidebar() {
    const { isOpen, closeCart, items, total } = useCartStore();

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 w-96 h-full bg-secondary shadow-lg z-50 p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button onClick={closeCart} className="text-red-500 font-bold">X</button>
        </div>

        {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
        ) : (
            <div>
            {items.map(item => (
                <div key={item.id} className="mb-4">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.quantity} × {item.price}</div>
                </div>
            ))}
            <div className="mt-6 font-semibold text-right">Total: {total}</div>
            </div>
        )}
        </div>
    );
}
