import { usePathname } from "expo-router";
import { useEffect } from "react";

export function useTabEffect(route: string, effect: React.EffectCallback) {
  const path = usePathname();
  useEffect(() => {
    if (path === route) {
      const cleanup = effect();
      return cleanup;
    }
  }, [path]);
}
