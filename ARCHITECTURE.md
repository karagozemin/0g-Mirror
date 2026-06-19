# 0G Mirror Architecture

0G Mirror is a verifiable decision trail system for AI agents. It records a structured Decision Trace, stores the wallet-authorized artifact on 0G Storage, verifies the decision through deterministic replay, and attests the proof on 0G Chain through `MirrorRegistry`.

0G Mirror does not record private model chain-of-thought. It records a public verification package: input, context, evidence, model metadata, tool usage, public rationale, output, hashes, replay status, storage proof, and on-chain attestation.

## Design Goal

AI agents are starting to make decisions with money, trust, and real consequences. The missing primitive is not another agent UI. It is a durable proof layer that can answer:

- What public evidence did the agent use?
- Which model/config/tool path produced the decision?
- Was the stored artifact modified after the user authorized it?
- Can the decision be replayed against the same public evidence?
- Is the verification status attested on-chain?
- Can future agents learn from verified past decisions?

0G Mirror turns those questions into an auditable flow.

```txt
User wallet signs exact trace intent
        |
Storage operator uploads signed artifact to 0G Storage
        |
User wallet signs on-chain attestation
        |
MirrorRegistry stores hash/root/URI/status
        |
Verifier replays public evidence and updates status
```

## System Surfaces

The app has one core product and one showcase mode:

- **Mirror Core**: create a Decision Trace, authorize storage, register it on-chain, and verify by replay.
- **Verify**: inspect a single trace and replay its decision status.
- **Olympus Arena**: showcase mode where two agents compete on the same challenge, both traces are verified, and an Olympus Judge emits a Court Verdict.

Olympus Arena is not a second project. It is a live demo proving why Mirror matters.

## High-Level Architecture

```txt
apps/web
  Next.js App Router UI
  deterministic agents
  replay verifier
  wallet-native chain actions
  EIP-712 storage authorization
  0G Storage API route

contracts
  MirrorRegistry.sol
  Hardhat tests
  0G Chain deployment script

0G
  0G Storage stores full JSON artifacts
  0G Chain stores compact attestations
```

## Data Flow

```txt
1. User selects an agent and task.
2. Deterministic agent emits a Decision Trace.
3. Client computes stable input/output/decision hashes.
4. Client computes the artifact hash of the exact trace JSON.
5. User signs an EIP-712 StorageUploadIntent.
6. Server verifies:
   - signer
   - schema
   - artifact ID
   - artifact hash
   - primary decision/verdict hash
   - nonce
   - expiry
7. Server uploads only the signed artifact to 0G Storage.
8. User signs registerDecisionTrace on MirrorRegistry.
9. Verifier replays the public evidence.
10. User signs updateVerificationStatus.
11. UI displays storage URI, tx hashes, trace ID, replay status, and explorer links.
```

## Trust Model

The production/demo path is:

```txt
Wallet-signed intent
  + server-side 0G Storage upload
  + wallet-signed on-chain attestation
```

This is intentional. Full browser-side 0G Storage upload is more fragile because browser SDK calls can hit CORS/runtime issues on deployed origins. Full server-side upload without user authorization is weaker because the user does not cryptographically approve the artifact. The chosen model keeps reliability and user provenance.

### What the storage operator can do

- Pay for and submit the storage upload.
- Upload the exact artifact authorized by the user's wallet.
- Return the resulting `0g://` URI, root, and storage tx hash.

### What the storage operator cannot do undetectably

- Change the Decision Trace after signature.
- Swap the evidence payload.
- Replace the agent output.
- Alter the public rationale.
- Mutate the decision hash/root without breaking verification.
- Sign the user's on-chain attestation.

If the operator uploads a different artifact, the signed artifact hash and on-chain root/hash mismatch exposes it.

## EIP-712 Storage Intent

The signed message covers the exact artifact, not a broad permission.

```txt
StorageUploadIntent
  schema: string
  artifactId: string
  artifactHash: bytes32
  primaryHash: bytes32
  nonce: string
  expiresAt: string
```

For a Decision Trace:

- `artifactHash` is the stable hash of the full trace artifact.
- `primaryHash` is `hashes.decisionHash`.

For a Court Verdict:

- `artifactHash` is the stable hash of the full verdict artifact.
- `primaryHash` is `hashes.verdictRoot`.

Relevant implementation:

- `apps/web/lib/0g/storage-intent.ts`
- `apps/web/lib/0g/client-storage.ts`
- `apps/web/app/api/storage/upload/route.ts`

## Decision Trace Schema

A Decision Trace contains:

- `schema`: versioned schema identifier.
- `traceId`: local trace identifier before chain registration.
- `agent`: name, role, version.
- `task`: title, input, public context.
- `model`: provider/model/config metadata.
- `toolsUsed`: public tools selected by the agent.
- `decision`: label, output, public rationale.
- `evidence`: public facts used for replay.
- `hashes`: input hash, output hash, decision hash.
- `verification`: status and replay result.
- `storage`: 0G URI/root/tx.
- `attestation`: chain ID, registry address, trace ID, tx hash.
- `timestamps`: creation time.

