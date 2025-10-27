package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import io.bootify.taesmet_mtto.domain.Mantenimiento;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {

    long countByEstado(EstadoMantenimiento estado);

    boolean existsByMaquinaAndTipoAndEstadoIn(
            Maquina maquina,
            TipoMantenimiento tipo,
            Collection<EstadoMantenimiento> estados
    );

        List<Mantenimiento> findByAsignadoA_Id(Long asignadoAId);
    Page<Mantenimiento> findByMaquinaId(Long maquinaId, Pageable pageable);

    // <-- NUEVO: versión con Pageable (recomendada)
    Page<Mantenimiento> findByProgramadoParaGreaterThanEqualOrderByProgramadoParaAsc(
            LocalDate fecha, Pageable pageable
    );

    // (opcional) Si prefieres sin Pageable, puedes tener también:
    // List<Mantenimiento> findTop5ByProgramadoParaAfterOrderByProgramadoParaAsc(LocalDate fecha);
}
