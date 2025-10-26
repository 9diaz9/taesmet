package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

@Entity
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Maquina maquina;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoMtto tipo;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<EjecucionTag> ejecucion;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Periodicidad periodicidad;

    @NotBlank
    @Column(length = 1000)
    private String descripcionEjecucion;

    @NotNull
    private LocalDate fechaProgramada;

    @Enumerated(EnumType.STRING)
    private EstadoMtto estado = EstadoMtto.EN_ESPERA;

    @ManyToOne
    private Usuario asignadoA; // técnico

    // ===== Getters/Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Maquina getMaquina() { return maquina; }
    public void setMaquina(Maquina maquina) { this.maquina = maquina; }

    public TipoMtto getTipo() { return tipo; }
    public void setTipo(TipoMtto tipo) { this.tipo = tipo; }

    public Set<EjecucionTag> getEjecucion() { return ejecucion; }
    public void setEjecucion(Set<EjecucionTag> ejecucion) { this.ejecucion = ejecucion; }

    public Periodicidad getPeriodicidad() { return periodicidad; }
    public void setPeriodicidad(Periodicidad periodicidad) { this.periodicidad = periodicidad; }

    public String getDescripcionEjecucion() { return descripcionEjecucion; }
    public void setDescripcionEjecucion(String descripcionEjecucion) { this.descripcionEjecucion = descripcionEjecucion; }

    public LocalDate getFechaProgramada() { return fechaProgramada; }
    public void setFechaProgramada(LocalDate fechaProgramada) { this.fechaProgramada = fechaProgramada; }

    public EstadoMtto getEstado() { return estado; }
    public void setEstado(EstadoMtto estado) { this.estado = estado; }

    public Usuario getAsignadoA() { return asignadoA; }
    public void setAsignadoA(Usuario asignadoA) { this.asignadoA = asignadoA; }
}
