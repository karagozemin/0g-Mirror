"use client";

import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseEventLogs, type Hash, type TransactionReceipt } from "viem";
import { wagmiConfig } from "@/lib/wallet/wagmi";
import galileoChain from "@/lib/wallet/chains";
import { MIRROR_REGISTRY_ABI, verificationStatusToEnum } from "@/lib/contracts/MirrorRegistry";
import type { VerificationStatus } from "@/lib/schemas/decision-trace";
import { ensureGalileoChain, getRegistryAddress } from "@/lib/wallet/require";
import { MULTICALL3_ABI, MULTICALL3_ADDRESS, encodeRegistryCall } from "@/lib/wallet/multicall";

type RegistryTxResult = { traceId: number; txHash: string };
const RECEIPT_TIMEOUT_MS = 180_000;
const RECEIPT_ATTEMPT_TIMEOUT_MS = 30_000;
const RECEIPT_POLLING_INTERVAL_MS = 2_000;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitFor0GReceipt(hash: Hash): Promise<TransactionReceipt> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < RECEIPT_TIMEOUT_MS) {
    try {
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: galileoChain.id,
        timeout: RECEIPT_ATTEMPT_TIMEOUT_MS,
        pollingInterval: RECEIPT_POLLING_INTERVAL_MS
      });

      if (receipt.status === "reverted") {
        throw new Error(`Transaction ${hash} reverted on-chain.`);
      }

      return receipt;
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("reverted")) {
        throw error;
      }
      await sleep(RECEIPT_POLLING_INTERVAL_MS);
    }
  }

  throw new Error(
    `Transaction ${hash} was submitted, but 0G RPC did not return a receipt yet. Check the transaction in the explorer and refresh the app after it is indexed.`
  );
}

async function registerSingleTraceOnWallet(entry: {
  decisionHash: string;
  traceURI: string;
  traceRoot: string;
}): Promise<RegistryTxResult> {
  const registryAddress = getRegistryAddress();
  const hash = await writeContract(wagmiConfig, {
    address: registryAddress,
    abi: MIRROR_REGISTRY_ABI,
    functionName: "registerDecisionTrace",
    args: [entry.decisionHash as `0x${string}`, entry.traceURI, entry.traceRoot as `0x${string}`],
    chainId: galileoChain.id
  });
  const receipt = await waitFor0GReceipt(hash);
  const events = parseEventLogs({
    abi: MIRROR_REGISTRY_ABI,
    logs: receipt.logs,
    eventName: "DecisionTraceRegistered"
  });
  if (!events[0]) {
    throw new Error("Registry did not emit DecisionTraceRegistered.");
  }
  return { traceId: Number(events[0].args.traceId), txHash: receipt.transactionHash };
}

async function updateSingleVerificationStatusOnWallet(entry: {
  traceId: number;
  status: VerificationStatus;
}) {
  const registryAddress = getRegistryAddress();
  const hash = await writeContract(wagmiConfig, {
    address: registryAddress,
    abi: MIRROR_REGISTRY_ABI,
    functionName: "updateVerificationStatus",
    args: [BigInt(entry.traceId), verificationStatusToEnum[entry.status]],
    chainId: galileoChain.id
  });
  await waitFor0GReceipt(hash);
}

export async function registerDecisionTraceOnWallet(params: {
  decisionHash: string;
  traceURI: string;
  traceRoot: string;
}): Promise<RegistryTxResult> {
  const [result] = await batchRegisterDecisionTracesOnWallet([params]);
  if (!result) {
    throw new Error("Registry did not return a trace ID.");
  }
  return result;
}

export async function batchRegisterDecisionTracesOnWallet(
  entries: Array<{ decisionHash: string; traceURI: string; traceRoot: string }>
): Promise<RegistryTxResult[]> {
  if (entries.length === 0) return [];

  await ensureGalileoChain();
  const registryAddress = getRegistryAddress();

  if (entries.length === 1) {
    return [await registerSingleTraceOnWallet(entries[0]!)];
  }

  let batchHash: Hash;
  try {
    batchHash = await writeContract(wagmiConfig, {
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: "aggregate3",
      args: [
        entries.map((entry) => ({
          target: registryAddress,
          allowFailure: false,
          callData: encodeRegistryCall({
            functionName: "registerDecisionTrace",
            args: [entry.decisionHash as `0x${string}`, entry.traceURI, entry.traceRoot as `0x${string}`]
          })
        }))
      ],
      chainId: galileoChain.id
    });
  } catch {
    const results: RegistryTxResult[] = [];
    for (const entry of entries) {
      results.push(await registerSingleTraceOnWallet(entry));
    }
    return results;
  }

  const receipt = await waitFor0GReceipt(batchHash);
  const events = parseEventLogs({
    abi: MIRROR_REGISTRY_ABI,
    logs: receipt.logs,
    eventName: "DecisionTraceRegistered"
  });
  if (events.length !== entries.length) {
    throw new Error("Batch registration did not emit the expected trace events.");
  }
  return events.map((event) => ({
    traceId: Number(event.args.traceId),
    txHash: receipt.transactionHash
  }));
}

export async function updateVerificationStatusOnWallet(params: { traceId: number; status: VerificationStatus }) {
  await batchUpdateVerificationStatusOnWallet([params]);
}

export async function batchUpdateVerificationStatusOnWallet(
  entries: Array<{ traceId: number; status: VerificationStatus }>
) {
  if (entries.length === 0) return;

  await ensureGalileoChain();
  const registryAddress = getRegistryAddress();

  if (entries.length === 1) {
    await updateSingleVerificationStatusOnWallet(entries[0]!);
    return;
  }

  let batchHash: Hash;
  try {
    batchHash = await writeContract(wagmiConfig, {
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: "aggregate3",
      args: [
        entries.map((entry) => ({
          target: registryAddress,
          allowFailure: false,
          callData: encodeRegistryCall({
            functionName: "updateVerificationStatus",
            args: [BigInt(entry.traceId), verificationStatusToEnum[entry.status]]
          })
        }))
      ],
      chainId: galileoChain.id
    });
  } catch {
    for (const entry of entries) {
      await updateSingleVerificationStatusOnWallet(entry);
    }
    return;
  }

  await waitFor0GReceipt(batchHash);
}

export async function registerCourtVerdictOnWallet(params: {
  traceIdA: number;
  traceIdB: number;
  verdictURI: string;
  verdictRoot: string;
  winningTraceId: number;
}) {
  await ensureGalileoChain();
  const registryAddress = getRegistryAddress();

  const hash = await writeContract(wagmiConfig, {
    address: registryAddress,
    abi: MIRROR_REGISTRY_ABI,
    functionName: "registerCourtVerdict",
    args: [
      BigInt(params.traceIdA),
      BigInt(params.traceIdB),
      params.verdictURI,
      params.verdictRoot as `0x${string}`,
      BigInt(params.winningTraceId)
    ],
    chainId: galileoChain.id
  });

  const receipt = await waitFor0GReceipt(hash);
  const events = parseEventLogs({
    abi: MIRROR_REGISTRY_ABI,
    logs: receipt.logs,
    eventName: "CourtVerdictRegistered"
  });

  if (!events[0]) {
    throw new Error("Registry did not emit CourtVerdictRegistered.");
  }

  return {
    verdictId: Number(events[0].args.verdictId),
    txHash: receipt.transactionHash
  };
}
