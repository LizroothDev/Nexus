import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const label = "font-mono text-xs uppercase tracking-widest text-trace";

const terminos = [
  ["Objeto", "Nexus es una plataforma de venta de componentes electrónicos para estudiantes, makers y empresas. Al crear una cuenta aceptas estas condiciones."],
  ["Cuentas", "El usuario es responsable de la veracidad de sus datos. Las cuentas de mayoreo requieren RFC y razón social válidos para emisión de factura."],
  ["Precios y disponibilidad", "Los precios están expresados en pesos mexicanos y no incluyen IVA. El descuento por volumen se aplica automáticamente al alcanzar la cantidad mínima de cada clave."],
  ["Pedidos", "Un pedido se considera confirmado al recibir el comprobante de pago. Los pedidos realizados antes de las 16:00 horas se surten el mismo día hábil."],
  ["Devoluciones", "Se aceptan devoluciones dentro de los 15 días naturales posteriores a la entrega, siempre que el componente conserve su empaque original y no presente daño por manipulación."],
  ["Garantía", "Los componentes cuentan con garantía de 30 días contra defectos de fábrica. La garantía no cubre daño por sobrevoltaje, polaridad invertida ni soldadura inadecuada."],
];

const privacidad = [
  ["Responsable", "Nexus Componentes, con domicilio en Av. Convención de 1914 Nte. 1420, Col. Circunvalación Norte, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales."],
  ["Datos que recabamos", "Nombre, correo electrónico, tipo de cuenta y, en el caso de cuentas empresariales, razón social y RFC."],
  ["Finalidad", "Los datos se utilizan para procesar pedidos, emitir comprobantes fiscales, dar seguimiento a garantías y enviar avisos sobre existencias cuando el usuario lo autorice."],
  ["Transferencia", "No compartimos datos personales con terceros, salvo los estrictamente necesarios para la emisión de facturas ante el SAT y el envío de mercancía."],
  ["Derechos ARCO", "Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a hola@nexus.mx. Respondemos en un plazo máximo de 20 días hábiles."],
  ["Conservación", "Los datos fiscales se conservan por cinco años conforme a la legislación mexicana aplicable. El resto se elimina al solicitar la baja de la cuenta."],
];

export default function Legal() {
  const [params, setParams] = useSearchParams();
  const inicial = params.get("doc") === "privacidad" ? "privacidad" : "terminos";
  const [activo, setActivo] = useState(inicial);

  const contenido = activo === "terminos" ? terminos : privacidad;

  function cambiar(doc) {
    setActivo(doc);
    setParams({ doc });
  }

  return (
    <section className="mx-auto max-w-3xl px-5 pt-16 pb-24">
      <p className={label}>Información legal</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        {activo === "terminos" ? "Términos y condiciones" : "Aviso de privacidad"}
      </h1>
      <p className="mt-3 font-mono text-sm text-trace">
        Última actualización: octubre de 2026
      </p>

      {/* Pestañas */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={() => cambiar("terminos")}
          className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
            activo === "terminos"
              ? "bg-ink text-board"
              : "border border-ink/20 hover:border-ink"
          }`}
        >
          Términos
        </button>
        <button
          onClick={() => cambiar("privacidad")}
          className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
            activo === "privacidad"
              ? "bg-ink text-board"
              : "border border-ink/20 hover:border-ink"
          }`}
        >
          Privacidad
        </button>
      </div>

      {/* Contenido */}
      <ol className="mt-10 grid gap-8">
        {contenido.map(([titulo, texto], i) => (
          <li key={titulo} className="grid gap-2">
            <h2 className="font-display text-xl font-bold">
              <span className="mr-2 font-mono text-sm text-trace">
                {String(i + 1).padStart(2, "0")}
              </span>
              {titulo}
            </h2>
            <p className="leading-relaxed text-ink/75">{texto}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-sm border border-dashed border-ink/25 bg-white p-5">
        <p className="font-mono text-xs leading-relaxed text-trace">
          Documento con fines académicos. Proyecto escolar de Negocios
          Electrónicos I — sin validez legal.
        </p>
      </div>

      <Link
        to="/registro"
        className="mt-8 inline-block font-mono text-xs uppercase tracking-wider text-trace hover:text-ink"
      >
        ← Regresar al registro
      </Link>
    </section>
  );
}