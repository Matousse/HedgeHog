"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import type { MotionProps } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
// GradientText component removed as it's no longer used

interface PutOptionFormData {
  assetAddress: string;
  amount: string;
  strikePrice: string;
  premiumPrice: string;
  expirationDate: string;
}

const DeFiPutOptionForm: React.FC = () => {
  const [formData, setFormData] = useState<PutOptionFormData>({
    assetAddress: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '100',
    strikePrice: '2500',
    premiumPrice: '50',
    expirationDate: '2024-12-31'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Set CSS variables for gradient colors
    const root = document.documentElement;
    root.style.setProperty('--color-1', '195 100% 50%'); // Cyan
    root.style.setProperty('--color-2', '220 100% 50%'); // Blue
    root.style.setProperty('--color-3', '250 100% 50%'); // Royal Blue
    root.style.setProperty('--color-4', '270 100% 50%'); // Purple
  }, []);

  const handleInputChange = (field: keyof PutOptionFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating put option with data:', formData);
      setIsLoading(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center w-full" style={{ paddingTop: '120px', paddingBottom: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
        style={{ minHeight: '500px', flexShrink: 0, padding: '24px' }}
      >
        <div
          className="rounded-lg shadow-2xl relative overflow-hidden border-0 bg-black"
          style={{ 
            background: '#000',
            minWidth: '500px',
            margin: '40px 0',
            padding: '24px'
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
              <h1 className="text-3xl font-bold mb-2">
                Create a{' '}
                <span className="text-slate-500 font-bold">
                  Put
                </span>
                {' '}Option
              </h1>
              <p className="text-muted-foreground">
                Configure your decentralized put option contract
              </p>
            </motion.div>

            <div className="h-8"></div>

            <form onSubmit={handleSubmit} className="space-y-16 flex flex-col gap-12">

              {/* Asset Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-6"
              >
                <Label htmlFor="assetAddress" className="flex items-center gap-2 text-sm font-medium">
                  <Wallet className="h-4 w-4 text-slate-500" />
                  Asset Address
                </Label>
                <Input
                  id="assetAddress"
                  type="text"
                  value={formData.assetAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('assetAddress', e.target.value)}
                  placeholder="0x..."
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-300"
                  required
                />
              </motion.div>

              {/* Amount and Strike Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  <Label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('amount', e.target.value)}
                    placeholder="100"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  <Label htmlFor="strikePrice" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Strike Price (USD)
                  </Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    value={formData.strikePrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('strikePrice', e.target.value)}
                    placeholder="2500"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>
              </div>

              {/* Premium Price and Expiration Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-6"
                >
                  <Label htmlFor="premiumPrice" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Premium Price (USD)
                  </Label>
                  <Input
                    id="premiumPrice"
                    type="number"
                    value={formData.premiumPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('premiumPrice', e.target.value)}
                    placeholder="50"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-6"
                >
                  <Label htmlFor="expirationDate" className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Expiration Date
                  </Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('expirationDate', e.target.value)}
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="pt-8 w-full mb-6"
              >
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-12 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Create Put Option
                    </div>
                  )}
                </Button>
                </div>
              </motion.div>
            </form>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 p-6 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
            >
              <p className="text-sm text-muted-foreground text-center">
                💡 A put option gives you the right to sell an asset at a specified price before the expiration date.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
};

export default DeFiPutOptionForm;
