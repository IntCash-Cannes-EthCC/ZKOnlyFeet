import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../contexts/store/cartStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { 
    ArrowLeft, 
    Shield, 
    Wallet, 
    CheckCircle, 
    AlertCircle, 
    Clock,
    Zap,
    Lock,
    Globe,
    Loader2,
    Receipt,
    Download,
    Copy,
    ExternalLink
} from 'lucide-react';

interface CartCheckoutProps {
    onBack: () => void;
    isWalletConnected: boolean;
    walletAddress: string;
    onConnectWallet: () => void;
}

type CheckoutStep = 'review' | 'payment' | 'processing' | 'success' | 'error';

export function CartCheckout({ 
  onBack, 
  isWalletConnected, 
  walletAddress, 
  onConnectWallet 
}: CartCheckoutProps) {
  const { items, total, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const steps = [
    { id: 'review', label: 'Review Order', icon: Receipt },
    { id: 'payment', label: 'Payment', icon: Wallet },
    { id: 'processing', label: 'Processing', icon: Clock },
    { id: 'success', label: 'Complete', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Simulate processing steps
  useEffect(() => {
    if (currentStep === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTransactionHash('0x1234567890abcdef1234567890abcdef12345678');
            setCurrentStep('success');
            toast.success('Payment successful!');
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handlePayment = async () => {
    if (!isWalletConnected) {
      onConnectWallet();
      return;
    }

    setCurrentStep('payment');
    toast.info('Preparing payment...');
    
    // Simulate payment delay with error handling
    setTimeout(() => {
      // Simulate occasional failures (10% chance)
      if (Math.random() < 0.1) {
        setError('Transaction failed. Please try again.');
        setCurrentStep('error');
        toast.error('Payment failed. Please try again.');
        return;
      }
      
      setCurrentStep('processing');
      setProcessingProgress(0);
      toast.info('Transaction submitted to blockchain...');
    }, 1000);
  };

  const handleRetry = () => {
    setCurrentStep('review');
    setError('');
    setProcessingProgress(0);
  };

  const handleComplete = () => {
    clearCart();
    toast.success('Order completed successfully!');
    onBack();
  };

  const copyTransactionHash = () => {
    navigator.clipboard.writeText(transactionHash);
    toast.success('Transaction hash copied to clipboard!');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl mb-2">No items to checkout</h2>
          <p className="text-muted-foreground mb-6">Your cart is empty</p>
          <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-white">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl">Checkout</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-sm text-muted-foreground">Secure Payment</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStepIndex 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentStepIndex ? 'bg-accent' : 'bg-muted-foreground'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStepIndex / (steps.length - 1)) * 100} className="h-1" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg mb-4">Order Review</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-border">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm">{item.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.tokenId && (
                              <Badge variant="outline" className="text-xs">
                                Token: {item.tokenId}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-accent">{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-accent bg-accent/10">
                      <div className="w-8 h-8 bg-accent flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">Connected Wallet</div>
                        <div className="text-xs text-muted-foreground">
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    </div>
                    
                    <div className="bg-secondary/20 p-4 rounded">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <span className="text-sm">Transaction Security</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• End-to-end encrypted payment</li>
                        <li>• Zero-knowledge proof verification</li>
                        <li>• Instant blockchain confirmation</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                    <h3 className="text-lg mb-2">Processing Payment</h3>
                    <p className="text-muted-foreground mb-6">
                      Your transaction is being processed on the blockchain
                    </p>
                    <div className="space-y-4">
                      <Progress value={processingProgress} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {processingProgress}% Complete
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Estimated time: 2-5 minutes</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your order has been processed successfully
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 p-3 bg-secondary/20 rounded">
                        <span className="text-sm">Transaction Hash:</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTransactionHash}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Explorer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card border-border p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg mb-2">Payment Failed</h3>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button
                      onClick={handleRetry}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border p-6 sticky top-24">
            <h3 className="text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>Items ({items.length})</span>
                <span>{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee</span>
                <span>~0.005 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gas Fee</span>
                <span>~0.003 ETH</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-accent text-lg">{total}</span>
              </div>
            </div>

            <div className="space-y-3">
              {currentStep === 'review' && (
                <Button
                  onClick={handlePayment}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                >
                  {isWalletConnected ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              )}

              {currentStep === 'payment' && (
                <Button
                  onClick={() => setCurrentStep('processing')}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Confirm Payment
                </Button>
              )}

              {currentStep === 'processing' && (
                <Button
                  disabled
                  className="w-full bg-accent/50 text-white cursor-not-allowed"
                  size="lg"
                >
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </Button>
              )}

              {currentStep === 'error' && (
                <Button
                  onClick={handleRetry}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
              )}

              {currentStep === 'success' && (
                <Button
                  onClick={handleComplete}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  size="lg"
                >
                  Complete Order
                </Button>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Private</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}