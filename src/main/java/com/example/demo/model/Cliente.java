package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String telefono;

    @Column(name = "numero_cuaderno")
    private Integer numeroCuaderno;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Integer getNumeroCuaderno() { return numeroCuaderno; }
    public void setNumeroCuaderno(Integer numeroCuaderno) { this.numeroCuaderno = numeroCuaderno; }
}