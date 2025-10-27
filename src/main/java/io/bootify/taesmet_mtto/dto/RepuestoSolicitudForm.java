package io.bootify.taesmet_mtto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RepuestoSolicitudForm {

    @NotNull
    private Long mttoId;

    @NotBlank
    private String motivo;

    @NotBlank
    private String codigoMaquina;

    @NotBlank
    private String descripcion;

    public Long getMttoId() { return mttoId; }
    public void setMttoId(Long mttoId) { this.mttoId = mttoId; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getCodigoMaquina() { return codigoMaquina; }
    public void setCodigoMaquina(String codigoMaquina) { this.codigoMaquina = codigoMaquina; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
