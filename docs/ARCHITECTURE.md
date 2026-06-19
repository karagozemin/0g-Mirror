# 0G Mirror — Architecture

Verification infrastructure for AI-agent decisions on 0G.

---

## Judge TL;DR

```mermaid
flowchart LR
    A[Agent Decision] --> B[Decision Trace]
    B --> C["User signs upload intent"]
    C --> D[0G Storage]
    B --> E["User signs attestation"]
    E --> F[MirrorRegistry]
    B --> G[Replay Verify]
    G --> F

    style C fill:#0d2137,stroke:#4cc9f0,color:#fff
    style E fill:#0d2137,stroke:#4cc9f0,color:#fff
```

| | |
| --- | --- |
| **What** | Verification layer — not an agent runtime |
| **Stored** | Public rationale + evidence trail — **not** private chain-of-thought |
| **Storage** | User signs EIP-712 → operator uploads exact artifact server-side |
| **Chain** | User wallet signs all `MirrorRegistry` writes |
| **0G** | Storage = artifacts · Chain = compact proof — both load-bearing |
| **Compute** | 0G Compute = **future**. MVP = deterministic replay |
| **Arena** | Showcase mode — not a separate product |

---

## 1. System Overview

```mermaid
flowchart TB
    subgraph UI["Next.js App"]
        direction TB
        M["Mirror Core"]
        V["Verify"]
        A["Olympus Arena"]
    end

    subgraph Core["Proof Engine"]
        direction TB
        AG["Deterministic Agents"]
        RP["Replay Verifier"]
        JD["Olympus Judge"]
    end

    subgraph Auth["Wallet Layer"]
        W["User Wallet"]
    end

    subgraph Srv["App Server"]
        API["POST /api/storage/upload"]
        OP["Storage Operator"]
    end

    subgraph ZG["0G Infrastructure"]
        STG[("0G Storage<br/>full JSON artifacts")]
        CHN[("0G Chain<br/>MirrorRegistry")]
    end

    M & A --> AG
    A --> JD
    AG --> RP
    M & A --> W
    W -->|"EIP-712 StorageUploadIntent"| API
    API --> OP --> STG
    W -->|"registerDecisionTrace<br/>updateVerificationStatus"| CHN
    RP --> W
    V --> STG & CHN

    classDef wallet fill:#0d2137,stroke:#4cc9f0,color:#fff
    classDef zeroG fill:#1a1030,stroke:#a78bfa,color:#fff
    class W wallet
    class STG,CHN zeroG
```

| Surface | Role |
| --- | --- |
| Mirror Core | Single Decision Trace → storage → chain → replay |
| Verify | Read trace by ID, inspect proof links |
| Olympus Arena | Two agents + Court Verdict on same pipeline |

---

## 2. End-to-End Proof Flow

```mermaid
flowchart TD
    START([User selects task + agent]) --> GEN["① Generate Decision Trace JSON"]
    GEN --> HASH["② Compute input / output / decision hashes"]
    HASH --> SIGN1{"③ User signs<br/>StorageUploadIntent"}
    SIGN1 --> UP["④ Storage operator uploads<br/>exact signed artifact"]
    UP --> STG["⑤ 0G Storage returns<br/>0g:// URI + root + tx"]
    STG --> SIGN2{"⑥ User signs<br/>registerDecisionTrace"}
    SIGN2 --> REG["⑦ MirrorRegistry stores<br/>hash + URI + root + creator"]
    REG --> REPLAY["⑧ Replay verifier checks<br/>public evidence consistency"]
    REPLAY --> SIGN3{"⑨ User signs<br/>updateVerificationStatus"}
    SIGN3 --> DONE([Auditable proof complete])

    style SIGN1 fill:#0d2137,stroke:#4cc9f0,color:#fff
    style SIGN2 fill:#0d2137,stroke:#4cc9f0,color:#fff
    style SIGN3 fill:#0d2137,stroke:#4cc9f0,color:#fff
    style STG fill:#1a1030,stroke:#a78bfa,color:#fff
    style REG fill:#1a1030,stroke:#a78bfa,color:#fff
    style DONE fill:#0d3320,stroke:#34d399,color:#fff
```

**Wallet-signed steps:** ③ ⑥ ⑨ — everything else is deterministic or operator-executed under user authorization.

---

## 3. Decision Trace Artifact

