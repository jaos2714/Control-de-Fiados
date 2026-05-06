package com.example.demo.repository;

import com.example.demo.model.Deuda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeudaRepository extends JpaRepository<Deuda, Integer> {
    List<Deuda> findByClienteId(Integer clienteId);
}