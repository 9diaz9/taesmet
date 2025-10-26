package io.bootify.taesmet_mtto.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Maquina {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(unique = true, length = 50)
    private String codigo;

    @NotBlank @Column(length = 120)
    private String nombre;

    @NotNull @Enumerated(EnumType.STRING)
    private TipoMaquina tipo;

    @NotNull @Enumerated(EnumType.STRING)
    private CondicionMaquina condicion;


    // getters/setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public TipoMaquina getTipo() {
        return tipo;
    }
    public void setTipo(TipoMaquina tipo) {
        this.tipo = tipo;
    }

    public CondicionMaquina getCondicion() {
        return condicion;
    }

    public void setCondicion(CondicionMaquina condicion) {
        this.condicion = condicion;
    }
    
}