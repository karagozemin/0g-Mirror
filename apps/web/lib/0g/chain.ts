// Server-side relayer for 0G Chain writes has been removed.
// Chain attestation must be performed by the connected user wallet in the browser.
// This file is intentionally minimal to avoid providing server-side signing endpoints.

export class MissingChainConfigError extends Error {
  constructor(message = "Server-side chain relayer is disabled. Use wallet-native attestation.") {
    super(message);
    this.name = "MissingChainConfigError";
  }
}

export async function registerDecisionTraceOnChain() {
  throw new MissingChainConfigError(
    "Server-side chain writes are disabled. Use client wallet hooks (useRegisterTraceWithWallet) to perform on-chain attestation."
  );
}

export async function updateVerificationStatusOnChain() {
  throw new MissingChainConfigError(
    "Server-side chain writes are disabled. Use client wallet hooks (useUpdateStatusWithWallet) to perform on-chain attestation."
  );
}

export async function registerCourtVerdictOnChain() {
  throw new MissingChainConfigError(
    "Server-side chain writes are disabled. Use client wallet hooks (useRegisterVerdictWithWallet) to perform on-chain attestation."
  );
}
