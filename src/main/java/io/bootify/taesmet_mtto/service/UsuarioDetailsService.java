package io.bootify.taesmet_mtto.service;

import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public UsuarioDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario u = repo.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        if (!u.isActivo()) {
            throw new UsernameNotFoundException("Usuario inactivo");
        }
        return User.withUsername(u.getEmail())
                .password(u.getPassword())
                .roles(u.getRol().name()) // ADMIN/LIDER/TECNICO -> se mapea a ROLE_*
                .build();
    }
}
