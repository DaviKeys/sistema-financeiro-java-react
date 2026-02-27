package com.davi.financeiro.controller;

import com.davi.financeiro.domain.Usuario;
import com.davi.financeiro.repository.UsuarioRepository;
import com.davi.financeiro.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        Optional<Usuario> usuarioOpt = repository.findByEmail(data.email());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(data.senha(), usuario.getSenha())) {

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

        novoUsuario.setCodigoVerificacao(null);
        novoUsuario.setAtivo(true);

        repository.save(novoUsuario);

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }
}

record LoginRequestDTO(String email, String senha) {}
record CadastroRequestDTO(String nome, String email, String senha) {}
record LoginResponseDTO(String mensagem, String nome, Long id, String token) {}