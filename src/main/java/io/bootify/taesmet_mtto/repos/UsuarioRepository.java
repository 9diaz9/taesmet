package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmailIgnoreCase(String email);
@Query("select u from Usuario u where u.rol = io.bootify.taesmet_mtto.domain.Rol.TECNICO and u.activo = true")
List<Usuario> findTecnicosActivos();
}
