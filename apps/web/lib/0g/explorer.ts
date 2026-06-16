const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16602);

const explorerBaseByChainId: Record<number, string> = {
  16602: "https://chainscan-galileo.0g.ai",
  16661: "https://chainscan.0g.ai"
};

const storageExplorerBaseByChainId: Record<number, string> = {
  16602: "https://storagescan-galileo.0g.ai",
  16661: "https://storagescan.0g.ai"
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, "");
}

function explorerBaseUrl(chainId = DEFAULT_CHAIN_ID) {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_0G_EXPLORER_URL ??
      process.env.NEXT_PUBLIC_0G_CHAIN_EXPLORER_URL ??
      explorerBaseByChainId[chainId] ??
      explorerBaseByChainId[16602]
  );
}

function storageExplorerBaseUrl(chainId = DEFAULT_CHAIN_ID) {
  return normalizeBaseUrl(storageExplorerBaseByChainId[chainId] ?? storageExplorerBaseByChainId[16602]);
}

export function chainExplorerTxUrl(txHash: string, chainId = DEFAULT_CHAIN_ID) {
  return `${explorerBaseUrl(chainId)}/tx/${txHash}`;
}

export function chainExplorerAddressUrl(address: string, chainId = DEFAULT_CHAIN_ID) {
  return `${explorerBaseUrl(chainId)}/address/${address}`;
}

export function chainExplorerSearchUrl(query: string, chainId = DEFAULT_CHAIN_ID) {
  return `${explorerBaseUrl(chainId)}/search?q=${encodeURIComponent(query)}`;
}

export function storageExplorerSearchUrl(query: string, chainId = DEFAULT_CHAIN_ID) {
  return `${storageExplorerBaseUrl(chainId)}/search?q=${encodeURIComponent(query)}`;
}

export function isTxHash(value: string | undefined) {
  return Boolean(value && /^0x[a-fA-F0-9]{64}$/.test(value));
}

export function txExplorerHref(txHash: string | undefined, chainId = DEFAULT_CHAIN_ID) {
  if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) return undefined;
  return chainExplorerTxUrl(txHash, chainId);
}

export function addressExplorerHref(address: string | undefined, chainId = DEFAULT_CHAIN_ID) {
  if (!address) return undefined;
  return /^0x[a-fA-F0-9]{40}$/.test(address)
    ? chainExplorerAddressUrl(address, chainId)
    : chainExplorerSearchUrl(address, chainId);
}

export function traceDetailHref(traceId: string) {
  return `/verify/${encodeURIComponent(traceId)}`;
}