```mermaid
flowchart TB
    subgraph Trace["Decision Trace JSON"]
        direction TB
        META["schema · traceId · timestamps"]
        AGT["agent · model · toolsUsed"]
        TASK["task.input · task.context"]
        EV["evidence[]"]
        DEC["decision.label · output · publicRationale"]
        HASH["hashes.inputHash · outputHash · decisionHash"]
        VER["verification.status · replayResult"]
        STO["storage.uri · root · txHash"]
        ATT["attestation.traceId · txHash"]
    end

    subgraph NotStored["Explicitly NOT stored"]
        COT["Private chain-of-thought"]
    end

    EV --> REPLAY["Replay Verifier"]
    DEC --> REPLAY
    HASH --> CHAIN["MirrorRegistry on-chain"]
    STO --> OGSTG[("0G Storage")]
    ATT --> OGCHN[("0G Chain")]

    COT["Private chain-of-thought"]

    style COT fill:#3b0a0a,stroke:#f87171,color:#fff,stroke-dasharray:5
    style OGSTG fill:#1a1030,stroke:#a78bfa,color:#fff
    style OGCHN fill:#1a1030,stroke:#a78bfa,color:#fff
```

Schema: `0g-mirror/decision-trace/v1` · `apps/web/lib/schemas/decision-trace.ts`

---

## 4. Wallet-Authorized Storage Upload

```mermaid
sequenceDiagram
    autonumber
    actor U as User Wallet
    participant C as Client
    participant A as Storage API
    participant O as Storage Operator
    participant S as 0G Storage

    C->>C: hashJson(trace) → artifactHash
    C->>U: EIP-712 StorageUploadIntent
    Note right of U: schema<br/>artifactId<br/>artifactHash<br/>primaryHash<br/>nonce · expiresAt
    U->>C: signature
    C->>A: trace + intent + signature + signer
    A->>A: verifyTypedData + assertStorageIntentMatches
    A->>O: authorized artifact only
    O->>S: 0G Storage SDK upload
    S-->>C: 0g:// URI · root · storage tx
```

```mermaid
flowchart LR
    subgraph Operator["Storage Operator — honest role"]
        direction TB
        CAN["✓ Pay for upload<br/>✓ Submit exact artifact<br/>✓ Return URI + root + tx"]
        CANT["✗ Mutate JSON after signature<br/>✗ Swap evidence or rationale<br/>✗ Sign chain txs"]
    end

    subgraph Detect["Tamper detection"]
        M["artifactHash mismatch<br/>→ traceRoot / decisionHash break"]
    end

    CANT --> Detect

    style CAN fill:#0d3320,stroke:#34d399,color:#fff
    style CANT fill:#3b0a0a,stroke:#f87171,color:#fff
```

**Not a relayer.** Server-side execution for reliability; user authorization via wallet signature.  
Code: `storage-intent.ts` · `client-storage.ts` · `api/storage/upload/route.ts`

---

## 5. Wallet-Signed Chain Attestation

```mermaid
sequenceDiagram
    autonumber
    actor U as User Wallet
    participant C as Client
    participant R as MirrorRegistry
    participant V as Replay Verifier

    Note over U,R: No server key on 0G Chain

    U->>R: registerDecisionTrace(decisionHash, traceURI, traceRoot)
    R-->>C: traceId · DecisionTraceRegistered

    C->>V: verifyDecision(trace)
    V-->>C: Verified | Inconsistent | MissingEvidence

    U->>R: updateVerificationStatus(traceId, status)
    R-->>C: VerificationStatusUpdated
```

```mermaid
flowchart TB
    subgraph OnChain["MirrorRegistry — compact record"]
        direction LR
        CR["creator : address"]
        DH["decisionHash : bytes32"]
        URI["traceURI : string"]
        RT["traceRoot : bytes32"]
        ST["status : enum"]
        TS["createdAt : uint256"]
    end

    subgraph OffChain["0G Storage — full artifact"]
        JSON["Decision Trace JSON<br/>public rationale · evidence · replay"]
    end

    JSON -.->|URI + root| OnChain

    style OnChain fill:#1a1030,stroke:#a78bfa,color:#fff
    style OffChain fill:#0d2137,stroke:#4cc9f0,color:#fff
```

Contract: `contracts/contracts/MirrorRegistry.sol` · Galileo `0x8c5C403994CC7a5A469bBF82904e504060109858`

---

## 6. Trust Boundaries

```mermaid
flowchart TB
    subgraph V["✓ Cryptographically verified"]
        direction TB
        V1["artifactHash = signed intent = uploaded JSON"]
        V2["decisionHash + traceRoot on-chain"]
        V3["Indexer resolves 0g:// root to artifact"]
        V4["Registry txs from user wallet"]
        V5["Replay status on-chain"]
    end

    subgraph T["⚠ Explicitly trusted"]
        direction TB
        T1["Public evidence in trace"]
        T2["Contract address + RPC config"]
        T3["Deployed verifier + agent code"]
        T4["Operator submits authorized upload"]
    end

    subgraph X["✗ Not claimed"]
        direction TB
        X1["Private chain-of-thought"]
        X2["External ground truth"]
        X3["0G Compute execution"]
        X4["Fully decentralized upload path"]
    end

    V --- T --- X
```

