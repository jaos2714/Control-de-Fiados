package com.example.demo.controller;

import com.example.demo.model.Movimiento;
import com.example.demo.repository.MovimientoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movimientos")
public class MovimientoController {

    private final MovimientoRepository repo;
    public MovimientoController(MovimientoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Movimiento> listar() { return repo.findAll(); }

    @GetMapping("/cliente/{clienteId}")
    public List<Movimiento> porCliente(@PathVariable Integer clienteId) {
        return repo.findByClienteId(clienteId);
    }

    @PostMapping
    public Movimiento crear(@RequestBody Movimiento movimiento) { return repo.save(movimiento); }

    @PutMapping("/{id}")
    public Movimiento actualizar(@PathVariable Integer id, @RequestBody Movimiento datos) {
        datos.setId(id);
        return repo.save(datos);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { repo.deleteById(id); }
}