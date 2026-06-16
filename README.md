# 0G Mirror

Verifiable Decision Trails for AI Agents

- Live Demo: https://0g-mirror.vercel.app/
- GitHub Repo: https://github.com/karagozemin/0g-Mirror
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Real 0G Proof: [docs/PROOF.md](docs/PROOF.md)

0G Mirror turns AI-agent decisions into public, auditable Decision Traces. Each trace captures public evidence, model metadata, tool usage, public rationale, hashes, and verification status, then stores and attests the result on 0G.

## What is 0G Mirror?

0G Mirror is a Next.js + TypeScript monorepo for verifiable AI-agent decisions. The current MVP uses deterministic local agents, replay verification, 0G Storage, and 0G Chain.

## Problem

AI agents are making decisions, but users cannot verify what evidence, config, or output led to those decisions.

## Solution

0G Mirror turns every decision into a Decision Trace:

- stored on 0G Storage
- registered on 0G Chain
- checked through replay verification
- surfaced through a clean UI

## Live 0G Proof

Source artifact: [proofs/real-0g-proof.json](proofs/real-0g-proof.json)

| Item | Value |
| --- | --- |
| Chain ID | 16602 |
| MirrorRegistry | 0x8c5C403994CC7a5A469bBF82904e504060109858 |
| Trace ID | 1 |
| Verification Status | Verified |
| Decision Hash | 0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884 |
| 0G Storage URI | 0g://0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee |
| 0G Storage Tx | 0x109b3457bc7a0b0032b1d81bc773f8664c5dbaaa310adb46d73bdb7360757a03 |
| Register Trace Tx | 0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de |
| Verification Status Tx | 0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515 |

## How it Works

1. Agent makes a decision.
2. Mirror creates a Decision Trace.
3. Trace is stored and attested on 0G.
4. Replay verification marks it Verified, Inconsistent, or Missing Evidence.

## Olympus Arena

Olympus Arena is the live showcase mode where two agents compete, appeal, and prove their decisions using the same Mirror Core primitives. It is not a separate project; it is the agent-vs-agent proof surface built on top of 0G Mirror.

## Architecture

For the full technical breakdown, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Tech Stack

- Next.js
- TypeScript
- Solidity
- Hardhat
- ethers
- Zod
- 0G Storage SDK
- 0G Chain

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To regenerate the real proof artifact after credentials are configured, run `npm run proof:real`.

## Environment Variables

Copy [.env.example](.env.example) to `.env.local` at the repository root.

```bash
NEXT_PUBLIC_MIRROR_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_0G_CHAIN_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602
PRIVATE_KEY=...
0G_STORAGE_RPC=https://evmrpc-testnet.0g.ai
0G_STORAGE_INDEXER=https://indexer-storage-testnet-turbo.0g.ai
0G_STORAGE_PRIVATE_KEY=...
AI_PROVIDER_API_KEY=...
```

## Smart Contract

MirrorRegistry is the on-chain registry in [contracts/contracts/MirrorRegistry.sol](contracts/contracts/MirrorRegistry.sol). It registers decision traces, updates verification status, and registers court verdicts while keeping on-chain state minimal.

## Demo Flow

For a judge-ready 90-second script, see [docs/DEMO_FLOW.md](docs/DEMO_FLOW.md).

## Limitations

- The current MVP uses deterministic local agents.
- The app records public rationale and evidence, not private chain-of-thought.
- Access control is minimal.
- If 0G credentials are missing, the app falls back to clearly labeled local demo mode.
- The current MVP uses deterministic replay verification and is designed to plug into 0G Compute for verifiable execution.

## Roadmap

- 0G Compute verifier integration
- Browser wallet flow
- Trace explorer
- Multi-agent decision graph
- Verifier roles and stronger policy controls

