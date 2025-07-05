import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';

interface OptionCardProps {
  id: string;
  assetAddress: string;
  amount: string;
  strikePrice: string;
  premiumPrice: string;
  expiryDate: Date;
  creator?: string;
  buyer?: string;
  onBuy?: (id: string) => void;
  onClaim?: (id: string) => void;
  isLoading?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  id,
  assetAddress,
  amount,
  strikePrice,
  premiumPrice,
  expiryDate,
  creator,
  buyer,
  onBuy,
  onClaim,
  isLoading = false
}) => {
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isExpired = new Date() > expiryDate;
  const isBought = !!buyer;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 animate-pulse -z-10"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Option #{id}</h3>
            <p className="text-sm text-gray-500">
              Asset: {formatAddress(assetAddress)}
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isExpired 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isExpired ? 'Expired' : 'Active'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-500" />
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="font-medium">{amount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Strike Price</p>
              <p className="font-medium">{strikePrice}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Premium</p>
              <p className="font-medium">{premiumPrice}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Expires</p>
              <p className="font-medium">{format(expiryDate, 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          {creator && (
            <p className="text-xs text-gray-500 mb-2">
              Creator: {formatAddress(creator)}
            </p>
          )}
          
          {buyer && (
            <p className="text-xs text-gray-500 mb-2">
              Buyer: {formatAddress(buyer)}
            </p>
          )}
          
          <div className="mt-4">
            {!isBought && onBuy && !isExpired && (
              <Button
                onClick={() => onBuy(id)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Buy Option</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            )}
            
            {isBought && onClaim && !isExpired && (
              <Button
                onClick={() => onClaim(id)}
                disabled={isLoading}
                variant="secondary"
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Claim Option'}
              </Button>
            )}
            
            {isExpired && (
              <Button
                disabled
                variant="outline"
                className="w-full opacity-50 cursor-not-allowed"
              >
                Option Expired
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OptionCard;
