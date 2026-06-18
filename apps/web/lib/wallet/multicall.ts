import { encodeFunctionData } from "viem";
import { MIRROR_REGISTRY_ABI } from "@/lib/contracts/MirrorRegistry";

export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

export const MULTICALL3_ABI = [
  {
    type: "function",
    name: "aggregate3",
    stateMutability: "payable",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "allowFailure", type: "bool" },
          { name: "callData", type: "bytes" }
        ]
      }
    ],
    outputs: [
      {
        name: "returnData",
        type: "tuple[]",
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" }
        ]
      }
    ]
  }
] as const;

type RegistryWriteCall =
  | {
      functionName: "registerDecisionTrace";
      args: readonly [`0x${string}`, string, `0x${string}`];
    }
  | {
      functionName: "updateVerificationStatus";
      args: readonly [bigint, number];
    }
  | {
      functionName: "registerCourtVerdict";
      args: readonly [bigint, bigint, string, `0x${string}`, bigint];
    };

export function encodeRegistryCall(call: RegistryWriteCall) {
  return encodeFunctionData({
    abi: MIRROR_REGISTRY_ABI,
    functionName: call.functionName,
    args: call.args
  });
}
