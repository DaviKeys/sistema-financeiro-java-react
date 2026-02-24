package com.davi.financeiro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class TratadorDeErros {

    // 1. Captura erros de Regra de Negócio (ex: "E-mail já cadastrado")
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResposta> tratarErroRegraDeNegocio(IllegalArgumentException ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 2. Captura erros gerais e inesperados do servidor (Erro 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarErroGenerico(Exception ex) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Ocorreu um erro interno no servidor. Contate o suporte.",
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }

    // O "molde" do nosso JSON de erro
    public record ErroResposta(int status, String mensagem, LocalDateTime dataHora) {}
}