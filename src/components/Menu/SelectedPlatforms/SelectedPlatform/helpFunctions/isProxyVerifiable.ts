import { Platform } from "../../../../../interfaces/variousInterfaces";

export default function isProxyVerifiable(platformSettings: Platform | undefined, key: string) {
  if(!platformSettings || !platformSettings.VERIFY_BY_PROXY) return false;
  if(platformSettings.VERIFY_BY_PROXY[0] === "SELF") return true;
  return platformSettings.VERIFY_BY_PROXY.includes(key);
}