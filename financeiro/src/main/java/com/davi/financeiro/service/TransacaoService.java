package com.davi.financeiro.service;

import com.davi.financeiro.domain.TipoTransacao;
import com.davi.financeiro.domain.Transacao;
import com.davi.financeiro.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service //o crachá do serviço
public class TransacaoService {

    @Autowired//2- a injeção de dependência
    private TransacaoRepository repository;

    //Salvar
    public Transacao salvar(Transacao transacao){
        return repository.save(transacao);
    }
    //Listar Tudo
    public List<Transacao> listarTodas (){
        return repository.findAll();
    }

    //Deletar
    public void deletar(Long id){
        repository.deleteById(id);
    }

    // Método para atualizar uma transação existente
    public Transacao atualizar(Long id, Transacao transacaoAtualizada) {
        // 1. Busca a transação antiga no banco
        Transacao transacaoExistente = repository.findById(id).orElse(null);

        // 2. Se ela existir, atualiza os campos
        if (transacaoExistente != null) {
            transacaoExistente.setDescricao(transacaoAtualizada.getDescricao());
            transacaoExistente.setValor(transacaoAtualizada.getValor());
            transacaoExistente.setTipo(transacaoAtualizada.getTipo());
            transacaoExistente.setCategoria(transacaoAtualizada.getCategoria());
            transacaoExistente.setData(transacaoAtualizada.getData());

            // 3. Salva a versão atualizada no banco
            return repository.save(transacaoExistente);
        }
        return null;
    }


    public Map<String, Object> carregarResumo(){
        List<Transacao> todas = repository.findAll();

        BigDecimal totalReceitas = BigDecimal.ZERO;
        BigDecimal totalDespesas = BigDecimal.ZERO;

        for (Transacao  t : todas) {
            if(t.getTipo() == TipoTransacao.RECEITA){
                totalReceitas = totalReceitas.add(t.getValor());
            } else{
                totalDespesas= totalDespesas.add(t.getValor());
            }
        }

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        //5- O pacote de resposta
        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalReceitas", totalReceitas);
        resumo.put("totalDespesas", totalDespesas);
        resumo.put("saldo", saldo);

        return resumo;


    }


}

