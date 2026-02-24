package com.davi.financeiro.controller;

import com.davi.financeiro.domain.Usuario;
import com.davi.financeiro.repository.UsuarioRepository;
import com.davi.financeiro.service.EmailService;
import com.davi.financeiro.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    // 🔥 Injetamos o nosso novo Carteiro aqui!
    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        Optional<Usuario> usuarioOpt = repository.findByEmail(data.email());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(data.senha(), usuario.getSenha())) {

                // 🔥 NOVA REGRA: Verifica se a pessoa já confirmou o e-mail
                if (!usuario.isAtivo()) {
                    return ResponseEntity.status(403).body("Sua conta ainda não foi ativada. Verifique seu e-mail para pegar o código!");
                }

                String token = tokenService.gerarToken(usuario);
                return ResponseEntity.ok(new LoginResponseDTO("Login realizado com sucesso!", usuario.getNome(), usuario.getId(), token));
            }
        }
        return ResponseEntity.status(401).body("E-mail ou senha incorretos.");
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO data) {
        if (repository.findByEmail(data.email()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha(passwordEncoder.encode(data.senha()));

        // 🔥 GERAR CÓDIGO DE 6 DÍGITOS E BLOQUEAR CONTA INICIALMENTE
        String codigoGerado = String.format("%06d", new Random().nextInt(999999));
        novoUsuario.setCodigoVerificacao(codigoGerado);
        novoUsuario.setAtivo(false);

        repository.save(novoUsuario);

        // 🔥 CHAMA O CARTEIRO PARA ENTREGAR O E-MAIL
        try {
            emailService.enviarEmailVerificacao(novoUsuario.getEmail(), novoUsuario.getNome(), codigoGerado);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de verificação para {} (usuarioId={})", novoUsuario.getEmail(), novoUsuario.getId(), e);
            return ResponseEntity.status(500).body("Usuário salvo, mas ocorreu um erro ao enviar o e-mail de confirmação. Tente um e-mail válido.");
        }

        return ResponseEntity.ok("Usuário cadastrado! Verifique seu e-mail para ativar a conta.");
    }

    // 🔥 NOVA ROTA: Rota para confirmar o código
    @PostMapping("/verificar")
    public ResponseEntity<?> verificarCodigo(@RequestBody VerificacaoRequestDTO data) {
        Optional<Usuario> usuarioOpt = repository.findByEmail(data.email());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado.");
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.isAtivo()) {
            return ResponseEntity.badRequest().body("Esta conta já está ativada!");
        }

        if (usuario.getCodigoVerificacao().equals(data.codigo())) {
            usuario.setAtivo(true);
            usuario.setCodigoVerificacao(null); // Limpa o código pois já foi usado
            repository.save(usuario);
            return ResponseEntity.ok("Conta ativada com sucesso! Você já pode fazer login.");
        } else {
            return ResponseEntity.badRequest().body("Código incorreto. Tente novamente.");
        }
    }
}

// DTOs auxiliares
record LoginRequestDTO(String email, String senha) {}
record CadastroRequestDTO(String nome, String email, String senha) {}
record LoginResponseDTO(String mensagem, String nome, Long id, String token) {}

// 🔥 NOVO DTO para a rota de verificação
record VerificacaoRequestDTO(String email, String codigo) {}