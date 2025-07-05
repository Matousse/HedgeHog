"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import '../../styles/header.css'
import type { CSSProperties } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  style?: CSSProperties;
}

const Header: React.FC<HeaderProps> = ({
  style
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Trade', href: '#trade', icon: TrendingUp },
    { label: 'Analytics', href: '#analytics', icon: TrendingUp }
  ]



  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-xl border-b border-cyan-500/20"
      style={style}
    >
      {/* Suppression du gradient qui couvrait le fond noir */}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <img 
                src="/src/assets/logo.png" 
                alt="HedgeHog Logo" 
                width={136} 
                height={136}
                style={{ width: '136px', height: '136px', objectFit: 'contain' }}
                className=""
              />

            </div>
            <span className="text-xl font-bold text-white">
              HedgeHog
            </span>
          </motion.div>

          <div className="flex items-center justify-center w-full">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center gap-24 flex-1">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center px-3 py-2 text-white hover:text-cyan-300 transition-all duration-200 font-bold tracking-wide text-lg"
                  style={{color: '#ffffff'}}
                >
                  <item.icon className="w-5 h-5" style={{marginRight: '12px'}} />
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4 ml-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <Button
                                onClick={openConnectModal}
                                className="relative overflow-hidden bg-transparent text-white border-0 px-6 py-2 rounded-xl font-medium transition-all duration-300"
                                style={{ background: 'transparent !important', backgroundColor: 'transparent !important', border: 'none !important', boxShadow: 'none !important' }}
                              >
                                <motion.div
                                  whileHover={{ x: 2 }}
                                  className="flex items-center whitespace-nowrap"
                                  style={{ gap: '12px', padding: '0 10px' }}
                                >
                                  <span className="text-lg" style={{ margin: '0 6px' }}>Connect Wallet</span>
                                </motion.div>
                              </Button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <Button onClick={openChainModal} className="bg-red-500 text-white px-4 py-2 rounded-xl">
                                Wrong network
                              </Button>
                            );
                          }

                          return (
                            <div className="flex items-center gap-3">
                              <Button
                                onClick={openChainModal}
                                className="flex items-center space-x-2 bg-transparent border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-xl"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span>{chain.name}</span>
                              </Button>

                              <Button
                                onClick={openAccountModal}
                                className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-gradient-to-r border-cyan-500/20"
                              >
                                <span className="text-sm font-medium text-foreground">
                                  {account.displayName}
                                </span>
                              </Button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-blue-500/10 hover:to-violet-500/10 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
