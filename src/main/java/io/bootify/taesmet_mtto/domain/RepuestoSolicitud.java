package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class RepuestoSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // opcionalmente ligada a un mantenimiento
    @ManyToOne(fetch = FetchType.LAZY)
    private Mantenimiento mantenimiento;

    // técnico que la pide
    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario solicitadoPor;

    // máquina afectada (rápido para filtrar)
    @ManyToOne(fetch = FetchType.LAZY)
    private Maquina maquina;

    private String repuesto;
    private Integer cantidad;

    // estados simples: PENDIENTE, APROBADO, RECHAZADO, ENTREGADO
    private String estado = "PENDIENTE";

    private LocalDateTime creadoEn = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public Mantenimiento getMantenimiento() { return mantenimiento; }
    public void setMantenimiento(Mantenimiento mantenimiento) { this.mantenimiento = mantenimiento; }
    public Usuario getSolicitadoPor() { return solicitadoPor; }
    public void setSolicitadoPor(Usuario solicitadoPor) { this.solicitadoPor = solicitadoPor; }
    public Maquina getMaquina() { return maquina; }
    public void setMaquina(Maquina maquina) { this.maquina = maquina; }
    public String getRepuesto() { return repuesto; }
    public void setRepuesto(String repuesto) { this.repuesto = repuesto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
