package com.davi.financeiro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

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

        try {
            mailSender.send(mensagem);
            log.info("E-mail de verificação enviado para {}", destinatario);
        } catch (MailException e) {
            log.error("Falha ao enviar e-mail via JavaMailSender (destinatario={}, remetente={})", destinatario, remetente, e);
            throw e;
        } catch (RuntimeException e) {
            log.error("Erro inesperado ao enviar e-mail (destinatario={}, remetente={})", destinatario, remetente, e);
            throw e;
        }
    }
}