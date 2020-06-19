import { Module } from "../../../../../interfaces/variousInterfaces";

export default function determineWebPrefix(moduleSettings: Module | undefined, prefixIndex: number | undefined) {
  if(moduleSettings && moduleSettings.WEB_PREFIX) {
    return moduleSettings.WEB_PREFIX[prefixIndex || 0];
  }
  return undefined;
}