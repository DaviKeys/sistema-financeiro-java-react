package com.davi.financeiro.controller;

import com.davi.financeiro.domain.Transacao;
import com.davi.financeiro.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transacoes")

public class TransacaoController {

    @Autowired
    private TransacaoService service;

    @PostMapping
    public Transacao criar(@RequestBody Transacao transacao){
        return service.salvar(transacao);
    }

    @GetMapping
    public List<Transacao> listar(){
        return service.listarTodas();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar (@PathVariable Long id){
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizar(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao atualizada = service.atualizar(id, transacao);

        if (atualizada != null) {
            return ResponseEntity.ok(atualizada); // Retorna 200 OK com a transação nova
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 se o ID não existir
        }
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getResumo(){
        return service.carregarResumo();
    }

}
