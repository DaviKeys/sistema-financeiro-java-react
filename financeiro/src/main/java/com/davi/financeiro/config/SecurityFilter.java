package com.davi.financeiro.config;

import com.davi.financeiro.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. Pega o token do cabeçalho da requisição
        var token = this.recuperarToken(request);

        if (token != null) {
            // 2. Manda para o TokenService ver se a assinatura é falsa ou expirou
            var subjectId = tokenService.validarToken(token);

            if (!subjectId.isEmpty()) {
                // 3. Se for válido, cria um "crachá" temporário e avisa o Spring: "Pode deixar entrar!"
                var authentication = new UsernamePasswordAuthenticationToken(subjectId, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // 4. Passa para o próximo filtro do servidor
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", ""); // Remove a palavra "Bearer " e deixa só o código
    }
}