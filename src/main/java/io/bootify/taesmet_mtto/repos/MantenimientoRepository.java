package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {

    long countByEstado(EstadoMantenimiento estado);

    boolean existsByMaquinaAndTipoAndEstadoIn(
            Maquina maquina,
            TipoMantenimiento tipo,
            Collection<EstadoMantenimiento> estados
    );

    Page<Mantenimiento> findByMaquinaId(Long maquinaId, Pageable pageable);

    // <-- NUEVO: versión con Pageable (recomendada)
    Page<Mantenimiento> findByProgramadoParaGreaterThanEqualOrderByProgramadoParaAsc(
            LocalDate fecha, Pageable pageable
    );

    // (opcional) Si prefieres sin Pageable, puedes tener también:
    // List<Mantenimiento> findTop5ByProgramadoParaAfterOrderByProgramadoParaAsc(LocalDate fecha);
}
