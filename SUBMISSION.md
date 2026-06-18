# 0G Mirror

## One-line pitch

0G Mirror records, stores, replays, and attests AI-agent decisions on 0G, so anyone can verify whether a decision is consistent with its public evidence.

## Short description

0G Mirror is a verifiable decision layer for AI agents. It records Decision Traces, stores them on 0G Storage, verifies them through deterministic replay, and attests the result on 0G Chain.

## Links

- Live demo: https://0g-mirror.vercel.app/
- GitHub repo: https://github.com/karagozemin/0g-mirror
- Real proof: [docs/PROOF.md](./docs/PROOF.md)
- Demo script: [DEMO.md](./DEMO.md)

## Long description

AI agents are beginning to make decisions with money, trust, and real consequences. Today, users often cannot verify what input, public evidence, model config, or tool path produced a decision. 0G Mirror solves this by turning each agent action into a structured Decision Trace.

A Decision Trace contains the task input, public context, evidence used, model/provider/config metadata, selected tools, agent output, public rationale, hashes, 0G Storage URI/root, replay verification result, and on-chain attestation. 0G Mirror does not claim to expose private model chain-of-thought.

Olympus Arena is the live showcase mode built on top of Mirror Core. Two agents compete on the same decision challenge, Mirror records both traces, the user verifies them, and an Olympus Judge produces a Court Verdict that can also be stored and attested.

## Real 0G proof

- Chain ID: `16602`
- MirrorRegistry: `0x8c5C403994CC7a5A469bBF82904e504060109858`
- Trace ID: `1`
- Verification status: `Verified`
- Decision hash: `0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884`
- 0G Storage URI: `0g://0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee`
- Storage tx: `0x109b3457bc7a0b0032b1d81bc773f8664c5dbaaa310adb46d73bdb7360757a03`
- Register trace tx: `0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de`
- Verification status tx: `0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515`

## What 0G does

0G Storage holds the full Decision Trace and Court Verdict JSON artifacts as content-addressed payloads. 0G Chain stores the compact proof layer through `MirrorRegistry`: decision hash, trace URI, trace root, verification status, verdict URI/root, and emitted attestation events.

This is not a decorative integration. The demo depends on 0G for durable trace storage and public on-chain attestations.

## Current MVP vs roadmap

Current MVP:

- Deterministic local agents for reliable demo behavior
- Decision Trace and Court Verdict schemas
- Real 0G Storage upload/download adapter
- Wallet-native 0G Chain attestation
- Replay verification: `Verified`, `Inconsistent`, `MissingEvidence`
- Olympus Arena showcase

Roadmap:

- 0G Compute-backed verifiable execution
- Public trace explorer and indexing
- Optional external model/provider adapters
- Verifier roles and multi-agent decision graphs

## Why this matters

AI agents should not become uninspectable decision makers. 0G Mirror gives users, protocols, and future agents a public evidence trail they can inspect, replay, and attest without exposing private chain-of-thought.
