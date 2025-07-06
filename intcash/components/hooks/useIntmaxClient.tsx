// hooks/useIntMaxClient.tsx
import { useState, useCallback, useEffect } from 'react'
import { IntMaxClient,
//     // prepare_deposit,
//     // send_tx_request,
//     // get_balances_without_sync,
} from 'intmax2-client-sdk'
// import { generate_intmax_account_from_eth_key } from '@/src/lib/intmax/wasm/intmax2_wasm_lib';
import initSync from './init';

export const useIntMaxClient = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [client, setClient] = useState<IntMaxClient | null>(null)

    const initializeClient = useCallback(async () => {
        try {
        setLoading(true)
        setError(null)
        
        const newClient = await IntMaxClient.init({ 
            environment: 'testnet'
        })
        
        setClient(newClient)
        } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize client'
        setError(errorMessage)
        console.error('IntMax Client initialization failed:', err)
        } finally {
        setLoading(false)
        }
    }, [])

    useEffect(() => {
        const run = async () => {
          // 1. wasmをfetchして初期化
        //   const res = await fetch('@/src/wasm/browser/intmax2_wasm_lib_bg.wasm?url');
            const res = await fetch('src/lib/intmax/wasm/intmax2_wasm_lib_bg.wasm?url');
          const bytes = await res.arrayBuffer();
          await initSync(bytes);
    
        };
    
        run();
        initializeClient();
      }, [initializeClient]);
      

    const login = useCallback(async () => {
        if (!client) {
        setError('Client not initialized')
        return
        }
        
        try {
        setLoading(true)
        setError(null)
        await client.login()
        setIsLoggedIn(true)
        } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed'
        setError(errorMessage)
        console.error('Login failed:', err)
        } finally {
        setLoading(false)
        }
    }, [client])

    const logout = useCallback(async () => {
        if (!client) return
        
        try {
        setLoading(true)
        await client.logout()
        setIsLoggedIn(false)
        setError(null)
        } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Logout failed'
        setError(errorMessage)
        console.error('Logout failed:', err)
        } finally {
        setLoading(false)
        }
    }, [client])

    return {
        client,
        isLoggedIn,
        loading,
        error,
        // initializeClient,
        login,
        logout,
    }
}