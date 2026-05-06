console.log("JS cargado correctamente");

const API = "https://grain-disaster-laxative.ngrok-free.dev/clientes";
const API_DEUDAS = "https://grain-disaster-laxative.ngrok-free.dev/deudas";

let clientesGlobal = [];

// ===================== CLIENTES =====================

let paginaActual = 1;
const CLIENTES_POR_PAGINA = 4;

async function cargarClientes() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        // 🔤 ORDENAR ALFABÉTICAMENTE
        clientesGlobal = data.sort((a, b) =>
            a.nombre.localeCompare(b.nombre, "es")
        );

        paginaActual = 1;
        mostrarClientes(clientesGlobal);
        cargarClientesSelect();

    } catch (error) {
        console.error("Error cargando clientes:", error);
    }
}

function mostrarClientes(lista) {
    const cont = document.getElementById("listaClientes");
    cont.innerHTML = "";

    // 📄 CALCULAR PÁGINA
    const total = lista.length;
    const totalPaginas = Math.ceil(total / CLIENTES_POR_PAGINA);
    const inicio = (paginaActual - 1) * CLIENTES_POR_PAGINA;
    const fin = inicio + CLIENTES_POR_PAGINA;
    const paginados = lista.slice(inicio, fin);

    // RENDERIZAR CLIENTES
    paginados.forEach(c => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${c.nombre}</b> - 📞 ${c.telefono} - 📒 ${c.numeroCuaderno}
            <button class="btnEliminar">X</button>
        `;

        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("btnEliminar")) return;
            verDetalleCliente(c.id);
        });

        li.querySelector(".btnEliminar").addEventListener("click", (e) => {
            e.stopPropagation();
            eliminarCliente(c.id);
        });

        cont.appendChild(li);
    });

    // 📄 CONTROLES DE PAGINACIÓN
    const paginacion = document.createElement("div");
    paginacion.classList.add("paginacion");

    paginacion.innerHTML = `
        <button id="btnAnterior" ${paginaActual === 1 ? "disabled" : ""}>◀ Anterior</button>
        <span>Página ${paginaActual} de ${totalPaginas}</span>
        <button id="btnSiguiente" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente ▶</button>
    `;

    cont.appendChild(paginacion);

    document.getElementById("btnAnterior").addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarClientes(lista);
        }
    });

    document.getElementById("btnSiguiente").addEventListener("click", () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarClientes(lista);
        }
    });
}

// ===================== FILTRAR POR CLIENTE =====================

document.getElementById("filtroClientes").addEventListener("input", filtrarClientes);

function filtrarClientes() {
    const texto = document.getElementById("filtroClientes").value.toLowerCase();

    const filtrados = clientesGlobal.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.telefono.toLowerCase().includes(texto) ||
        String(c.numeroCuaderno).includes(texto)
    );

    paginaActual = 1; // 🔥 resetear página al filtrar
    mostrarClientes(filtrados);
}

// ===================== SELECT CLIENTES =====================

async function cargarClientesSelect() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        const select = document.getElementById("clienteSelect");
        select.innerHTML = "";

        data.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error cargando select:", error);
    }
}

// ===================== CREAR CLIENTE =====================

async function crearCliente() {
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const numeroCuaderno = document.getElementById("numero_cuaderno").value;

    if (!nombre || !telefono || !numeroCuaderno) {
        alert("Completa todos los campos");
        return;
    }

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            telefono,
            numeroCuaderno: numeroCuaderno,

        })
    });

    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("numero_cuaderno").value = "";

    cargarClientes();
}



// ===================== DETALLE CLIENTE =====================

async function verDetalleCliente(id) {

    try {
        const cliente = await (await fetch(`${API}/${id}`)).json();

        document.getElementById("nombreCliente").textContent =
            `${cliente.nombre} - 📞 ${cliente.telefono}`;

        const lista = document.getElementById("listaDeudas");
        lista.innerHTML = "";

        const deudas = await (await fetch(`${API_DEUDAS}/cliente/${id}`)).json();

        if (!deudas || deudas.length === 0) {
            lista.innerHTML = "<li>Sin deudas</li>";
            return;
        }

        // 🔥 TOTAL GENERAL
        let totalSaldo = 0;

        deudas.forEach(d => {
            totalSaldo += d.saldoActual;

            const li = document.createElement("li");

            li.innerHTML = `
                <div class="deuda-card">

                    <div>
                        💰 Total: ${d.totalDeuda} |
                        💸 Saldo: ${d.saldoActual}
                    </div>

                    <div>📝 ${d.descripcion}</div>

                    <div>📅 ${formatearFecha(d.fecha)}</div>

                    <div>
                        ${d.pagada ? "✔ PAGADA" : "🔴 PENDIENTE"}
                    </div>

                </div>
            `;

            lista.appendChild(li);
        });

        // 🔥 BLOQUE DE ABONO GLOBAL (UNO SOLO)
        const divAbono = document.createElement("div");

        divAbono.innerHTML = `
            <div class="deuda-card" style="margin-top:15px;">
                <h3>Total deuda del cliente: ${totalSaldo}</h3>

                <input type="number" id="abonoGlobal" placeholder="Abonar a toda la deuda">

                <button id="btnAbonarGlobal" class="btnAbonar">
                    Abonar todo
                </button>
            </div>
        `;

        lista.appendChild(divAbono);

        // 🔥 EVENTO ABONO GLOBAL
        document.getElementById("btnAbonarGlobal").addEventListener("click", async () => {

            const valor = parseInt(document.getElementById("abonoGlobal").value);

            if (!valor || valor <= 0) {
                mostrarAlerta("Ingresa un valor válido", "warning");
                return;
            }

            await fetch(`${API_DEUDAS}/abonar-cliente/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ abono: valor })
            });

            mostrarAlerta("Abono aplicado a toda la deuda", "success");

            verDetalleCliente(id);
        });

    } catch (error) {
        console.error("Error detalle:", error);
        mostrarAlerta("Error cargando detalle del cliente", "error");
    }
}

