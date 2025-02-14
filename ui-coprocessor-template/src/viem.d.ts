declare module 'viem' {
  export function useWriteContract(options: {
    address: string;
    abi: any;
    functionName: string;
  }): {
    writeContract: (args: any) => Promise<any>;
  };
  // Add other exports as necessary
} 