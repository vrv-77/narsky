import type { CSSProperties, ReactNode } from "react";

import { StoreCartProvider } from "@/components/store/cart-provider";
import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";
import type { StoreSettingsSnapshot, ThemeSettingsSnapshot } from "@/types/domain";

type StoreShellProps = {
  children: ReactNode;
  storeSettings: StoreSettingsSnapshot;
  themeSettings: ThemeSettingsSnapshot;
};

export function StoreShell({
  children,
  storeSettings,
  themeSettings,
}: StoreShellProps) {
  return (
    <StoreCartProvider>
      <div
        style={
          {
            "--background": themeSettings.backgroundColor,
            "--surface": themeSettings.surfaceColor,
            "--foreground": themeSettings.textColor,
            "--muted": themeSettings.mutedTextColor,
            "--primary": themeSettings.primaryColor,
            "--primary-contrast": themeSettings.buttonTextColor,
            "--secondary": themeSettings.secondaryColor,
            "--accent": themeSettings.accentColor,
            "--radius": themeSettings.borderRadius,
            "--content-max-width": themeSettings.contentMaxWidth,
          } as CSSProperties
        }
        className="flex min-h-screen flex-col"
      >
        <StoreHeader storeName={storeSettings.storeName} />
        <main className="flex-1">{children}</main>
        <StoreFooter
          storeName={storeSettings.storeName}
          footerText={storeSettings.footerText}
        />
      </div>
    </StoreCartProvider>
  );
}