The trace is designed for auditability without exposing private reasoning.

## Court Verdict Schema

A Court Verdict contains:

- `schema`: versioned verdict identifier.
- `caseTitle`: human-readable appeal title.
- `traceA` and `traceB`: stored trace references.
- `claim`: dispute claim.
- `judge`: judge identity/version.
- `verdict`: winner, summary, reason codes, evidence coverage, verification status.
- `hashes.verdictRoot`: stable verdict artifact hash.
- `storage`: 0G URI/root/tx.
- `attestation`: verdict ID and tx hash.
- `timestamps`: creation time.

Olympus Arena uses this schema to turn an agent dispute into a shareable proof card.

## Verification Status

`MirrorRegistry` uses:

```solidity
enum VerificationStatus {
    Pending,
    Verified,
    Inconsistent,
    MissingEvidence
}
```

Replay verification returns:

- `Verified`: replay result matches the recorded decision label.
- `Inconsistent`: replay result conflicts with the recorded decision label.
- `MissingEvidence`: required public evidence is absent.

The verifier checks consistency with public evidence and deterministic rules. It does not claim external truth beyond the submitted evidence.

## Smart Contract

`contracts/contracts/MirrorRegistry.sol` stores compact attestations.

Decision Trace record:

```solidity
struct DecisionTrace {
    address creator;
    bytes32 decisionHash;
    string traceURI;
    bytes32 traceRoot;
    uint256 createdAt;
    VerificationStatus status;
}
```

Court Verdict record:

```solidity
struct CourtVerdict {
    uint256 traceIdA;
    uint256 traceIdB;
    string verdictURI;
    bytes32 verdictRoot;
    uint256 winningTraceId;
    uint256 createdAt;
}
```

Core functions:

- `registerDecisionTrace`
- `updateVerificationStatus`
- `registerCourtVerdict`
- `getDecisionTrace`
- `getCourtVerdict`

Events:

- `DecisionTraceRegistered`
- `VerificationStatusUpdated`
- `CourtVerdictRegistered`

The contract intentionally stores hashes, roots, URIs, creator, status, and IDs. Full JSON artifacts stay on 0G Storage.

## 0G Usage

0G is core infrastructure, not branding.

### 0G Storage

- Stores full Decision Trace JSON artifacts.
- Stores full Court Verdict JSON artifacts.
- Returns `0g://<root>` content-addressed URIs.
- Provides storage transaction hashes for proof.

### 0G Chain

- Stores the compact proof registry.
- Records trace hash, URI, root, creator, timestamp, and verification status.
- Records verdict URI/root and winning trace ID.
- Emits events used by the UI and demo proof.

## Real Proof Artifact

The repository includes a real end-to-end proof:

| Item | Value |
| --- | --- |
| Chain ID | `16602` |
| MirrorRegistry | [`0x8c5C403994CC7a5A469bBF82904e504060109858`](https://chainscan-galileo.0g.ai/address/0x8c5C403994CC7a5A469bBF82904e504060109858) |
| Trace ID | `1` |
| Verification Status | `Verified` |
| Decision Hash | `0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884` |
| 0G Storage URI | [`0g://0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee`](https://storagescan-galileo.0g.ai/search?q=0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee) |
| Storage Tx | [`0x109b3457bc7a0b0032b1d81bc773f8664c5dbaaa310adb46d73bdb7360757a03`](https://chainscan-galileo.0g.ai/tx/0x109b3457bc7a0b0032b1d81bc773f8664c5dbaaa310adb46d73bdb7360757a03) |
| Register Trace Tx | [`0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de`](https://chainscan-galileo.0g.ai/tx/0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de) |
| Verification Tx | [`0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515`](https://chainscan-galileo.0g.ai/tx/0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515) |

Canonical artifacts:

- `proofs/real-0g-proof.json`
- `proofs/downloaded-real-trace.json`

## Security Boundaries

Verified by the system:

- artifact hash
- decision/verdict hash
- storage URI/root
- on-chain registry transaction
- replay status
- emitted contract events

Trusted inputs:

- public evidence supplied to the trace
- deployed contract address
- configured RPC and storage endpoints
- deterministic verifier code

Not claimed:

- private model chain-of-thought
- external truth outside submitted public evidence
- production oracle security
- fully decentralized verifiable compute in the current MVP

## Operational Notes

Vercel/server env:

```env
OG_STORAGE_RPC=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER=https://indexer-storage-testnet-turbo.0g.ai
OG_STORAGE_PRIVATE_KEY=
```

Client env:

```env
NEXT_PUBLIC_0G_CHAIN_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602
NEXT_PUBLIC_MIRROR_REGISTRY_ADDRESS=0x8c5C403994CC7a5A469bBF82904e504060109858
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

No server-side private key is used for 0G Chain writes. Chain writes are signed by the connected wallet.

## Future Work

- 0G Compute-backed verifiable execution.
- Public trace explorer and indexing.
- Verifier role registry.
- Optional external model/provider adapters.
- Multi-agent decision graphs.
- Richer appeal and audit workflows.
