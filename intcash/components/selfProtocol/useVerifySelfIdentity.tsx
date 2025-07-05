import {
    useReadContract,
} from "wagmi";

export const useVerifySelfIdentity = () => {
    
    const { data: isVerified, isLoading: isVerifying } = useReadContract({
        address: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS as `0x${string}`,
        abi: [
            {
                inputs: [],
                name: "isVerified",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "view",
                type: "function",
            },
        ],
        functionName: "isVerified",
    });

    // const { writeContract, isPending: isVerifyingSelf } = useWriteContract({
    //     abi: [
    //         {
    //             inputs: [],
    //             name: "verifySelfIdentity",
    //             outputs: [],
    //             stateMutability: "nonpayable",
    //             type: "function",
    //         },
    //     ],
    //     address: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS as `0x${string}`,
    //     functionName: "verifySelfIdentity",
    // });

    return {
        isVerified,
        isVerifying,
        // verifySelfIdentity: async () => {
        //     try {
        //         await writeContract();
        //     } catch (error) {
        //         console.error("Verification failed:", error);
        //     }
        // },
    };
}
