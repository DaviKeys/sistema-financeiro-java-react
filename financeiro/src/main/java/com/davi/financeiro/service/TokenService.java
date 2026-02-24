package com.davi.financeiro.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.davi.financeiro.domain.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Puxa a senha secreta que colocamos no application.properties
    @Value("${api.security.token.secret}")
    private String secret;

    // 1. FABRICA A PULSEIRA VIP (Token)
    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("financeiro-api")
                    .withSubject(usuario.getId().toString()) // Guarda o ID do usuário dentro do token!
                    .withExpiresAt(gerarDataExpiracao()) // A pulseira vale por 2 horas
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token jwt", exception);
        }
    }

    // 2. O SEGURANÇA DA FESTA: Lê o Token e devolve o ID do dono
    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("financeiro-api")
                    .build()
                    .verify(token)
                    .getSubject(); // Devolve o ID do usuário que estava guardado
        } catch (JWTVerificationException exception) {
            return ""; // Se for falso ou expirado, barra a entrada
        }
    }

    // Define que o Token expira em 2 horas
    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}