import { EmptyState } from "@/components/shared/empty-state";

export default function ContactPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Contacto"
        title="Hablemos de tu pedido ideal"
        description="Si quieres consultar por disponibilidad, encargos o proximas novedades de Narsky, aqui compartiremos nuestros canales de contacto oficiales."
      />
    </div>
  );
}
