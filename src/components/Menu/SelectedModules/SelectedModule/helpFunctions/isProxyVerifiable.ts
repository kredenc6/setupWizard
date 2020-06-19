import { Module } from "../../../../../interfaces/variousInterfaces";

export default function isProxyVerifiable(moduleSettings: Module | undefined, key: string) {
  if(!moduleSettings || !moduleSettings.VERIFY_BY_PROXY) return false;
  if(moduleSettings.VERIFY_BY_PROXY[0] === "SELF") return true;
  return moduleSettings.VERIFY_BY_PROXY.includes(key);
}