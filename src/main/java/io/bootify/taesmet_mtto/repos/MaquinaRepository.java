package io.bootify.taesmet_mtto.repos;

import io.bootify.taesmet_mtto.domain.CondicionMaquina;
import io.bootify.taesmet_mtto.domain.Maquina;
import io.bootify.taesmet_mtto.domain.TipoMaquina;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaquinaRepository extends JpaRepository<Maquina, Long> {

    Page<Maquina> findByTipo(TipoMaquina tipo, Pageable pageable);

    Page<Maquina> findByCondicion(CondicionMaquina condicion, Pageable pageable);

    Page<Maquina> findByTipoAndCondicion(TipoMaquina tipo, CondicionMaquina condicion, Pageable pageable);

    long countByTipoAndCondicion(TipoMaquina tipo, CondicionMaquina condicion);

    boolean existsByCodigo(String codigo);
}
