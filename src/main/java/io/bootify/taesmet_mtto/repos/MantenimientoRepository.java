package io.bootify.taesmet_mtto.repos;
import org.springframework.data.jpa.repository.*;
import io.bootify.taesmet_mtto.domain.*; 
import java.util.*; 

public interface MantenimientoRepository extends JpaRepository<Mantenimiento,Long>{ 
    List<Mantenimiento> findByAsignadoA_Id(Long usuarioId); 
}
