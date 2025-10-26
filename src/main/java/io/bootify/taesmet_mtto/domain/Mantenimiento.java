package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // máquina a la que aplica
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Maquina maquina;

    // técnico asignado (Usuario con rol TECNICO)
    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario asignadoA;

    @Enumerated(EnumType.STRING)
    private TipoMantenimiento tipo;

    @Enumerated(EnumType.STRING)
    private EstadoMantenimiento estado;

    private LocalDate programadoPara;
    private LocalDateTime creadoEn = LocalDateTime.now();

    @Column(length = 1000)
    private String descripcion;

    // getters/setters
    public Long getId() { return id; }
    public Maquina getMaquina() { return maquina; }
    public void setMaquina(Maquina maquina) { this.maquina = maquina; }
    public Usuario getAsignadoA() { return asignadoA; }
    public void setAsignadoA(Usuario asignadoA) { this.asignadoA = asignadoA; }
    public TipoMantenimiento getTipo() { return tipo; }
    public void setTipo(TipoMantenimiento tipo) { this.tipo = tipo; }
    public EstadoMantenimiento getEstado() { return estado; }
    public void setEstado(EstadoMantenimiento estado) { this.estado = estado; }
    public LocalDate getProgramadoPara() { return programadoPara; }
    public void setProgramadoPara(LocalDate programadoPara) { this.programadoPara = programadoPara; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
