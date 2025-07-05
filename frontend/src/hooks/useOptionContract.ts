import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { OPTION_CONTRACT_ADDRESS, OPTION_CONTRACT_ABI, ERC20_ABI } from '../lib/contracts';

export interface CreateOptionParams {
  strike: string; // Prix d'exercice en USDC
  premium: string; // Prime en USDC
  expiry: number; // Timestamp d'expiration
  asset: string; // Adresse de l'actif sous-jacent
  amount: string; // Montant de l'actif
  dstEids?: number[]; // IDs des chaînes de destination (optionnel)
  options?: string; // Options LayerZero (optionnel)
}

export function useOptionContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Lire le nombre total d'options
  const { data: optCount } = useReadContract({
    address: OPTION_CONTRACT_ADDRESS,
    abi: OPTION_CONTRACT_ABI,
    functionName: 'optCount',
  });

  // Lire l'adresse USDC
  const { data: usdcAddress } = useReadContract({
    address: OPTION_CONTRACT_ADDRESS,
    abi: OPTION_CONTRACT_ABI,
    functionName: 'usdc',
  });

  // Créer une option PUT
  const createPutOption = async (params: CreateOptionParams) => {
  console.log('[createPutOption] called with params:', params);
    const {
      strike,
      premium,
      expiry,
      asset,
      amount,
      dstEids = [],
      options = '0x'
    } = params;

    try {
      // Convertir les valeurs en wei (USDC a 6 décimales)
      const strikeWei = parseUnits(strike, 6);
      const premiumWei = parseUnits(premium, 6);
      const amountWei = parseUnits(amount, 18); // Supposons 18 décimales pour l'actif

      console.log('[createPutOption] strikeWei:', strikeWei.toString(), 'premiumWei:', premiumWei.toString(), 'amountWei:', amountWei.toString());
      console.log('[createPutOption] asset:', asset, 'expiry:', expiry, 'dstEids:', dstEids, 'options:', options);

      await writeContract({
        address: OPTION_CONTRACT_ADDRESS,
        abi: OPTION_CONTRACT_ABI,
        functionName: 'createPutOpt',
        args: [
          strikeWei,
          premiumWei,
          BigInt(expiry),
          asset as `0x${string}`,
          amountWei
        ]
      });
      console.log('[createPutOption] Transaction sent!');
    } catch (err) {
      console.error('[createPutOption] Erreur lors de la création de l\'option:', err);
      if (err instanceof Error) {
        alert('[createPutOption] Erreur: ' + err.message);
      }
      throw err;
    }
    console.log('[createPutOption] end');
  };

  // NOTE: Les fonctions suivantes sont commentées car elles ne sont pas présentes dans l'ABI du contrat déployé
  // Si ces fonctionnalités sont nécessaires, le contrat devra être mis à jour
  
  /*
  // Acheter une option - Non disponible dans le contrat actuel
  const buyOption = async (optId: number) => {
    try {
      console.warn('La fonction buyPutOpt n\'est pas disponible dans le contrat déployé');
      throw new Error('Fonction non disponible dans le contrat');
    } catch (err) {
      console.error('Erreur lors de l\'achat de l\'option:', err);
      throw err;
    }
  };

  // Supprimer une option - Non disponible dans le contrat actuel
  const deleteOption = async (optId: number) => {
    try {
      console.warn('La fonction deletePutOpt n\'est pas disponible dans le contrat déployé');
      throw new Error('Fonction non disponible dans le contrat');
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'option:', err);
      throw err;
    }
  };

  // Exercer une option - Non disponible dans le contrat actuel
  const exerciseOption = async (optId: number) => {
    try {
      console.warn('La fonction exercisePutOpt n\'est pas disponible dans le contrat déployé');
      throw new Error('Fonction non disponible dans le contrat');
    } catch (err) {
      console.error('Erreur lors de l\'exercice de l\'option:', err);
      throw err;
    }
  };
  */
  
  // Définitions des fonctions pour éviter les erreurs TypeScript
  const buyOption = async () => { throw new Error('Non implémenté'); };
  const deleteOption = async () => { throw new Error('Non implémenté'); };
  const exerciseOption = async () => { throw new Error('Non implémenté'); };

  return {
    createPutOption,
    buyOption,
    deleteOption,
    exerciseOption,
    optCount: optCount ? Number(optCount) : 0,
    usdcAddress,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// Hook pour gérer les approbations USDC
export function useUSDCApproval(usdcAddress?: string, userAddress?: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Lire l'allowance actuelle
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: (usdcAddress && userAddress) ? [
      userAddress as `0x${string}`, // Utiliser la vraie adresse utilisateur
      OPTION_CONTRACT_ADDRESS
    ] : undefined,
    query: {
      enabled: !!(usdcAddress && userAddress),
    },
  });

  // Approuver USDC
  const approveUSDC = async (amount: string) => {
    if (!usdcAddress) throw new Error('Adresse USDC non disponible');

    try {
      console.log('[TRACE APPROVE] Début approbation USDC');
      console.log('[TRACE APPROVE] Montant à approuver (string):', amount);
      
      const amountWei = parseUnits(amount, 6); // USDC a 6 décimales
      console.log('[TRACE APPROVE] Montant en wei (6 décimales):', amountWei.toString());
      console.log('[TRACE APPROVE] Adresse USDC:', usdcAddress);
      console.log('[TRACE APPROVE] Spender (contrat option):', OPTION_CONTRACT_ADDRESS);

      // Dans wagmi v2, writeContract retourne l'hash de la transaction
      const hash = await writeContract({
        address: usdcAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [OPTION_CONTRACT_ADDRESS, amountWei],
      });
      
      console.log('[TRACE APPROVE] Transaction d\'approbation envoyée, hash:', hash);
      return hash; // Retourner le hash de transaction
    } catch (err) {
      console.error('[TRACE APPROVE] Erreur lors de l\'approbation USDC:', err);
      throw err;
    }
  };

  return {
    approveUSDC,
    allowance: allowance ? formatUnits(allowance as bigint, 6) : '0',
    refetchAllowance,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
