import Link from "next/link";

type StoreFooterProps = {
  storeName: string;
  footerText: string | null;
};

export function StoreFooter({ storeName, footerText }: StoreFooterProps) {
  return (
    <footer className="mt-16 border-t border-white/50 bg-white/70 py-10">
      <div className="app-shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-serif text-2xl text-[var(--foreground)]">{storeName}</p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
            {footerText ||
              "Narsky reune figuras, piezas decorativas y creaciones inspiradas en mundos anime, gamer y coleccionables hechos con dedicacion."}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/terminos">Terminos</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
