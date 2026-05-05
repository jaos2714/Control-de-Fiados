package com.example.demo.repository;

import com.example.demo.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Integer> {
    List<Movimiento> findByClienteId(Integer clienteId);
    List<Movimiento> findByDeudaId(Integer deudaId);
}