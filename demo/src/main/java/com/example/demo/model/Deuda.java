package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deudas")
public class Deuda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer clienteId;
    private Integer totalDeuda;
    private Integer saldoActual;
    private String descripcion;
    private LocalDateTime fecha;

    // 🔥 NUEVO CAMPO
    private Boolean pagada = false;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getClienteId() { return clienteId; }
    public void setClienteId(Integer clienteId) { this.clienteId = clienteId; }

    public Integer getTotalDeuda() { return totalDeuda; }
    public void setTotalDeuda(Integer totalDeuda) { this.totalDeuda = totalDeuda; }

    public Integer getSaldoActual() { return saldoActual; }
    public void setSaldoActual(Integer saldoActual) { this.saldoActual = saldoActual; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    // 🔥 GETTER Y SETTER NUEVOS
    public Boolean getPagada() { return pagada; }
    public void setPagada(Boolean pagada) { this.pagada = pagada; }
}