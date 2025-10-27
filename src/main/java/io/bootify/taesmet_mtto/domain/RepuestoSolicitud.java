package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "repuesto_solicitud")
public class RepuestoSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "mantenimiento_id")
    private Mantenimiento mantenimiento;

    @Column(length = 150, nullable = false)
    private String motivo;

    @Column(length = 60, nullable = false)
    private String codigoMaquina;

    @Column(length = 500)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    @Column(nullable = false)
    private Boolean aprobado = Boolean.FALSE;

    @Column(nullable = false)
    private LocalDateTime creadaEn = LocalDateTime.now();

    @Column
    private LocalDateTime actualizadaEn;

    @Column(length = 500)
    private String observaciones; // Para que el líder agregue comentarios

    /* ===== Getters/Setters ===== */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mantenimiento getMantenimiento() {
        return mantenimiento;
    }

    public void setMantenimiento(Mantenimiento mantenimiento) {
        this.mantenimiento = mantenimiento;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getCodigoMaquina() {
        return codigoMaquina;
    }

    public void setCodigoMaquina(String codigoMaquina) {
        this.codigoMaquina = codigoMaquina;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
        this.actualizadaEn = LocalDateTime.now();
    }

    public Boolean getAprobado() {
        return aprobado;
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
        this.actualizadaEn = LocalDateTime.now();
    }

    public LocalDateTime getCreadaEn() {
        return creadaEn;
    }

    public void setCreadaEn(LocalDateTime creadaEn) {
        this.creadaEn = creadaEn;
    }

    public LocalDateTime getActualizadaEn() {
        return actualizadaEn;
    }

    public void setActualizadaEn(LocalDateTime actualizadaEn) {
        this.actualizadaEn = actualizadaEn;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}