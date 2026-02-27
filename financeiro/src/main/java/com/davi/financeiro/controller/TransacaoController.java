package com.davi.financeiro.controller;


import com.davi.financeiro.domain.Transacao;
import com.davi.financeiro.domain.Usuario;
import com.davi.financeiro.repository.TransacaoRepository;
import com.davi.financeiro.service.TransacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {

    @Autowired
    private TransacaoService service;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transacao>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(transacaoRepository.findByUsuarioId(usuarioId));
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Transacao> salvarPorUsuario(@PathVariable Long usuarioId, @RequestBody Transacao transacao) {
        // Vincula a transação ao usuário sem precisar buscar o registro completo.
        Usuario usuarioVinculo = new Usuario();
        usuarioVinculo.setId(usuarioId);
        transacao.setUsuario(usuarioVinculo);

        return ResponseEntity.ok(transacaoRepository.save(transacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizar(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao atualizada = service.atualizar(id, transacao);

        if (atualizada != null) {
            return ResponseEntity.ok(atualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getResumo() {
        return service.carregarResumo();
    }
}