---

## 7. Replay Verification

```mermaid
flowchart TD
    IN([Load Decision Trace]) --> EVD{Required evidence<br/>present?}
    EVD -->|no| ME["MissingEvidence"]
    EVD -->|yes| RPL["Re-run deterministic agent<br/>with public evidence"]
    RPL --> CMP{expected label<br/>== recorded label?}
    CMP -->|yes| OK["Verified"]
    CMP -->|no| BAD["Inconsistent"]
    ME & OK & BAD --> CHN["User wallet signs<br/>updateVerificationStatus"]

    style OK fill:#0d3320,stroke:#34d399,color:#fff
    style BAD fill:#3b0a0a,stroke:#f87171,color:#fff
    style ME fill:#3b2f0a,stroke:#fbbf24,color:#fff
    style CHN fill:#0d2137,stroke:#4cc9f0,color:#fff
```

**MVP:** deterministic replay · **Future:** 0G Compute — not implemented, not claimed.  
Code: `apps/web/lib/ai/verifier.ts`

---

## 8. Olympus Arena (Showcase)

```mermaid
flowchart TB
    CH["Shared Challenge"] --> AG1["Aegis Agent"]
    CH --> AG2["Nyx Agent"]
    AG1 --> T1["Decision Trace A"]
    AG2 --> T2["Decision Trace B"]

    T1 --> P1["Wallet auth storage<br/>+ chain attestation"]
    T2 --> P2["Wallet auth storage<br/>+ chain attestation"]

    P1 --> R1["Replay verify A"]
    P2 --> R2["Replay verify B"]

    R1 & R2 --> AP["Appeal to Olympus"]
    AP --> JG["Olympus Judge"]
    JG --> CV["Court Verdict artifact"]
    CV --> PV["Same proof pipeline"]
    PV --> CARD["Court Verdict Card"]

    style P1 fill:#0d2137,stroke:#4cc9f0,color:#fff
    style P2 fill:#0d2137,stroke:#4cc9f0,color:#fff
    style PV fill:#0d2137,stroke:#4cc9f0,color:#fff
```

Showcase mode on the same infrastructure — not a separate product.  
Schema: `0g-mirror/court-verdict/v1`

---

## 9. 0G Data Split

```mermaid
flowchart LR
    subgraph Storage["0G Storage"]
        direction TB
        F1["Decision Trace JSON"]
        F2["Court Verdict JSON"]
        U1["0g:// content-addressed URI"]
    end

    subgraph Chain["0G Chain · MirrorRegistry"]
        direction TB
        C1["decisionHash · traceRoot"]
        C2["traceURI · creator · status"]
        C3["verdictRoot · winningTraceId"]
        C4["events for indexing"]
    end

    F1 & F2 --> U1
    U1 -->|"referenced by"| C2

    style Storage fill:#1a1030,stroke:#a78bfa,color:#fff
    style Chain fill:#0d2137,stroke:#4cc9f0,color:#fff
```

---

## 10. MVP vs Future

```mermaid
flowchart LR
    subgraph MVP["MVP — now"]
        M1["Deterministic agents"]
        M2["Wallet-authorized storage"]
        M3["Wallet-signed attestation"]
        M4["Deterministic replay"]
        M5["Olympus Arena showcase"]
    end

    subgraph FUT["Future"]
        F1["0G Compute execution"]
        F2["External model adapters"]
        F3["Public Trace Explorer"]
        F4["Verifier role registry"]
    end

    MVP --> FUT

    style MVP fill:#0d2137,stroke:#4cc9f0,color:#fff
    style FUT fill:#1a1030,stroke:#a78bfa,color:#fff
```

---

## Live Proof (Galileo · chainId 16602)

| | |
| --- | --- |
| MirrorRegistry | [`0x8c5C…09858`](https://chainscan-galileo.0g.ai/address/0x8c5C403994CC7a5A469bBF82904e504060109858) |
| Trace | `#1` · `Verified` |
| Decision Hash | `0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884` |
| Artifact | [`0g://…ef4aee`](https://indexer-storage-testnet-turbo.0g.ai/file?root=0xe58925c613298780175066ae3e2762e6154b152329a3b3c8b532716196ef4aee) |
| Txs | [Storage](https://chainscan-galileo.0g.ai/tx/0x109b3457bc7a0b0032b1d81bc773f8664c5dbaaa310adb46d73bdb7360757a03) · [Register](https://chainscan-galileo.0g.ai/tx/0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1c996a76e45137f3b23de) · [Verify](https://chainscan-galileo.0g.ai/tx/0x7061af685a1c61e3db2ee976034baad35da506b73464a737dace23027eae2515) |

Files: `proofs/real-0g-proof.json` · `proofs/downloaded-real-trace.json`
