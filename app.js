// Interacciones de la landing: maqueta animada, calculadoras y precios.
const $ = (s) => document.querySelector(s);
const usd = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ITBMS = 0.07;

// ---------- maqueta del hero: escribe el cliente, "envía" y llega el pago ----------
function animarMaqueta() {
  const campo = $(".escribe"), texto = campo.dataset.texto;
  const estado = $("#estado-factura"), cobro = $(".cobro"), boton = $("#btn-enviar-falso");
  if (reducido) {
    campo.textContent = texto; estado.textContent = "Pagada"; estado.classList.add("pagada"); cobro.classList.add("visible");
    return;
  }
  const ciclo = () => {
    campo.textContent = ""; estado.textContent = "Borrador"; estado.classList.remove("pagada");
    cobro.classList.remove("visible"); boton.textContent = "Enviar por WhatsApp";
    let i = 0;
    const escribir = setInterval(() => {
      campo.textContent = texto.slice(0, ++i);
      if (i >= texto.length) {
        clearInterval(escribir);
        setTimeout(() => { boton.textContent = "✓ Enviada"; estado.textContent = "Enviada"; }, 700);
        setTimeout(() => { estado.textContent = "Pagada"; estado.classList.add("pagada"); cobro.classList.add("visible"); }, 2000);
        setTimeout(ciclo, 6500);
      }
    }, 70);
  };
  ciclo();
}

// ---------- calculadora de ITBMS ----------
function calculadoraITBMS() {
  const f = $("#calc-itbms");
  const calcular = () => {
    const monto = Math.max(0, parseFloat($("#monto").value) || 0);
    const impuesto = $("#exento").checked ? 0 : Math.round(monto * ITBMS * 100) / 100;
    $("#r-sub").textContent = usd(monto);
    $("#r-itbms").textContent = $("#exento").checked ? "Exento" : usd(impuesto);
    $("#r-total").textContent = usd(monto + impuesto);
  };
  f.addEventListener("input", calcular);
  f.addEventListener("submit", (e) => e.preventDefault());
  calcular();
}

// ---------- calculadora de ahorro ----------
function calculadoraAhorro() {
  const MIN_CON_APP = 3;   // minutos por factura usando la app
  const calcular = () => {
    const facturas = +$("#facturas").value, minutos = +$("#minutos").value, tarifa = +$("#tarifa").value;
    $("#o-facturas").textContent = facturas;
    $("#o-minutos").textContent = minutos;
    $("#o-tarifa").textContent = `$${tarifa}`;
    const horas = Math.max(0, (facturas * (minutos - MIN_CON_APP)) / 60);
    $("#r-horas").textContent = `${horas.toFixed(1)} h`;
    $("#r-valor").textContent = `$${Math.round(horas * tarifa).toLocaleString("en-US")}`;
  };
  $("#calc-ahorro").addEventListener("input", calcular);
  calcular();
}

// ---------- precios mensual / anual ----------
function precios() {
  const botones = document.querySelectorAll(".interruptor button");
  const aplicar = (periodo) => {
    botones.forEach((b) => b.setAttribute("aria-checked", b.dataset.periodo === periodo));
    document.querySelectorAll(".precio span").forEach((s) => {
      const v = +s.dataset[periodo];
      s.textContent = v % 1 ? `$${v.toFixed(2)}` : `$${v}`;
    });
    $("#nota-precio").textContent = periodo === "anual"
      ? "Precio mensual equivalente, facturado una vez al año. USD, ITBMS no incluido."
      : "Precios en USD. ITBMS no incluido.";
  };
  botones.forEach((b, i) => {
    b.addEventListener("click", () => aplicar(b.dataset.periodo));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const otro = botones[1 - i];
        otro.focus(); aplicar(otro.dataset.periodo);
      }
    });
  });
}

animarMaqueta();
calculadoraITBMS();
calculadoraAhorro();
precios();
