package io.bootify.taesmet_mtto.config;

import io.bootify.taesmet_mtto.domain.Rol;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner{

    private final UsuarioRepository repo;
    private final PasswordEncoder enc;

    public DataLoader(UsuarioRepository repo, PasswordEncoder enc) {
        this.repo = repo;
        this.enc = enc;
    }

    @Override
    public void run(ApplicationArguments args) {
        seed("admin@taesmet.com",  "Admin",   "Admin#123",   Rol.ADMIN);
        seed("lider@taesmet.com",  "Líder",   "Lider#123",   Rol.LIDER);
        seed("tecnico@taesmet.com","Técnico", "Tecnico#123", Rol.TECNICO);
    }

    private void seed(String email, String nombre, String rawPwd, Rol rol) {
        if (repo.findByEmailIgnoreCase(email).isEmpty()) {
            Usuario u = new Usuario();                 // <- sin 'var'
            u.setNombre(nombre);
            u.setEmail(email);
            u.setPassword(enc.encode(rawPwd));         // BCrypt cabe en VARCHAR(60)
            u.setRol(rol);
            u.setActivo(true);
            repo.save(u);
        }
    }
}
