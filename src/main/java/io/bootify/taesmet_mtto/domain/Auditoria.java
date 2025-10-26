package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Auditoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entidad;
    private Long entidadId;
    private String accion; // CREAR, ACTUALIZAR_ESTADO, APROBAR_REPUESTO...
    private String usuario;
    private LocalDateTime fecha = LocalDateTime.now();
    @Column(length=1000) private String detalle;
}
