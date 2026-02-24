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

    // --- NOVAS ROTAS COM SUPORTE A MÚLTIPLOS USUÁRIOS ---

    // 1. Rota para listar recebe o ID na URL
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transacao>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(transacaoRepository.findByUsuarioId(usuarioId));
    }

    // 2. Rota para salvar recebe o ID na URL e a transação no corpo
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Transacao> salvarPorUsuario(@PathVariable Long usuarioId, @RequestBody Transacao transacao) {
        // Cria um utilizador "vazio" apenas com o ID para fazer o vínculo
        Usuario usuarioVinculo = new Usuario();
        usuarioVinculo.setId(usuarioId);
        transacao.setUsuario(usuarioVinculo);

        return ResponseEntity.ok(transacaoRepository.save(transacao));
    }

    // --- ROTAS ANTIGAS DE ATUALIZAR, DELETAR E RESUMO ---

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