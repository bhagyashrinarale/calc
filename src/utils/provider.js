export const getProviderId = (provider) =>
  provider?.id ??
  provider?.userId ??
  provider?.providerId ??
  provider?.spId ??
  provider?.profileId ??
  provider?.profile_id ??
  null;

export const getProviderDisplayName = (provider) => {
  const rawName =
    provider?.name ||
    provider?.fullName ||
    provider?.providerName ||
    [provider?.firstName, provider?.lastName].filter(Boolean).join(" ") ||
    "";
  const normalizedName =
    rawName && !rawName.toLowerCase().includes("null") ? rawName : "";

  return normalizedName || provider?.email || "Service Provider";
};
