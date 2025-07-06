import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCartStore } from './contexts/store/cartStore';
import { Shield, Star, Zap, ShoppingBag, Eye, Heart, TrendingUp} from 'lucide-react';

export interface ProductCardProps {
  product: {
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
  };
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      tokenId: product.tokenId,
      isPrivate: false
    });
    
    // Create floating animation effect
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const animation = document.createElement('div');
    animation.className = 'fixed pointer-events-none z-50 text-accent';
    animation.style.left = `${rect.left + rect.width / 2}px`;
    animation.style.top = `${rect.top}px`;
    animation.innerHTML = '<div class="flex items-center space-x-1 bg-accent text-white px-2 py-1 text-xs whitespace-nowrap">Added to cart! 🛒</div>';
    
    document.body.appendChild(animation);
    
    // Animate upward and fade out
    animation.animate([
      { transform: 'translateY(0px)', opacity: 1 },
      { transform: 'translateY(-30px)', opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).onfinish = () => {
      document.body.removeChild(animation);
    };
  };

  if (viewMode === 'list') {
    return (
      <Card className="bg-card border-border overflow-hidden hover:border-accent transition-all duration-300 group cursor-pointer">
        <div>
          <div className="flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isVerified && (
                <Badge className="absolute top-2 right-2 bg-green-500 text-white border-green-500">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {product.isNew && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          <Star className="w-2 h-2 mr-1" />
                          New
                        </Badge>
                      )}
                      {product.isTrending && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <TrendingUp className="w-2 h-2 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      <span>{product.likes}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-lg text-accent">{product.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-accent text-accent hover:bg-accent hover:text-white"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </motion.div>
                    <Button 
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span>Blockchain: {product.blockchain}</span>
                  {product.tokenId && (
                    <span>Token: {product.tokenId}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span>Seller: {product.seller.slice(0, 6)}...{product.seller.slice(-4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-accent transition-all duration-300 group cursor-pointer">
      <div onSelect={(product) => {
        console.log('Selected product:', product);
      }} className="p-0">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.isVerified && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white border-green-500">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          <Badge className="absolute top-3 left-3 bg-background text-foreground border-border">
            {product.category}
          </Badge>
          
          <div className="absolute bottom-3 left-3 flex items-center space-x-1">
            {product.isNew && (
              <Badge className="bg-blue-500 text-white text-xs">
                <Star className="w-2 h-2 mr-1" />
                New
              </Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-red-500 text-white text-xs">
                <TrendingUp className="w-2 h-2 mr-1" />
                Trending
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm group-hover:text-accent transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{product.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{product.likes}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-muted-foreground">
              <span>{product.blockchain}</span>
              {product.tokenId && (
                <span> • {product.tokenId}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-accent">{product.price}</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-white text-xs px-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </motion.div>
              <Button 
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white text-xs px-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}