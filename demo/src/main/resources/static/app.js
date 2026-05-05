console.log("JS cargado correctamente");

const API = "http://localhost:8081/clientes";
const API_DEUDAS = "http://localhost:8081/deudas";

let clientesGlobal = [];

// ===================== CLIENTES =====================

async function cargarClientes() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        clientesGlobal = data;

        mostrarClientes(data);
        cargarClientesSelect(); // 🔥 SIEMPRE ACTUALIZA SELECT

    } catch (error) {
        console.error("Error cargando clientes:", error);
    }
}

function mostrarClientes(lista) {
    const cont = document.getElementById("listaClientes");
    cont.innerHTML = "";

    lista.forEach(c => {
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
            numeroCuaderno: parseInt(numeroCuaderno)
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

        deudas.forEach(d => {

            const li = document.createElement("li");

            li.innerHTML = `
                <div class="deuda-card">

                    <div>
                        💰 Total: ${d.totalDeuda} |
                        💸 Saldo: ${d.saldoActual}
                    </div>

                    <div>📝 ${d.descripcion}</div>

                    <div>📅 ${formatearFecha(d.fecha)}</div>

                    <div id="estado-${d.id}">
                        ${d.pagada ? "✔ PAGADA" : "🔴 PENDIENTE"}
                    </div>

                    ${!d.pagada ? `
                        <div class="abono-box">
                            <input type="number" id="abono-${d.id}" placeholder="Abono">
                            <button class="btnAbonar" data-id="${d.id}">
                                Abonar
                            </button>
                        </div>
                    ` : ""}
                </div>
            `;

            lista.appendChild(li);
        });

        // ===================== EVENTOS ABONO =====================
        document.querySelectorAll(".btnAbonar").forEach(btn => {
            btn.addEventListener("click", async (e) => {

                const idDeuda = e.target.dataset.id;
                const input = document.getElementById(`abono-${idDeuda}`);
                const valor = parseInt(input.value);

                if (!valor || valor <= 0) {
                    alert("Ingresa un valor válido");
                    return;
                }

                await fetch(`${API_DEUDAS}/abonar/${idDeuda}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ abono: valor })
                });

                verDetalleCliente(id);
            });
        });

    } catch (error) {
        console.error("Error detalle:", error);
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

// ===================== INICIO =====================

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();

    document.getElementById("btnGuardar")
        .addEventListener("click", crearCliente);
});