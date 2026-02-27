package com.davi.financeiro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;

@RestController
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/api/health")
    public ResponseEntity<String> health() {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT 1")) {
            ps.execute();
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("DB_ERROR");
        }
    }
}
