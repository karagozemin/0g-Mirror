const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16602);

const explorerBaseByChainId: Record<number, string> = {
  16602: "https://chainscan-galileo.0g.ai",
  16661: "https://chainscan.0g.ai"
};

const storageExplorerBaseByChainId: Record<number, string> = {
  16602: "https://storagescan-galileo.0g.ai",
  16661: "https://storagescan.0g.ai"
};

const storageIndexerBaseByChainId: Record<number, string> = {
  16602: "https://indexer-storage-testnet-turbo.0g.ai",
  16661: "https://indexer-storage.0g.ai"
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

function storageIndexerBaseUrl(chainId = DEFAULT_CHAIN_ID) {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER ??
      storageIndexerBaseByChainId[chainId] ??
      storageIndexerBaseByChainId[16602]
  );
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

export function storageIndexerFileUrl(root: string, chainId = DEFAULT_CHAIN_ID) {
  return `${storageIndexerBaseUrl(chainId)}/file?root=${encodeURIComponent(root)}`;
}

export function storageExplorerSearchUrl(query: string, chainId = DEFAULT_CHAIN_ID) {
  if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
    return storageIndexerFileUrl(query, chainId);
  }
  return `${storageExplorerBaseUrl(chainId)}/files?q=${encodeURIComponent(query)}`;
}

export function storageExplorerHref(value: string | undefined, chainId = DEFAULT_CHAIN_ID) {
  if (!value) return undefined;
  const root = value.startsWith("0g://") ? value.replace("0g://", "") : value;
  if (/^0x[a-fA-F0-9]{64}$/.test(root)) return storageIndexerFileUrl(root, chainId);
  return storageExplorerSearchUrl(value, chainId);
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
