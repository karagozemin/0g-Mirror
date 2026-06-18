# 0G Mirror Demo

Full walkthrough: [docs/DEMO_FLOW.md](./docs/DEMO_FLOW.md)

## 90-second script

0G Mirror creates verifiable Decision Traces for AI-agent decisions. It stores the trace on 0G Storage, registers the hash and URI on 0G Chain, then verifies the decision through deterministic replay.

1. Open the landing page and point to the Live 0G Proof console.
2. Explain the problem: consequential agent decisions need public evidence trails, not hidden reasoning.
3. Open Mirror Core, select an agent, and run a decision.
4. Show the Decision Trace: input, evidence, model config, tools, public rationale, output, and decision hash.
5. Store the trace on 0G Storage and show the storage URI.
6. Register the trace on 0G Chain with the connected wallet and show the attestation transaction.
7. Run replay verification and show the `Verified` status update.
8. Open Olympus Arena and run Aegis vs Nyx on the same DeFi vault challenge.
9. Verify both traces, appeal to Olympus, and show the Court Verdict Card.
10. Close with: “0G Mirror is not another agent app. It is the verification layer that makes agent decisions auditable on 0G.”

## Real proof to show

- Live demo: https://0g-mirror.vercel.app/
- Registry: `0x8c5C403994CC7a5A469bBF82904e504060109858`
- Trace ID: `1`
- Decision hash: `0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884`
- Storage URI: `0g://0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee`
- Register tx: `0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de`
- Verification tx: `0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515`
