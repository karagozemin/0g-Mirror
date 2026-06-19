# 0G Mirror

<p align="center">
  <img src="./apps/web/public/0g-mirror-logo.png" alt="0G Mirror logo" width="180" />
</p>

**Verifiable Decision Trails for AI Agents**

[Live Demo](https://0g-mirror.vercel.app/) | [GitHub Repo](https://github.com/karagozemin/0g-mirror) | [Architecture](./ARCHITECTURE.md)

0G Mirror records, stores, replays, and attests AI-agent decisions on 0G, so anyone can verify why an agent acted and whether the decision is consistent with its public evidence.

> We did not build another AI agent app. We built the mirror that proves what agents decided.

## What It Is

AI agents are beginning to make decisions with real money, user trust, and real consequences. Today, users often cannot prove what context an agent used, which evidence was present, which model/config/tool path produced the decision, or whether the output is consistent with the public evidence.

0G Mirror solves this with a **Decision Trace**: a public, structured, replayable artifact containing the task input, public context, evidence, model metadata, selected tools, agent output, public rationale, hashes, 0G Storage URI/root, replay verification result, and on-chain attestation.

0G Mirror does **not** claim to expose private model chain-of-thought. It records decision traces, not hidden chain-of-thought.

## Core Flow

```txt
Create Decision Trace
        |
User signs exact storage intent
        |
Storage operator uploads signed artifact to 0G Storage
        |
User signs MirrorRegistry attestation on 0G Chain
        |
Replay verifier updates status
```

The result is a proof trail that is:

- **Stored on 0G** as a content-addressed artifact.
- **Verified by replay** against public evidence.
- **Attested on-chain** through `MirrorRegistry`.

## Live 0G Proof

This repository includes a real end-to-end proof on 0G Galileo.

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

Canonical proof files:

- `proofs/real-0g-proof.json`
- `proofs/downloaded-real-trace.json`

## Olympus Arena

Olympus Arena is the live showcase: agents compete, appeal, and prove their decisions.

It runs two deterministic agents on the same challenge, records both Decision Traces, verifies both traces, and produces an Olympus Court Verdict. The verdict is also a wallet-authorized artifact that can be stored on 0G Storage and attested on 0G Chain.

Olympus Arena is not a separate product. It is the demo mode that proves why 0G Mirror matters.

## Why 0G Is Core

0G Mirror uses 0G for real work:

- **0G Storage** stores Decision Trace and Court Verdict JSON artifacts.
- **0G Chain** stores trace/verdict hashes, roots, URIs, status, and attestation events.
- **Wallet-native attestations** keep chain writes under the user's wallet.
- **Wallet-signed storage intents** prevent the storage operator from mutating artifacts before upload.

This is not a logo integration. The proof path depends on 0G Storage and 0G Chain.

## Architecture

Read the full technical architecture here:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

The architecture document covers:

- wallet-signed storage intent
- server-side 0G Storage upload
- wallet-signed chain attestation
- `MirrorRegistry`
- Decision Trace schema
- Court Verdict schema
- replay verification
- trust boundaries
- real proof verification

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- RainbowKit, wagmi, viem, ethers
- Zod
- Solidity
- Hardhat
- 0G Storage TypeScript SDK
- 0G Galileo testnet

## Repository

```txt
apps/web
  app/                  Next.js routes
  components/           Mirror, Arena, shared UI
  lib/ai                deterministic agents, judge, verifier
  lib/0g                storage, explorer, storage intent
  lib/wallet            wallet-native chain actions
  lib/schemas           Decision Trace and Court Verdict schemas

contracts
  contracts             MirrorRegistry.sol
  scripts               deploy script
  test                  Hardhat tests

proofs                  real 0G proof artifacts
docs/screenshots        demo screenshots
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build and verify:

```bash
npm run compile
npm run test
npm run typecheck --workspace apps/web
npm run build
```

## Environment

Copy the example file:

```bash
cp .env.example .env.local
```

Client variables:

```env
NEXT_PUBLIC_0G_CHAIN_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602
NEXT_PUBLIC_MIRROR_REGISTRY_ADDRESS=0x8c5C403994CC7a5A469bBF82904e504060109858
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

Server storage operator variables:

```env
OG_STORAGE_RPC=https://evmrpc-testnet.0g.ai
OG_STORAGE_INDEXER=https://indexer-storage-testnet-turbo.0g.ai
OG_STORAGE_PRIVATE_KEY=
```

`OG_STORAGE_PRIVATE_KEY` is used only for 0G Storage uploads after the user signs the exact artifact intent. It is not used for 0G Chain writes.

Do not commit `.env.local`.

## Smart Contract

`MirrorRegistry` stores compact attestations:

- decision hash
- trace URI
- trace root
- verification status
- verdict URI/root
- winning trace ID
- creator
- timestamps
- emitted events

Large JSON artifacts stay on 0G Storage.

## 90-Second Demo Flow

1. Open the landing page and point to Live 0G Proof.
2. Explain that agent decisions need auditable public evidence trails.
3. Open Mirror Core and generate a Decision Trace.
4. Show evidence, public rationale, and decision hash.
5. Sign storage intent and store the trace on 0G Storage.
6. Register the trace on-chain with the connected wallet.
7. Replay verify and show `Verified`.
8. Enter Olympus Arena.
9. Run Aegis vs Nyx.
10. Appeal to Olympus and show the Court Verdict Card.

Closing line:

> 0G Mirror is not another agent app. It is the verification layer that makes agent decisions auditable on 0G.

## Current MVP

- Deterministic local agents for stable demos.
- Decision Trace generation.
- Court Verdict generation.
- Wallet-signed storage authorization.
- Real 0G Storage upload.
- Real 0G Chain registry.
- Replay verification.
- Clickable explorer links.
- Olympus Arena showcase.

## Limitations

- Current verification is deterministic replay, not yet 0G Compute-backed execution.
- The system verifies consistency with submitted public evidence, not external truth.
- It does not expose private chain-of-thought.
- Access control is intentionally minimal for hackathon scope.

## Roadmap

- 0G Compute-backed verifiable execution.
- Public Trace Explorer.
- Multi-agent decision graphs.
- Verifier role registry.
- Optional external model/provider adapters.
