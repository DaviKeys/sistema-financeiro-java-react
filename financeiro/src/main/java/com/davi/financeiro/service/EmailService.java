package com.davi.financeiro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public void enviarEmailVerificacao(String destinatario, String nome, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Confirme sua conta - Gestão Financeira");

        mensagem.setText("Olá, " + nome + "!\n\n" +
                "Bem-vindo(a) ao nosso sistema de Gestão Financeira.\n" +
                "Para ativar sua conta e liberar o seu acesso, digite o código de verificação abaixo na tela do sistema:\n\n" +
                "Código de Verificação: " + codigo + "\n\n" +
                "Se você não solicitou este cadastro, apenas ignore este e-mail.");

        mailSender.send(mensagem);
    }
}