package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class RepuestoSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // relación al mantenimiento (ajusta el nombre de columna si ya existe)
    @ManyToOne(optional = false)
    @JoinColumn(name = "mantenimiento_id")
    private Mantenimiento mantenimiento;

    @Column(length = 150, nullable = false)
    private String motivo;

    @Column(length = 60, nullable = false)
    private String codigoMaquina;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Boolean aprobado = Boolean.FALSE;

    @Column(nullable = false)
    private LocalDateTime creadaEn = LocalDateTime.now();

    /* ===== Getters/Setters ===== */

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

    public Boolean getAprobado() { return aprobado; }
    public void setAprobado(Boolean aprobado) { this.aprobado = aprobado; }

    public LocalDateTime getCreadaEn() { return creadaEn; }
    public void setCreadaEn(LocalDateTime creadaEn) { this.creadaEn = creadaEn; }
}
