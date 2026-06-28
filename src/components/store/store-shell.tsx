import type { CSSProperties, ReactNode } from "react";

import { StoreCartProvider } from "@/components/store/cart-provider";
import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";
import { MiniCartDrawer } from "@/components/store/mini-cart-drawer";
import { StoreToastNotice } from "@/components/store/store-toast-notice";
import type {
  CategoryCard,
  StoreSettingsSnapshot,
  ThemeSettingsSnapshot,
} from "@/types/domain";

type StoreShellProps = {
  children: ReactNode;
  storeSettings: StoreSettingsSnapshot;
  themeSettings: ThemeSettingsSnapshot;
  categories: CategoryCard[];
};

export function StoreShell({
  children,
  storeSettings,
  themeSettings,
  categories,
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
        className="relative flex min-h-screen flex-col overflow-x-clip"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 top-28 h-[34rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,79,216,0.16)_0%,rgba(255,79,216,0.06)_35%,transparent_72%)] blur-3xl" />
          <div className="absolute -right-24 top-56 h-[38rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(52,215,255,0.16)_0%,rgba(52,215,255,0.06)_32%,transparent_72%)] blur-3xl" />
          <div className="absolute left-0 top-[18rem] hidden h-[70vh] w-24 border-r border-white/6 bg-[linear-gradient(180deg,rgba(255,79,216,0.06),transparent_18%,transparent_82%,rgba(52,215,255,0.05))] lg:block" />
          <div className="absolute right-0 top-[14rem] hidden h-[72vh] w-24 border-l border-white/6 bg-[linear-gradient(180deg,rgba(52,215,255,0.05),transparent_20%,transparent_80%,rgba(255,79,216,0.06))] lg:block" />
        </div>
        <StoreHeader
          storeName={storeSettings.storeName}
          categories={categories}
        />
        <main className="relative z-10 flex-1">{children}</main>
        <StoreFooter
          storeName={storeSettings.storeName}
          footerText={storeSettings.footerText}
        />
        <MiniCartDrawer />
        <StoreToastNotice />
      </div>
    </StoreCartProvider>
  );
}