// ===================== FECHA =====================

function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    const f = new Date(fecha);

    return f.toLocaleString("es-CO", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ===================== ELIMINAR CLIENTE =====================

async function eliminarCliente(id) {
    const ok = confirm("¿Eliminar cliente?");
    if (!ok) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });

    cargarClientes();
}

// ===================== ALERTAS FLOTANTES =====================
function mostrarConfirmacion() {
    return new Promise((resolve) => {

        const modal = document.getElementById("modalConfirm");
        const btnOk = document.getElementById("btnConfirmar");
        const btnCancel = document.getElementById("btnCancelar");

        modal.classList.add("show");

        // evitar múltiples clicks acumulados
        btnOk.onclick = null;
        btnCancel.onclick = null;

        btnOk.onclick = () => {
            modal.classList.remove("show");
            resolve(true);
        };

        btnCancel.onclick = () => {
            modal.classList.remove("show");
            resolve(false);
        };
    });
}

function mostrarAlerta(mensaje, tipo = "success") {
    const toast = document.getElementById("toast");

    let icono = "";
    let titulo = "";

    if (tipo === "success") {
        icono = "✅";
        titulo = "Éxito";
    }
    if (tipo === "error") {
        icono = "❌";
        titulo = "Error";
    }
    if (tipo === "warning") {
        icono = "⚠️";
        titulo = "Advertencia";
    }

    toast.innerHTML = `
        <div class="toast-icon">${icono}</div>
        <div class="toast-content">
            <div class="toast-title">${titulo}</div>
            <div class="toast-message">${mensaje}</div>
        </div>
    `;

    toast.classList.remove("success", "error", "warning", "show");
    void toast.offsetWidth;

    toast.classList.add(tipo);
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// ===================== DEUDA =====================

async function crearDeuda() {
    console.log("CLICK EN CREAR DEUDA");

    const valor = document.getElementById("valorDeuda").value;
    const descripcion = document.getElementById("descripcionDeuda").value;
    const clienteId = document.getElementById("clienteSelect").value;

    if (!valor || !descripcion || !clienteId) {
        mostrarAlerta("Completa todos los campos", "warning");
        return;
    }

    // 🔥 MOSTRAR CONFIRMACIÓN ANTES DE GUARDAR
    const confirmado = await mostrarConfirmacion();
    if (!confirmado) return; // Si cancela, no hace nada

    try {
        await fetch(API_DEUDAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clienteId: parseInt(clienteId),
                totalDeuda: parseInt(valor),
                saldoActual: parseInt(valor),
                descripcion: descripcion,
                pagada: false
            })
        });

        mostrarAlerta("Deuda guardada exitosamente", "success");

        document.getElementById("valorDeuda").value = "";
        document.getElementById("descripcionDeuda").value = "";

        verDetalleCliente(clienteId);

    } catch (error) {
        console.error("Error creando deuda:", error);
        mostrarAlerta("Error al guardar la deuda", "error");
    }
}

// ===================== INICIO =====================

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();

    document.getElementById("btnGuardar")
        .addEventListener("click", crearCliente);

    // 🔥 FALTABA ESTO
    document.getElementById("btnCrearDeuda")
        .addEventListener("click", crearDeuda);
});