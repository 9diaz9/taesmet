package io.bootify.taesmet_mtto.dto;

import io.bootify.taesmet_mtto.domain.Rol;
import jakarta.validation.constraints.*;

public class UsuarioForm {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 60, message = "El nombre debe tener entre 2 y 60 caracteres")
    @Pattern(
        regexp = "^(?=.{2,60}$)(?!.*\\d)(?!.*\\b(?:jaja|jeje|jiji|jojo|haha|hehe|hihi|xd|ajaj|lol)\\b)(?!.*(.)\\1{3,})[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$",
        message = "Nombre inválido: usa solo letras y espacios; sin números, risas o repeticiones extrañas"
    )
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Pattern(
        regexp = "^(?=.{5,64}$)[A-Za-z]{2,}(?:[._-][A-Za-z]+)*@taesmet\\.com$",
        message = "Email inválido: use el dominio taesmet.com y al menos 2 letras antes de @"
    )
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 15, message = "La contraseña debe tener entre 8 y 15 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,15}$",
        message = "Debe incluir minúscula, mayúscula, dígito y un carácter especial"
    )
    private String plainPassword;

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

    // getters/setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = (email == null ? null : email.trim().toLowerCase()); }

    public String getPlainPassword() { return plainPassword; }
    public void setPlainPassword(String plainPassword) { this.plainPassword = plainPassword; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}
