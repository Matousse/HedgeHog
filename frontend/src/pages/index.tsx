import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import DeFiPutOptionForm from '../components/forms/DeFiPutOptionForm';
import OptionsTable from '../components/tables/OptionsTable';
import type { Option } from '../components/tables/OptionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_OPTIONS, GET_USER_OPTIONS } from '../lib/graphql';
import { useAccount } from 'wagmi';

// Fonction pour convertir les données du subgraph en format Option
const mapSubgraphToOption = (option: any): Option => ({
  id: option.id,
  assetAddress: option.underlying || '0x1234567890abcdef1234567890abcdef12345678',
  amount: '100', // À adapter selon votre schéma
  strikePrice: option.strike,
  premiumPrice: option.premium,
  expiryDate: new Date(Number(option.expiration) * 1000),
  creator: option.creator?.id || '',
  buyer: option.buyer?.id || undefined,
});

export default function Home() {
  const [options, setOptions] = useState<Option[]>([]);
  const { address } = useAccount();
  
  // Récupérer toutes les options disponibles
  const { data: availableData, loading: availableLoading, refetch: refetchAvailable } = useQuery(GET_AVAILABLE_OPTIONS, {
    fetchPolicy: 'network-only',
  });
  
  // Récupérer les options de l'utilisateur connecté
  const { loading: userLoading, refetch: refetchUserOptions } = useQuery(GET_USER_OPTIONS, {
    variables: { userAddress: address?.toLowerCase() || '' },
    skip: !address,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      // Si besoin d'utiliser les données spécifiques de l'utilisateur
      if (data?.user?.optionsCreated) {
        console.log('Options de l\'utilisateur récupérées:', data.user.optionsCreated);
      }
    },
  });
  
  // Convertir les données du subgraph en options utilisables par l'interface
  useEffect(() => {
    if (availableData?.options) {
      const mappedOptions = availableData.options.map(mapSubgraphToOption);
      setOptions(mappedOptions);
    }
  }, [availableData]);
  
  // Filtrer les options pour les différents onglets
  const availableOptions = options.filter(option => !option.buyer && new Date() <= option.expiryDate);
  const userOptions = address ? options.filter(
    option => (option.buyer === address?.toLowerCase() || option.creator === address?.toLowerCase()) && 
    new Date() <= option.expiryDate
  ) : [];
  

  
  const handleBuyOption = async (id: string) => {
    // Ici, vous devriez appeler votre smart contract pour acheter l'option
    // Exemple: await contract.buyOption(id, { value: ethers.parseEther(premiumPrice) })
    
    try {
      // Simuler l'achat d'une option pour le moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local en attendant la mise à jour du subgraph
      if (address) {
        setOptions(prev => prev.map(option => 
          option.id === id 
            ? { ...option, buyer: address.toLowerCase() } 
            : option
        ));
      }
      
      // Rafraîchir les données depuis le subgraph après la transaction
      await Promise.all([refetchAvailable(), refetchUserOptions()]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error buying option:', error);
      return Promise.reject(error);
    }
  };
  
  const handleClaimOption = async (id: string) => {
    // Ici, vous devriez appeler votre smart contract pour exercer l'option
    // Exemple: await contract.exerciseOption(id)
    
    try {
      // Simuler la réclamation d'une option pour le moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local en attendant la mise à jour du subgraph
      setOptions(prev => prev.filter(option => option.id !== id));
      
      // Rafraîchir les données depuis le subgraph après la transaction
      await Promise.all([refetchAvailable(), refetchUserOptions()]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error claiming option:', error);
      return Promise.reject(error);
    }
  };
  
  return (
    <div 
      className="min-h-screen text-white relative" 
      style={{ 
        backgroundColor: '#0a1929', 
        backgroundImage: 'url(/src/assets/logo.png)', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '60%',
        backgroundBlendMode: 'overlay',
        backgroundAttachment: 'fixed',
        opacity: 0.8
      }}
    >
      <Header 
        style={{ backgroundColor: '#000', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      />
      
      <main className="container mx-auto px-4 pt-28" style={{ paddingBottom: '6px !important' }}>
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
              <TabsList className="flex justify-center gap-6 rounded-lg bg-slate-800/50 backdrop-blur-md p-2 shadow-lg border border-white/10" aria-label="Options Navigation">
                <TabsTrigger 
                  value="available" 
                  className="flex items-center justify-center px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-slate-700/50"
                  aria-controls="available-options-panel"
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    Available Options
                  </span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="user" 
                  className="flex items-center justify-center px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-slate-700/50"
                  aria-controls="user-options-panel"
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Your Options
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="available" className="mt-4">
              {availableLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : availableOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Aucune option disponible pour le moment
                </div>
              ) : (
                <OptionsTable 
                  options={availableOptions} 
                  onBuy={handleBuyOption}
                  showBuyButton={!!address}
                />
              )}
            </TabsContent>
            <TabsContent value="user" className="mt-4">
              {!address ? (
                <div className="text-center py-8 text-gray-400">
                  Connect your wallet to see your options
                </div>
              ) : userLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : userOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Vous n'avez pas encore d'options
                </div>
              ) : (
                <OptionsTable 
                  options={userOptions} 
                  onClaim={handleClaimOption}
                  showClaimButton={true}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
