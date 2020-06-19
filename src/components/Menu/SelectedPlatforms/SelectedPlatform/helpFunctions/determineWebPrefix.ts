import { Platform } from "../../../../../interfaces/variousInterfaces";

export default function determineWebPrefix(platformSettings: Platform | undefined, prefixIndex: number | undefined) {
  if(platformSettings && platformSettings.WEB_PREFIX) {
    return platformSettings.WEB_PREFIX[prefixIndex || 0];
  }
  return undefined;
}