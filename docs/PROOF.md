# Real 0G Proof

This document is the judge-friendly reference for the real end-to-end proof artifact in [proofs/real-0g-proof.json](../proofs/real-0g-proof.json).

## Real proof table

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

## What each hash / tx means

- Decision Hash: stable hash of the recorded Decision Trace.
- 0G Storage URI: stored trace location.
- 0G Storage Tx: transaction proving the trace upload to 0G Storage.
- Register Trace Tx: transaction proving on-chain trace registration.
- Verification Status Tx: transaction proving the on-chain status update to Verified.
- Trace ID: the on-chain identifier assigned by MirrorRegistry.

## How to reproduce with npm run proof:real

1. Install dependencies.
2. Copy [.env.example](../.env.example) to `.env.local` at the repository root.
3. Fill in the 0G Chain, 0G Storage, and private key values.
4. Run `npm run proof:real`.
5. Confirm that [proofs/real-0g-proof.json](../proofs/real-0g-proof.json) matches the values in the table above.

The proof script builds a deterministic Decision Trace, uploads it to 0G Storage, registers the trace on 0G Chain, and updates the verification status to Verified.

## How to verify from storage

1. Download the trace JSON from the `0g://` URI.
2. Confirm the downloaded trace contents match the recorded public evidence, agent, task, and decision fields.
3. Confirm the trace's `hashes.decisionHash` equals the proof's Decision Hash.
4. Confirm the storage root in the JSON matches the `0g://` URI suffix.

The repository's storage adapter performs the same download path through the 0G Storage SDK, so the proof can be checked against the stored payload rather than only against screenshots.

## How to verify from contract

1. Read the trace record from MirrorRegistry at the address in the proof table.
2. Confirm the stored `traceURI` matches the 0G Storage URI.
3. Confirm the stored `traceRoot` matches the 0G Storage root.
4. Confirm the status is `Verified`.
5. Confirm the on-chain trace ID is `1`.

The contract stores only the minimal on-chain record; the proof of registration is the combination of the stored fields and the emitted transaction hashes.

## What is proven

- A Decision Trace was uploaded to 0G Storage.
- The trace root and decision hash were registered on 0G Chain.
- The verification status was updated to Verified.
- The downloaded trace matches the expected decision hash.

## What is not proven

- Private chain-of-thought.
- Full production-grade oracle security.
- Fully decentralized compute execution unless that is explicitly implemented.
- Anything not directly supported by the repository artifact, contract state, or stored trace.
