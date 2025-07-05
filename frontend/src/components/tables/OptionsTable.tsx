import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { format } from 'date-fns';

export interface Option {
  id: string;
  assetAddress: string;
  amount: string;
  strikePrice: string;
  premiumPrice: string;
  expiryDate: Date;
  creator: string;
  buyer?: string;
}

interface OptionsTableProps {
  options: Option[];
  title: string;
  emptyMessage: string;
  onBuy?: (id: string) => void;
  onClaim?: (id: string) => void;
}

const OptionsTable: React.FC<OptionsTableProps> = ({
  options,
  title,
  emptyMessage,
  onBuy,
  onClaim
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAction = async (id: string, actionFn?: (id: string) => void) => {
    if (!actionFn) return;
    
    setLoadingId(id);
    try {
      await actionFn(id);
    } finally {
      setLoadingId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="shadow-lg border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 border-b border-gray-100">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {options.length > 0 ? (
          <div className="overflow-x-auto">
            <motion.table 
              className="w-full" 
              variants={container}
              initial="hidden"
              animate="show"
            >
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strike</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {options.map((option) => {
                  const isExpired = new Date() > option.expiryDate;
                  const isBought = !!option.buyer;
                  const isLoading = loadingId === option.id;
                  
                  return (
                    <motion.tr 
                      key={option.id}
                      variants={item}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium">#{option.id}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatAddress(option.assetAddress)}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm">{option.amount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm">{option.strikePrice}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-purple-500 mr-1" />
                          <span className="text-sm">{option.premiumPrice}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-cyan-500 mr-1" />
                          <span className="text-sm">{format(option.expiryDate, 'dd MMM yyyy')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isExpired 
                            ? 'bg-red-100 text-red-800' 
                            : isBought
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {isExpired ? 'Expired' : isBought ? 'Bought' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        {!isBought && onBuy && !isExpired && (
                          <Button
                            onClick={() => handleAction(option.id, onBuy)}
                            disabled={isLoading}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Buy</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <span>Buy</span>
                                <ArrowRight className="h-3 w-3" />
                              </div>
                            )}
                          </Button>
                        )}
                        
                        {isBought && onClaim && !isExpired && (
                          <Button
                            onClick={() => handleAction(option.id, onClaim)}
                            disabled={isLoading}
                            variant="secondary"
                            size="sm"
                          >
                            {isLoading ? 'Processing...' : 'Claim'}
                          </Button>
                        )}
                        
                        {isExpired && (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="opacity-50 cursor-not-allowed"
                          >
                            Expired
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </motion.table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptionsTable;
