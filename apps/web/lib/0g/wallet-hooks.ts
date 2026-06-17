"use client";

import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useSwitchNetwork } from "wagmi";
import { Interface } from "ethers/lib/utils";
import { MIRROR_REGISTRY_ABI, verificationStatusToEnum } from "@/lib/contracts/MirrorRegistry";
import galileoChain from "@/lib/wallet/chains";

const registryIface = new Interface(MIRROR_REGISTRY_ABI as any);

function ensureOnGalileo(chainId?: number) {
  return chainId === galileoChain.id;
}

export function useRegisterTraceWithWallet({ registryAddress, decisionHash, traceURI, traceRoot }:{registryAddress:string, decisionHash:string, traceURI:string, traceRoot:string}){
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: registryAddress as `0x${string}`,
    abi: MIRROR_REGISTRY_ABI as any,
    functionName: 'registerDecisionTrace',
    args: [decisionHash, traceURI, traceRoot]
  } as any as any);

  const write = useContractWrite(config);
  const wait = useWaitForTransaction({ hash: write.data?.hash });

  return {
    enabled: isConnected && ensureOnGalileo(chain?.id),
    isConnected,
    wrongNetwork: isConnected && !ensureOnGalileo(chain?.id),
    write: write.write,
    data: write.data,
    isLoading: write.isLoading || wait.isLoading,
    isSuccess: wait.isSuccess,
    error: write.error ?? wait.error
  };
}

export function useUpdateStatusWithWallet({registryAddress, traceId, status}:{registryAddress:string, traceId:number, status:string}){
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const numeric = (verificationStatusToEnum as any)[status as any];
  const { config } = usePrepareContractWrite({
    address: registryAddress as `0x${string}`,
    abi: MIRROR_REGISTRY_ABI as any,
    functionName: 'updateVerificationStatus',
    args: [traceId, numeric]
  } as any as any);

  const write = useContractWrite(config);
  const wait = useWaitForTransaction({ hash: write.data?.hash });

  return {
    enabled: isConnected && ensureOnGalileo(chain?.id),
    write: write.write,
    data: write.data,
    isLoading: write.isLoading || wait.isLoading,
    isSuccess: wait.isSuccess,
    error: write.error ?? wait.error
  };
}

export function useRegisterVerdictWithWallet({registryAddress, traceIdA, traceIdB, verdictURI, verdictRoot, winningTraceId}:{registryAddress:string, traceIdA:number, traceIdB:number, verdictURI:string, verdictRoot:string, winningTraceId:number}){
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: registryAddress as `0x${string}`,
    abi: MIRROR_REGISTRY_ABI as any,
    functionName: 'registerCourtVerdict',
    args: [traceIdA, traceIdB, verdictURI, verdictRoot, winningTraceId]
  } as any as any);

  const write = useContractWrite(config);
  const wait = useWaitForTransaction({ hash: write.data?.hash });

  return {
    enabled: isConnected && ensureOnGalileo(chain?.id),
    write: write.write,
    data: write.data,
    isLoading: write.isLoading || wait.isLoading,
    isSuccess: wait.isSuccess,
    error: write.error ?? wait.error
  };
}

export default null;
