package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
public class SolicitudRepuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Mantenimiento mantenimiento;

    @NotBlank
    private String motivo;

    @NotBlank
    private String codigoMaquina;

    @NotBlank
    @Column(length = 1000)
    private String descripcion;

    private boolean aprobado = false;

    @Column(length = 1000)
    private String observacionLider;

    private LocalDateTime creadaEn = LocalDateTime.now();

    // ===== Getters/Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Mantenimiento getMantenimiento() { return mantenimiento; }
    public void setMantenimiento(Mantenimiento mantenimiento) { this.mantenimiento = mantenimiento; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getCodigoMaquina() { return codigoMaquina; }
    public void setCodigoMaquina(String codigoMaquina) { this.codigoMaquina = codigoMaquina; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public boolean isAprobado() { return aprobado; }
    public void setAprobado(boolean aprobado) { this.aprobado = aprobado; }

    public String getObservacionLider() { return observacionLider; }
    public void setObservacionLider(String observacionLider) { this.observacionLider = observacionLider; }

    public LocalDateTime getCreadaEn() { return creadaEn; }
    public void setCreadaEn(LocalDateTime creadaEn) { this.creadaEn = creadaEn; }
}
