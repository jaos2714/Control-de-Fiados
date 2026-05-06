package com.example.demo.controller;

import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository repo;
    public ClienteController(ClienteRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Cliente> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Cliente buscar(@PathVariable Integer id) { return repo.findById(id).orElseThrow(); }

    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {

        System.out.println("=== CLIENTE RECIBIDO ===");
        System.out.println("Nombre: " + cliente.getNombre());
        System.out.println("Telefono: " + cliente.getTelefono());
        System.out.println("Cuaderno: " + cliente.getNumeroCuaderno());

        return repo.save(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizar(@PathVariable Integer id, @RequestBody Cliente datos) {
        datos.setId(id);
        return repo.save(datos);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) { repo.deleteById(id); }
}