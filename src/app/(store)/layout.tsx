import type { ReactNode } from "react";

import { StoreShell } from "@/components/store/store-shell";
import { getStorefrontSnapshot } from "@/services/storefront";

export default async function StoreLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const snapshot = await getStorefrontSnapshot();

  return (
    <StoreShell
      storeSettings={snapshot.storeSettings}
      themeSettings={snapshot.themeSettings}
    >
      {children}
    </StoreShell>
  );
}
