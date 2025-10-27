// src/main/java/io/bootify/taesmet_mtto/repos/RepuestoSolicitudRepository.java
package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.RepuestoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepuestoSolicitudRepository extends JpaRepository<RepuestoSolicitud, Long> {
    List<RepuestoSolicitud> findAllByOrderByCreadaEnDesc();
    boolean existsByMantenimientoId(Long mantenimientoId);
}