import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import DeFiPutOptionForm from '../components/forms/DeFiPutOptionForm';
import OptionsTable from '../components/tables/OptionsTable';
import type { Option } from '../components/tables/OptionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Données d'exemple pour simuler les options
const mockOptions: Option[] = [
  {
    id: '1',
    assetAddress: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '100',
    strikePrice: '2500',
    premiumPrice: '50',
    expiryDate: new Date('2024-12-31'),
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: '2',
    assetAddress: '0x2345678901abcdef2345678901abcdef23456789',
    amount: '200',
    strikePrice: '3000',
    premiumPrice: '75',
    expiryDate: new Date('2024-10-15'),
    creator: '0xbcdef1234567890abcdef1234567890abcdef123',
  },
  {
    id: '3',
    assetAddress: '0x3456789012abcdef3456789012abcdef34567890',
    amount: '150',
    strikePrice: '2800',
    premiumPrice: '60',
    expiryDate: new Date('2024-11-20'),
    creator: '0xcdef1234567890abcdef1234567890abcdef1234',
    buyer: '0xdef1234567890abcdef1234567890abcdef12345',
  },
  {
    id: '4',
    assetAddress: '0x4567890123abcdef4567890123abcdef45678901',
    amount: '300',
    strikePrice: '2200',
    premiumPrice: '45',
    expiryDate: new Date('2023-12-31'), // Expired
    creator: '0xdef1234567890abcdef1234567890abcdef12345',
  },
];

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Default to not connected
  const [options, setOptions] = useState<Option[]>(mockOptions);
  
  // Filtrer les options pour les différents onglets
  const availableOptions = options.filter(option => !option.buyer && new Date() <= option.expiryDate);
  const userOptions = options.filter(option => option.buyer && new Date() <= option.expiryDate);
  

  
  const handleBuyOption = async (id: string) => {
    // Simuler l'achat d'une option
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOptions(prev => prev.map(option => 
      option.id === id 
        ? { ...option, buyer: '0xYOUR_WALLET_ADDRESS' } // Normalement l'adresse du wallet connecté
        : option
    ));
    
    return Promise.resolve();
  };
  
  const handleClaimOption = async (id: string) => {
    // Simuler la réclamation d'une option
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dans un cas réel, vous pourriez vouloir supprimer l'option ou la marquer comme réclamée
    setOptions(prev => prev.filter(option => option.id !== id));
    
    return Promise.resolve();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 text-white">
      <Header 
        isWalletConnected={isWalletConnected} 
        onConnectWallet={() => {
          console.log('Connecting wallet...');
          setIsWalletConnected(true);
        }}
        walletAddress={isWalletConnected ? '0xYOUR_WALLET_ADDRESS' : ''}
        style={{ backgroundColor: '#000', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      />
      
      <main className="container mx-auto px-4 py-24 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-transparent w-full"
        >
          <DeFiPutOptionForm />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="available" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="inline-flex bg-slate-800/50 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/10" aria-label="Options Navigation">
                <TabsTrigger 
                  value="available" 
                  className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-controls="available-options-panel"
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    Available Options
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="user" 
                  className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-controls="user-options-panel"
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Your Options
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="available" className="mt-0">
              <OptionsTable
                options={availableOptions}
                title="Available Options"
                emptyMessage="No available options found. Create one using the form above!"
                onBuy={handleBuyOption}
              />
            </TabsContent>
            
            <TabsContent value="user" className="mt-0">
              <OptionsTable
                options={userOptions}
                title="Your Options"
                emptyMessage="You haven't bought any options yet."
                onClaim={handleClaimOption}
              />
            </TabsContent>
            

          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
