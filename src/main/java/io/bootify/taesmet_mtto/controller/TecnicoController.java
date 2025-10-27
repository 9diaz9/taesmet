package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.Mantenimiento;
import io.bootify.taesmet_mtto.domain.RepuestoSolicitud;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.MantenimientoRepository;
import io.bootify.taesmet_mtto.repos.RepuestoSolicitudRepository;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/tecnico")
public class TecnicoController {

    private final MantenimientoRepository mttoRepo;
    private final UsuarioRepository usuarioRepo;
    private final RepuestoSolicitudRepository solicitudRepo;

    public TecnicoController(
            MantenimientoRepository mttoRepo,
            UsuarioRepository usuarioRepo,
            RepuestoSolicitudRepository solicitudRepo
    ) {
        this.mttoRepo = mttoRepo;
        this.usuarioRepo = usuarioRepo;
        this.solicitudRepo = solicitudRepo;
    }

    /**
     * Lista de mantenimientos asignados al técnico autenticado.
     * URL: GET /tecnico/mios
     */
@GetMapping("/mios")
public String mios(@AuthenticationPrincipal User user, Model m) {
    if (user == null || user.getUsername() == null) {
        return "redirect:/login?error";
    }

    Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
    if (u == null) {
        return "redirect:/login?error";
    }

    // Mantenimientos asignados
    List<Mantenimiento> mttos = mttoRepo.findByAsignadoA_Id(u.getId());

    // ---- AQUI VA LO NUEVO (mapa: mttoId -> yaSolicitóRepuesto) ----
    java.util.Map<Long, Boolean> solicitados = new java.util.HashMap<>();
    for (Mantenimiento mt : mttos) {
        if (mt != null && mt.getId() != null) {
            boolean yaPidio = solicitudRepo.existsByMantenimientoId(mt.getId());
            solicitados.put(mt.getId(), yaPidio);
        }
    }
    // ---------------------------------------------------------------

    m.addAttribute("mttos", mttos);
    m.addAttribute("yo", u);
    m.addAttribute("solicitados", solicitados); // <- añade el mapa al modelo
    return "tecnico/mios";
}


    /**
     * Formulario de solicitud de repuesto para un mantenimiento.
     * URL: GET /tecnico/repuestos/solicitar/{mttoId}
     * Carga el mantenimiento para mostrar nombre/código sin pedirlos al usuario.
     */
    @GetMapping("/repuestos/solicitar/{mttoId}")
    public String solicitarForm(@PathVariable("mttoId") Long mttoId, Model model) {
        Mantenimiento mtto = mttoRepo.findById(mttoId).orElse(null);
        if (mtto == null) {
            return "redirect:/tecnico/mios?mttoNotFound";
        }
        model.addAttribute("mtto", mtto);
        return "tecnico/solicitud_repuesto"; // templates/tecnico/solicitud_repuesto.html
    }

    /**
     * Procesa la solicitud de repuesto.
     * URL: POST /tecnico/repuestos/solicitar
     * Autocompleta código de máquina desde el mantenimiento y setea un motivo por defecto.
     */
    @PostMapping("/repuestos/solicitar")
    public String solicitar(@RequestParam("mttoId") Long mttoId,
                            @RequestParam("descripcion") String descripcion) {

        Mantenimiento mtto = mttoRepo.findById(mttoId).orElse(null);
        if (mtto == null) return "redirect:/tecnico/mios?mttoNotFound";

        RepuestoSolicitud s = new RepuestoSolicitud();
        s.setMantenimiento(mtto);

        // Código de máquina desde el mantenimiento
        try {
            if (mtto.getMaquina() != null) {
                s.setCodigoMaquina(mtto.getMaquina().getCodigo());
            }
        } catch (Exception ignored) {}

        s.setDescripcion(descripcion);

        // Si tu columna MOTIVO es NOT NULL, damos un valor por defecto
        try { s.setMotivo("Solicitud de técnico"); } catch (Exception ignored) {}

        // Si tu entidad NO tiene @PrePersist para estos campos, los fijamos aquí
        try { s.setAprobado(false); } catch (Exception ignored) {}
        try { s.setCreadaEn(LocalDateTime.now()); } catch (Exception ignored) {}

        solicitudRepo.save(s);
        return "redirect:/tecnico/mios?solOk";
    }

    /**
     * Cambiar estado del mantenimiento (desde Mis Mantenimientos).
     * Enum: io.bootify.taesmet_mtto.domain.EstadoMantenimiento
     * Valores esperados: PENDIENTE, EN_CURSO (o EN_PROCESO), COMPLETADO (ajusta si difiere).
     */
    @PostMapping("/mttos/{id}/estado")
public String cambiarEstado(@PathVariable("id") Long id,
                            @RequestParam("nuevo") String nuevo) {
    Mantenimiento mt = mttoRepo.findById(id).orElse(null);
    if (mt != null && nuevo != null) {
        try {
            // Usa exactamente tus valores de enum:
            mt.setEstado(io.bootify.taesmet_mtto.domain.EstadoMantenimiento.valueOf(nuevo));
            mttoRepo.save(mt);
        } catch (IllegalArgumentException ignored) {
            // Si llega "EN_CURSO" pero el enum es EN_PROCESO, esto caería aquí.
        }
    }
    return "redirect:/tecnico/mios?estadoOk";
}
}
