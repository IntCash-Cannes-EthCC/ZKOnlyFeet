// // contexts/IntMaxClientContext.tsx
// 'use client'

// import React, { createContext, useContext, ReactNode } from 'react'
// import { useIntMaxClient } from '../hooks/useIntmaxClient'

// const IntMaxClientContext = createContext<ReturnType<typeof useIntMaxClient> | null>(null)

// export const IntMaxClientProvider = ({ children }: { children: ReactNode }) => {
//     const value = useIntMaxClient()
//     return (
//         <IntMaxClientContext.Provider value={value}>
//             {children}
//         </IntMaxClientContext.Provider>
//     )
// }

// export const useIntMaxClientContext = () => {
//     const context = useContext(IntMaxClientContext)
//     if (!context) {
//         throw new Error('useIntMaxClientContext must be used within an IntMaxClientProvider')
//     }
//     return context
// }
