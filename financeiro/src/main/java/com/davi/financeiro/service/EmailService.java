package com.davi.financeiro.service;

import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${mail.from}")
    private String remetente;

    private final RestClient restClient;

    public EmailService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.resend.com")
                .build();
    }

    public void enviarEmailVerificacao(String destinatario, String nome, String codigo) {
        String assunto = "Confirme sua conta - Gestão Financeira";
        String corpo = "Olá, " + nome + "!\n\n" +
                "Bem-vindo(a) ao nosso sistema de Gestão Financeira.\n" +
                "Para ativar sua conta e liberar o seu acesso, digite o código de verificação abaixo na tela do sistema:\n\n" +
                "Código de Verificação: " + codigo + "\n\n" +
                "Se você não solicitou este cadastro, apenas ignore este e-mail.";

        Map<String, Object> payload = Map.of(
                "from", remetente,
                "to", new String[]{destinatario},
                "subject", assunto,
                "text", corpo
        );

        try {
            Map response = restClient
                    .post()
                    .uri("/emails")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + resendApiKey)
                    .body(payload)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {
                        String body;
                        try {
                            body = res.getBody() != null ? new String(res.getBody().readAllBytes()) : "";
                        } catch (Exception e) {
                            body = "<falha ao ler body>";
                        }
                        throw new IllegalStateException("Resend retornou status=" + res.getStatusCode() + " body=" + body);
                    })
                    .body(Map.class);

            Object id = response != null ? response.get("id") : null;
            log.info("E-mail de verificação enviado via Resend para {} (id={})", destinatario, id);
        } catch (RuntimeException e) {
            log.error("Falha ao enviar e-mail via Resend (destinatario={}, remetente={})", destinatario, remetente, e);
            throw e;
        }
    }
}