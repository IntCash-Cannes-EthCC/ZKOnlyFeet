import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    quantity: number;
    tokenId?: string;
    isPrivate?: boolean;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    total: string;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

const calculateTotal = (items: CartItem[]): string => {
    const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(' ETH', ''));
        return sum + (price * item.quantity);
    }, 0);
    return `${total.toFixed(3)} ETH`;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
        items: [],
        isOpen: false,
        itemCount: 0,
        total: '0.000 ETH',
        
        addItem: (newItem) => {
            const { items } = get();
            const existingItem = items.find(item => item.id === newItem.id);
            
            let updatedItems;
            if (existingItem) {
            updatedItems = items.map(item =>
                item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            } else {
            updatedItems = [...items, { ...newItem, quantity: 1 }];
            }
            
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const total = calculateTotal(updatedItems);
            
            set({ items: updatedItems, itemCount, total });
        },
        
        removeItem: (id) => {
            const { items } = get();
            const updatedItems = items.filter(item => item.id !== id);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const total = calculateTotal(updatedItems);
            
            set({ items: updatedItems, itemCount, total });
        },
        
        updateQuantity: (id, quantity) => {
            if (quantity <= 0) {
            get().removeItem(id);
            return;
            }
            
            const { items } = get();
            const updatedItems = items.map(item =>
            item.id === id ? { ...item, quantity } : item
            );
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const total = calculateTotal(updatedItems);
            
            set({ items: updatedItems, itemCount, total });
        },
        
        clearCart: () => {
            set({ items: [], itemCount: 0, total: '0.000 ETH' });
        },
        
        toggleCart: () => {
            set(state => ({ isOpen: !state.isOpen }));
        },
        
        openCart: () => {
            set({ isOpen: true });
        },
        
        closeCart: () => {
            set({ isOpen: false });
        },
        }),
        {
        name: 'cart-storage',
        }
    )
);