package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.RepuestoSolicitud;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.domain.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepuestoSolicitudRepository extends JpaRepository<RepuestoSolicitud, Long> {

    List<RepuestoSolicitud> findAllByOrderByCreadaEnDesc();

    boolean existsByMantenimientoId(Long mantenimientoId);

    @Query("SELECT rs FROM RepuestoSolicitud rs WHERE rs.mantenimiento.asignadoA = :tecnico ORDER BY rs.creadaEn DESC")
    List<RepuestoSolicitud> findByMantenimientoAsignadoAOrderByCreadaEnDesc(@Param("tecnico") Usuario tecnico);

    // Nuevos métodos para el líder
    List<RepuestoSolicitud> findByEstadoOrderByCreadaEnDesc(EstadoSolicitud estado);

    long countByEstado(EstadoSolicitud estado);
}