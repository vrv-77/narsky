import Image from "next/image";
import Link from "next/link";

type StoreFooterProps = {
  storeName: string;
  footerText: string | null;
};

export function StoreFooter({ storeName, footerText }: StoreFooterProps) {
  return (
    <footer className="mt-16 border-t border-white/8 bg-[rgba(5,8,20,0.96)] py-10">
      <div className="app-shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Image
            src="/narsky-icon.svg"
            alt={`${storeName} icono`}
            width={52}
            height={52}
            className="size-13 rounded-full"
          />
          <div>
            <Image
              src="/narsky-wordmark.svg"
              alt={`${storeName} nombre`}
              width={240}
              height={70}
              className="h-10 w-auto"
            />
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
              {footerText ||
                "Narsky reúne figuras, accesorios y piezas artesanales con vibra anime, gamer y coleccionable para fans que quieren un espacio con personalidad."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/contacto">Contacto</Link>
          <Link href="/productos">Tienda</Link>
          <Link href="/carrito">Carrito</Link>
        </div>
      </div>
    </footer>
  );
}
