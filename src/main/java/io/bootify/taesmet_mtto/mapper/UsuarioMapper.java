package io.bootify.taesmet_mtto.mapper;

import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.dto.UsuarioForm;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    private final PasswordEncoder encoder;

    public UsuarioMapper(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    public Usuario toEntity(UsuarioForm form) {
        Usuario u = new Usuario();
        u.setNombre(form.getNombre());
        u.setEmail(form.getEmail());
        u.setPassword(encoder.encode(form.getPlainPassword()));
        u.setRol(form.getRol());
        u.setActivo(true);
        return u;
    }
}
