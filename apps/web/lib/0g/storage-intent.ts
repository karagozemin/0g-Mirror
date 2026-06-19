import type { TypedDataDomain } from "viem";
import type { CourtVerdict } from "@/lib/schemas/court-verdict";
import type { DecisionTrace } from "@/lib/schemas/decision-trace";
import { computeDecisionHashes, hashJson } from "@/lib/utils/hash";

export type StorableArtifact = DecisionTrace | CourtVerdict;

export type StorageUploadIntent = {
  schema: string;
  artifactId: string;
  artifactHash: `0x${string}`;
  primaryHash: `0x${string}`;
  nonce: string;
  expiresAt: string;
};

export const storageIntentTypes = {
  StorageUploadIntent: [
    { name: "schema", type: "string" },
    { name: "artifactId", type: "string" },
    { name: "artifactHash", type: "bytes32" },
    { name: "primaryHash", type: "bytes32" },
    { name: "nonce", type: "string" },
    { name: "expiresAt", type: "string" }
  ]
} as const;

export function storageIntentDomain(chainId: number, registryAddress: `0x${string}`): TypedDataDomain {
  return {
    name: "0G Mirror",
    version: "1",
    chainId,
    verifyingContract: registryAddress
  };
}

export function getArtifactId(data: StorableArtifact) {
  if ("traceId" in data) return data.traceId;
  return data.caseTitle;
}

export function getPrimaryHash(data: StorableArtifact): `0x${string}` {
  if ("decision" in data) return data.hashes.decisionHash as `0x${string}`;
  return data.hashes.verdictRoot as `0x${string}`;
}

export function getArtifactHash(data: StorableArtifact): `0x${string}` {
  return hashJson(data) as `0x${string}`;
}

export function assertArtifactIntegrity(data: StorableArtifact) {
  if ("decision" in data) {
    const hashes = computeDecisionHashes(data);
    if (hashes.decisionHash.toLowerCase() !== data.hashes.decisionHash.toLowerCase()) {
      throw new Error("Decision Trace hash mismatch. Refusing to upload unsigned or mutated trace.");
    }
  }
}

export function createStorageUploadIntent(data: StorableArtifact): StorageUploadIntent {
  assertArtifactIntegrity(data);
  return {
    schema: data.schema,
    artifactId: getArtifactId(data),
    artifactHash: getArtifactHash(data),
    primaryHash: getPrimaryHash(data),
    nonce: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  };
}

export function assertStorageIntentMatches(data: StorableArtifact, intent: StorageUploadIntent) {
  assertArtifactIntegrity(data);
  if (new Date(intent.expiresAt).getTime() < Date.now()) {
    throw new Error("Storage upload authorization expired. Sign a fresh upload intent.");
  }
  if (intent.schema !== data.schema) {
    throw new Error("Storage upload intent schema does not match artifact schema.");
  }
  if (intent.artifactId !== getArtifactId(data)) {
    throw new Error("Storage upload intent artifact ID does not match payload.");
  }
  if (intent.artifactHash.toLowerCase() !== getArtifactHash(data).toLowerCase()) {
    throw new Error("Storage upload intent hash does not match payload.");
  }
  if (intent.primaryHash.toLowerCase() !== getPrimaryHash(data).toLowerCase()) {
    throw new Error("Storage upload intent primary hash does not match payload.");
  }
}
