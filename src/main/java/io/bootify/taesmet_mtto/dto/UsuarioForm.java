package io.bootify.taesmet_mtto.dto;

import io.bootify.taesmet_mtto.domain.Rol;
import jakarta.validation.constraints.*;

public class UsuarioForm {

    @NotBlank(message = "no debe estar vacío")
    @Size(min = 2, max = 60)
    private String nombre;

    @NotBlank(message = "no debe estar vacío")
    @Pattern(regexp = "(?=.{5,64}$)[A-Za-z]{2,}(?:[._-][A-Za-z]+)*@taesmet\\.com",
             message = "debe ser del dominio taesmet.com")
    private String email;

    @NotBlank(message = "no debe estar vacío")
    @Size(min = 8, max = 15, message = "8–15 caracteres")
    @Pattern(regexp = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,15}",
             message = "debe contener minúscula, mayúscula, dígito y carácter especial")
    private String plainPassword;

    @NotNull(message = "no debe estar vacío")
    private Rol rol;

    // getters/setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPlainPassword() { return plainPassword; }
    public void setPlainPassword(String plainPassword) { this.plainPassword = plainPassword; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}
