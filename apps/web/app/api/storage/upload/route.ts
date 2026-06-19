import { NextResponse } from "next/server";
import { verifyTypedData, type TypedDataField } from "ethers";
import { Missing0GConfigError, uploadJsonTo0G } from "@/lib/0g/storage";
import {
  assertStorageIntentMatches,
  storageIntentDomain,
  storageIntentTypes,
  type StorableArtifact,
  type StorageUploadIntent
} from "@/lib/0g/storage-intent";
import { courtVerdictSchema } from "@/lib/schemas/court-verdict";
import { decisionTraceSchema } from "@/lib/schemas/decision-trace";

export const dynamic = "force-dynamic";

function registryAddress() {
  const address = process.env.NEXT_PUBLIC_MIRROR_REGISTRY_ADDRESS;
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Missing0GConfigError("Set NEXT_PUBLIC_MIRROR_REGISTRY_ADDRESS for storage intent verification.");
  }
  return address as `0x${string}`;
}

function chainId() {
  return Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16602);
}

function parseArtifact(data: unknown): StorableArtifact {
  const trace = decisionTraceSchema.safeParse(data);
  if (trace.success) return trace.data;

  const verdict = courtVerdictSchema.safeParse(data);
  if (verdict.success) return verdict.data;

  throw new Error("Unsupported storage artifact schema.");
}

export async function POST(request: Request) {
  try {
    const { data, intent, signature, signer } = (await request.json()) as {
      data: unknown;
      intent?: StorageUploadIntent;
      signature?: string;
      signer?: string;
    };

    if (!intent || !signature || !signer) {
      return NextResponse.json(
        { code: "MISSING_SIGNATURE", error: "Sign the exact storage upload intent with your wallet before uploading." },
        { status: 401 }
      );
    }

    const artifact = parseArtifact(data);
    assertStorageIntentMatches(artifact, intent);

    const recovered = verifyTypedData(
      storageIntentDomain(chainId(), registryAddress()),
      storageIntentTypes as unknown as Record<string, TypedDataField[]>,
      intent,
      signature
    );

    if (recovered.toLowerCase() !== signer.toLowerCase()) {
      return NextResponse.json(
        { code: "INVALID_SIGNATURE", error: "Storage upload intent signature does not match the connected wallet." },
        { status: 401 }
      );
    }

    const result = await uploadJsonTo0G(artifact);
    return NextResponse.json({ mode: "0g", ...result });
  } catch (error) {
    if (error instanceof Missing0GConfigError) {
      return NextResponse.json(
        { code: "MISSING_CONFIG", error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { code: "UPLOAD_FAILED", error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
