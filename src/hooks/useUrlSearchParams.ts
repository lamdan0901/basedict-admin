"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useUrlSearchParams = () => {
  const router = useRouter();

  const setSearchParams = useCallback(
    (params: Record<string, any>) => {
      const searchParams = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, String(value));
        }
      });

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      router.push(newUrl, {
        scroll: false,
      });
    },
    [router]
  );

  return setSearchParams;
};
