package com.example.demo.controller;

import com.example.demo.model.Deuda;
import com.example.demo.repository.DeudaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/deudas")
public class DeudaController {

    private final DeudaRepository repo;
    public DeudaController(DeudaRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Deuda> listar() { return repo.findAll(); }

    @GetMapping("/cliente/{clienteId}")
    public List<Deuda> porCliente(@PathVariable Integer clienteId) {
        return repo.findByClienteId(clienteId);
    }

    @PostMapping
    public Deuda crear(@RequestBody Deuda deuda) { return repo.save(deuda); }

    @PutMapping("/{id}")
    public Deuda actualizar(@PathVariable Integer id, @RequestBody Deuda datos) {
        datos.setId(id);
        return repo.save(datos);
    }

    @PutMapping("/pagar/{id}")
    public Deuda pagar(@PathVariable Integer id) {
        Deuda deuda = repo.findById(id).orElseThrow();
        deuda.setPagada(true);
        deuda.setSaldoActual(0);
        return repo.save(deuda);
    }

    @PutMapping("/abonar/{id}")
    public Deuda abonar(@PathVariable Integer id, @RequestBody DeudaAbonoRequest request) {

        Deuda deuda = repo.findById(id).orElseThrow();

        int nuevoSaldo = deuda.getSaldoActual() - request.getAbono();

        deuda.setSaldoActual(nuevoSaldo);

        if (nuevoSaldo <= 0) {
            deuda.setSaldoActual(0);
            deuda.setPagada(true);
        }

        return repo.save(deuda);
    }

    @PutMapping("/abonar-cliente/{clienteId}")
    public String abonarCliente(
            @PathVariable Integer clienteId,
            @RequestBody DeudaAbonoRequest request) {

        List<Deuda> deudas = repo.findByClienteId(clienteId);

        int abono = request.getAbono();

        for (Deuda d : deudas) {

            if (d.getSaldoActual() > 0 && abono > 0) {

                int saldo = d.getSaldoActual() - abono;

                if (saldo < 0) {
                    abono = Math.abs(saldo);
                    d.setSaldoActual(0);
                    d.setPagada(true);
                } else {
                    d.setSaldoActual(saldo);
                    abono = 0;
                }

                repo.save(d);

                if (abono == 0) break;
            }
        }

        return "Abono aplicado correctamente";
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { repo.deleteById(id); }
}