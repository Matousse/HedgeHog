"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "relative inline-flex overflow-hidden bg-white dark:bg-black",
        className,
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
      </span>
    </MotionComponent>
  );
}

interface PutOptionFormData {
  assetAddress: string;
  amount: string;
  strikePrice: string;
  premiumPrice: string;
  expirationDate: string;
}

interface PutOptionFormProps {
  onSubmit?: (data: PutOptionFormData) => Promise<void>;
  isWalletConnected?: boolean;
}

const PutOptionForm: React.FC<PutOptionFormProps> = ({
  onSubmit,
  isWalletConnected = false
}) => {
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

  const handleInputChange = (field: keyof PutOptionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      alert("Veuillez connecter votre portefeuille pour créer une option.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call if no onSubmit provided
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Creating put option with data:', formData);
      }
    } catch (error) {
      console.error('Error creating put option:', error);
      alert('Une erreur est survenue lors de la création de l\'option.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 animate-pulse"></div>
          
          <div className="relative z-10 p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">
                Créer une Option{' '}
                <GradientText className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Put
                </GradientText>
              </h1>
              <p className="text-muted-foreground">
                Configurez votre contrat d'option put décentralisée
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Asset Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="assetAddress" className="flex items-center gap-2 text-sm font-medium">
                  <Wallet className="h-4 w-4 text-cyan-500" />
                  Adresse de l'actif
                </Label>
                <Input
                  id="assetAddress"
                  type="text"
                  value={formData.assetAddress}
                  onChange={(e) => handleInputChange('assetAddress', e.target.value)}
                  placeholder="0x..."
                  className="bg-white/50 dark:bg-slate-700/50 border-cyan-200 dark:border-cyan-700 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                />
              </motion.div>

              {/* Amount and Strike Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Montant
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="100"
                    className="bg-white/50 dark:bg-slate-700/50 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="strikePrice" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    Prix d'exercice
                  </Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    value={formData.strikePrice}
                    onChange={(e) => handleInputChange('strikePrice', e.target.value)}
                    placeholder="2500"
                    className="bg-white/50 dark:bg-slate-700/50 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
                  className="space-y-2"
                >
                  <Label htmlFor="premiumPrice" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-cyan-500" />
                    Prix de la prime
                  </Label>
                  <Input
                    id="premiumPrice"
                    type="number"
                    value={formData.premiumPrice}
                    onChange={(e) => handleInputChange('premiumPrice', e.target.value)}
                    placeholder="50"
                    className="bg-white/50 dark:bg-slate-700/50 border-cyan-200 dark:border-cyan-700 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="expirationDate" className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Date d'expiration
                  </Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                    className="bg-white/50 dark:bg-slate-700/50 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={isLoading || !isWalletConnected}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Création en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Créer l'option Put
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 p-4 bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg border border-cyan-200/50 dark:border-cyan-700/50"
            >
              <p className="text-sm text-muted-foreground text-center">
                💡 Une option put vous donne le droit de vendre un actif à un prix déterminé avant la date d'expiration.
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PutOptionForm;
