"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import type { MotionProps } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
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

import { useOptionContract, useUSDCApproval } from '../../hooks/useOptionContract';
import { useAccount } from 'wagmi';

const DeFiPutOptionForm: React.FC = () => {
  const { address: userAddress } = useAccount();
  const [formData, setFormData] = useState<PutOptionFormData>({
    assetAddress: '0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e',
    amount: '0.1',
    strikePrice: '0.2',
    premiumPrice: '0.1',
    expirationDate: '2025-07-09'
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
  
  const { createPutOption, usdcAddress, hash } = useOptionContract();
  const { approveUSDC, allowance, refetchAllowance } = useUSDCApproval(usdcAddress, userAddress);
  const [currentStep, setCurrentStep] = useState<'checking' | 'ready' | 'approving' | 'creating' | 'done'>('checking');

  // Vérifier l'allowance au démarrage
  useEffect(() => {
    const checkAllowance = async () => {
      if (!userAddress || !usdcAddress) {
        setCurrentStep('ready');
        return;
      }
      
      setCurrentStep('checking');
      try {
        await refetchAllowance();
        const requiredAmount = parseFloat(formData.amount) * parseFloat(formData.strikePrice);
        const currentAllowance = parseFloat(allowance);
        
        console.log('[DeFiPutOptionForm] Allowance actuelle:', currentAllowance, 'USDC');
        console.log('[DeFiPutOptionForm] Montant requis:', requiredAmount, 'USDC');
        
        setCurrentStep('ready');
      } catch (error) {
        console.error('[DeFiPutOptionForm] Erreur lors de la vérification de l\'allowance:', error);
        setCurrentStep('ready');
      }
    };
    
    checkAllowance();
  }, [userAddress, usdcAddress, allowance, formData.amount, formData.strikePrice, refetchAllowance]);

  const handleInputChange = (field: keyof PutOptionFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOption = async (): Promise<void> => {
    if (!userAddress) {
      alert('Veuillez connecter votre portefeuille');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('=== DÉBUT TRACE APPROBATION USDC ===');
      console.log('[TRACE] Adresse utilisateur:', userAddress);
      console.log('[TRACE] Adresse USDC:', usdcAddress);
      console.log('[TRACE] Adresse contrat option:', '0xC0915573ceCE1E73F5E15A0749875603fbb63746');
      console.log('[TRACE] Données formulaire:', formData);
      
      // Étape 1: Vérifier et approuver USDC si nécessaire
      // CORRECTION: Le contrat vérifie seulement si allowance >= strike (pas strike * amount)
      const requiredAmount = parseFloat(formData.strikePrice); // Seulement le strike price
      const currentAllowance = parseFloat(allowance);
      
      console.log('[TRACE] Strike price (USDC):', formData.strikePrice);
      console.log('[TRACE] Montant requis (USDC):', requiredAmount);
      console.log('[TRACE] Allowance actuelle (USDC):', currentAllowance);
      console.log('[TRACE] Allowance brute:', allowance);
      
      if (currentAllowance < requiredAmount) {
        console.log('[DeFiPutOptionForm] Approbation USDC nécessaire');
        setCurrentStep('approving');
        
        const approvalAmount = (requiredAmount * 1.1).toString(); // +10% de marge
        console.log('[DeFiPutOptionForm] Approbation USDC pour un montant de:', approvalAmount);
        
        // Lancer l'approbation et attendre qu'elle soit minée
        try {
          await approveUSDC(approvalAmount);
          console.log('[DeFiPutOptionForm] Approbation USDC envoyée');
        } catch (error) {
          console.error('[DeFiPutOptionForm] Erreur lors de l\'approbation USDC:', error);
          throw new Error('Échec de l\'approbation USDC');
        }
        
        console.log('[DeFiPutOptionForm] Transaction d\'approbation envoyée');
        console.log('[DeFiPutOptionForm] Attente de la confirmation de l\'approbation...');
        
        // Attendre que la transaction d'approbation soit confirmée
        // Vérifier l'allowance jusqu'à ce qu'elle soit mise à jour
        let attempts = 0;
        const maxAttempts = 30; // 30 tentatives max (30 secondes)
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
          
          // Forcer le refetch de l'allowance
          const { data: freshAllowance } = await refetchAllowance();
          
          // Utiliser la valeur fraîchement récupérée ou celle du state
          const currentAllowanceValue = freshAllowance ? parseFloat(freshAllowance.toString()) / 1e6 : parseFloat(allowance);
          
          console.log('[DeFiPutOptionForm] Vérification allowance:', currentAllowanceValue, 'requis:', requiredAmount, 'tentative:', attempts + 1);
          
          if (currentAllowanceValue >= requiredAmount) {
            console.log('[DeFiPutOptionForm] Approbation confirmée! Allowance:', currentAllowanceValue);
            break;
          }
          
          attempts++;
        }
        
        if (attempts >= maxAttempts) {
          throw new Error('Timeout: l\'approbation USDC n\'a pas été confirmée dans les temps');
        }
      }
      
      // Étape 2: Créer l'option (seulement après confirmation de l'approbation)
      console.log('=== DÉBUT TRACE CRÉATION OPTION ===');
      console.log('[TRACE OPTION] Création de l\'option');
      setCurrentStep('creating');
      
      const expiry = Math.floor(new Date(formData.expirationDate).getTime() / 1000);
      const params = {
        strike: formData.strikePrice,
        premium: formData.premiumPrice,
        expiry,
        asset: formData.assetAddress,
        amount: formData.amount,
        dstEids: [],
        options: '0x',
      };
      
      console.log('[TRACE OPTION] Paramètres bruts:', params);
      console.log('[TRACE OPTION] Strike (string):', formData.strikePrice);
      console.log('[TRACE OPTION] Premium (string):', formData.premiumPrice);
      console.log('[TRACE OPTION] Amount (string):', formData.amount);
      console.log('[TRACE OPTION] Asset:', formData.assetAddress);
      console.log('[TRACE OPTION] Expiry timestamp:', expiry);
      console.log('[TRACE OPTION] Date expiry:', new Date(formData.expirationDate));
      
      // Vérifier une dernière fois l'allowance avant de créer l'option
      await refetchAllowance();
      const finalAllowance = parseFloat(allowance);
      console.log('[TRACE OPTION] Allowance finale avant création:', finalAllowance);
      console.log('[TRACE OPTION] Montant requis:', requiredAmount);
      
      if (finalAllowance < requiredAmount) {
        throw new Error(`Allowance insuffisante: ${finalAllowance} < ${requiredAmount}`);
      }
      
      console.log('[TRACE OPTION] Tentative d\'appel à createPutOption avec params:', params);
      await createPutOption(params);
      
      if (hash) {
        console.log('[DeFiPutOptionForm] Transaction hash:', hash);
        alert('Option créée avec succès ! Hash : ' + hash);
        setCurrentStep('done');
      } else {
        console.log('[DeFiPutOptionForm] Pas de hash retourné après createPutOption');
        setCurrentStep('ready');
      }
      
    } catch (error) {
      console.error('[DeFiPutOptionForm] Erreur lors du placement de l\'option:', error);
      alert('[DeFiPutOptionForm] Erreur: ' + (error instanceof Error ? error.message : error));
      setCurrentStep('ready');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handlePlaceOption();
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
                <div className="flex flex-col space-y-4 mt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#f59e0b] hover:to-[#b45309] text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    disabled={isLoading || currentStep === 'checking'}
                  >
                    {currentStep === 'checking' ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking allowance...
                      </div>
                    ) : currentStep === 'approving' ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Approving USDC...
                      </div>
                    ) : currentStep === 'creating' ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating option...
                      </div>
                    ) : currentStep === 'done' ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Option placed successfully!
                      </div>
                    ) : (
                      'Place the option'
                    )}
                  </Button>
                  
                  {/* Information sur l'état */}
                  <div className="text-sm text-gray-400 text-center">
                    {currentStep === 'ready' && usdcAddress && (
                      <span>Ready to place option (Current USDC allowance: {allowance})</span>
                    )}
                    {currentStep === 'approving' && (
                      <span>Step 1/2: Approving USDC usage for the contract...</span>
                    )}
                    {currentStep === 'creating' && (
                      <span>Step 2/2: Creating the PUT option...</span>
                    )}
                    {currentStep === 'done' && (
                      <span>🎉 Your PUT option has been successfully created!</span>
                    )}
                  </div>
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
