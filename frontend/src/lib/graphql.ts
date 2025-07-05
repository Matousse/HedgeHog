import { gql } from '@apollo/client';

// Récupérer toutes les options actives d'un utilisateur
export const GET_USER_OPTIONS = gql`
  query GetUserOptions($userAddress: String!) {
    user(id: $userAddress) {
      optionsCreated(where: { isActive: true }) {
        id
        strike
        expiration
        premium
        isCall
        underlying
        createdAt
      }
    }
  }
`;

// Récupérer les options par prix d'exercice
export const GET_OPTIONS_BY_STRIKE = gql`
  query GetOptionsByStrike($minStrike: BigInt!, $maxStrike: BigInt!) {
    options(
      where: { 
        strike_gte: $minStrike, 
        strike_lte: $maxStrike,
        isActive: true 
      }
      orderBy: expiration
      orderDirection: asc
    ) {
      id
      strike
      expiration
      premium
      creator {
        id
      }
    }
  }
`;

// Récupérer toutes les options disponibles
export const GET_AVAILABLE_OPTIONS = gql`
  query GetAvailableOptions {
    options(
      where: { isActive: true }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      strike
      expiration
      premium
      isCall
      underlying
      createdAt
      creator {
        id
      }
    }
  }
`;
