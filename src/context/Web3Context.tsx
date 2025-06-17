import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';

const injected = new InjectedConnector({
    supportedChainIds: [1337, 1, 3, 4, 5, 42],
});

function getLibrary(provider: any): Web3Provider {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

interface Web3ContextType {
    account: string | null;
    chainId: number | null;
    library: Web3Provider | null;
    activate: () => Promise<void>;
    deactivate: () => void;
    active: boolean;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    chainId: null,
    library: null,
    activate: async () => { },
    deactivate: () => { },
    active: false,
});

export function Web3ProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ContextProvider>{children}</Web3ContextProvider>
        </Web3ReactProvider>
    );
}

function Web3ContextProvider({ children }: { children: React.ReactNode }) {
    const { active, account, library, chainId, activate, deactivate } = useWeb3React<Web3Provider>();

    const connect = async () => {
        try {
            await activate(injected);
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    };

    const disconnect = () => {
        try {
            deactivate();
        } catch (error) {
            console.error('Error disconnecting from wallet:', error);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                account: account || null,
                chainId: chainId || null,
                library: library || null,
                activate: connect,
                deactivate: disconnect,
                active,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
} 