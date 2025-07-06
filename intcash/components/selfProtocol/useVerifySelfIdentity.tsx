import {
    useReadContract,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { verifyContractABI } from "@/lib/abi";
import { useWallets } from "@privy-io/react-auth";

export const useVerifySelfIdentity = () => {
    const { wallets } = useWallets();

    const walletAddress = wallets.find(wallet => wallet.address);
    
    const { data: isVerified, isLoading: isVerifying } = useReadContract({
        address: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`,
        abi: verifyContractABI,
        chainId: sepolia.id,
        functionName: "isVerified",
        args: [walletAddress ?? ""],
    });

    const {data: userData, isLoading: isUserDataLoading} = useReadContract({
        address: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS_SEPOLIA as `0x${string}`,
        abi: verifyContractABI,
        chainId: sepolia.id,
        functionName: "getUserInfo",
        args: [walletAddress ?? ""],
    });

    return {
        isVerified,
        isVerifying,
        userData,
        isUserDataLoading,
        // verifySelfIdentity: async () => {
        //     try {
        //         await writeContract();
        //     } catch (error) {
        //         console.error("Verification failed:", error);
        //     }
        // },
    };
}
