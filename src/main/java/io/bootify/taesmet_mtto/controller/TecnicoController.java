// src/main/java/io/bootify/taesmet_mtto/controller/TecnicoController.java
package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.*;
import io.bootify.taesmet_mtto.repos.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/tecnico")
public class TecnicoController {

    private final MantenimientoRepository mttoRepo;
    private final UsuarioRepository usuarioRepo;
    private final RepuestoSolicitudRepository solicitudRepo;

    public TecnicoController(
            MantenimientoRepository mttoRepo,
            UsuarioRepository usuarioRepo,
            RepuestoSolicitudRepository solicitudRepo) {
        this.mttoRepo = mttoRepo;
        this.usuarioRepo = usuarioRepo;
        this.solicitudRepo = solicitudRepo;
    }

    /**
     * Página de inicio del técnico
     */
    @GetMapping
    public String home(@AuthenticationPrincipal User user, Model model) {
        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        // Obtener estadísticas del técnico
        List<Mantenimiento> mantenimientos = mttoRepo.findByAsignadoA_Id(u.getId());

        long pendientes = mantenimientos.stream()
                .filter(m -> m.getEstado() == EstadoMantenimiento.PENDIENTE)
                .count();

        long enProceso = mantenimientos.stream()
                .filter(m -> m.getEstado() == EstadoMantenimiento.EN_PROCESO)
                .count();

        long completados = mantenimientos.stream()
                .filter(m -> m.getEstado() == EstadoMantenimiento.COMPLETADO)
                .count();

        // Obtener mantenimientos recientes (últimos 5)
        List<Mantenimiento> recientes = mantenimientos.stream()
                .sorted((m1, m2) -> m2.getCreadoEn().compareTo(m1.getCreadoEn()))
                .limit(5)
                .collect(Collectors.toList());

        model.addAttribute("yo", u);
        model.addAttribute("pendientes", pendientes);
        model.addAttribute("enProceso", enProceso);
        model.addAttribute("completados", completados);
        model.addAttribute("recientes", recientes);

        return "tecnico/home_tecnico";
    }

    /**
     * Lista de mantenimientos asignados al técnico
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

        List<Mantenimiento> mttos = mttoRepo.findByAsignadoA_Id(u.getId());

        // Mapa: mttoId -> yaSolicitóRepuesto
        Map<Long, Boolean> solicitados = new HashMap<>();
        for (Mantenimiento mt : mttos) {
            if (mt != null && mt.getId() != null) {
                boolean yaPidio = solicitudRepo.existsByMantenimientoId(mt.getId());
                solicitados.put(mt.getId(), yaPidio);
            }
        }

        m.addAttribute("mttos", mttos);
        m.addAttribute("yo", u);
        m.addAttribute("solicitados", solicitados);
        return "tecnico/mios";
    }

    /**
     * MIS SOLICITUDES - Ver todas las solicitudes del técnico
     */
    @GetMapping("/mis-solicitudes")
    public String misSolicitudes(@AuthenticationPrincipal User user, Model model) {
        System.out.println("🎯 === EJECUTANDO MIS_SOLICITUDES ===");

        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        // Obtener todas las solicitudes del técnico
        List<RepuestoSolicitud> solicitudes = solicitudRepo.findByMantenimientoAsignadoAOrderByCreadaEnDesc(u);
        System.out.println("🎯 Solicitudes encontradas: " + solicitudes.size());

        model.addAttribute("solicitudes", solicitudes);
        model.addAttribute("yo", u);

        return "tecnico/mis_solicitudes";
    }

    /**
     * Página para seleccionar mantenimiento y crear solicitud
     */
    @GetMapping("/crear-solicitud")
    public String crearSolicitudSeleccion(@AuthenticationPrincipal User user, Model model) {
        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        // Obtener mantenimientos del técnico que estén activos
        List<Mantenimiento> mttos = mttoRepo.findByAsignadoA_Id(u.getId()).stream()
                .filter(m -> m.getEstado() == EstadoMantenimiento.PENDIENTE ||
                        m.getEstado() == EstadoMantenimiento.EN_PROCESO ||
                        m.getEstado() == EstadoMantenimiento.EN_ESPERA_REPUESTOS)
                .collect(Collectors.toList());

        model.addAttribute("mttos", mttos);
        model.addAttribute("yo", u);
        return "tecnico/seleccionar_mtto_solicitud";
    }

    /**
     * Formulario de solicitud de repuesto para un mantenimiento
     */
    @GetMapping("/repuestos/solicitar/{mttoId}")
    public String solicitarForm(@PathVariable("mttoId") Long mttoId,
            @AuthenticationPrincipal User user,
            Model model) {
        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        Mantenimiento mtto = mttoRepo.findById(mttoId).orElse(null);
        if (mtto == null) {
            return "redirect:/tecnico/crear-solicitud?error=mttoNotFound";
        }

        // Verificar que el mantenimiento pertenece al técnico
        if (!mtto.getAsignadoA().getId().equals(u.getId())) {
            return "redirect:/tecnico/crear-solicitud?error=noAutorizado";
        }

        model.addAttribute("mtto", mtto);
        model.addAttribute("yo", u);
        return "tecnico/solicitud_repuesto";
    }

    /**
     * Procesa la solicitud de repuesto - CON TODOS LOS CAMPOS
     */
    @PostMapping("/repuestos/solicitar")
    public String solicitar(@RequestParam("mttoId") Long mttoId,
            @RequestParam("motivo") String motivo,
            @RequestParam("codigoMaquina") String codigoMaquina,
            @RequestParam("descripcion") String descripcion,
            @AuthenticationPrincipal User user,
            RedirectAttributes redirectAttributes) {

        System.out.println("🎯 === INICIANDO CREACIÓN DE SOLICITUD ===");
        System.out.println("🎯 mttoId: " + mttoId);
        System.out.println("🎯 motivo: " + motivo);
        System.out.println("🎯 codigoMaquina: " + codigoMaquina);
        System.out.println("🎯 descripcion: " + descripcion);

        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        Mantenimiento mtto = mttoRepo.findById(mttoId).orElse(null);
        if (mtto == null) {
            redirectAttributes.addFlashAttribute("error", "Mantenimiento no encontrado");
            return "redirect:/tecnico/crear-solicitud";
        }

        // Verificar que el mantenimiento pertenece al técnico
        if (!mtto.getAsignadoA().getId().equals(u.getId())) {
            redirectAttributes.addFlashAttribute("error", "No tienes permisos para este mantenimiento");
            return "redirect:/tecnico/crear-solicitud";
        }

        try {
            RepuestoSolicitud solicitud = new RepuestoSolicitud();
            solicitud.setMantenimiento(mtto);
            solicitud.setMotivo(motivo);
            solicitud.setCodigoMaquina(codigoMaquina);
            solicitud.setDescripcion(descripcion);
            solicitud.setAprobado(false);
            solicitud.setCreadaEn(LocalDateTime.now());

            solicitudRepo.save(solicitud);

            // Cambiar estado del mantenimiento a "En espera de repuestos"
            mtto.setEstado(EstadoMantenimiento.EN_ESPERA_REPUESTOS);
            mttoRepo.save(mtto);

            redirectAttributes.addFlashAttribute("success", "Solicitud de repuesto creada exitosamente");
            return "redirect:/tecnico/mis-solicitudes";

        } catch (Exception e) {
            System.out.println("❌ Error al crear solicitud: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "Error al crear la solicitud: " + e.getMessage());
            return "redirect:/tecnico/crear-solicitud";
        }
    }

    /**
     * Cambiar estado del mantenimiento
     */
    @PostMapping("/mttos/{id}/estado")
    public String cambiarEstado(@PathVariable("id") Long id,
            @RequestParam("nuevo") String nuevo,
            @AuthenticationPrincipal User user) {

        if (user == null || user.getUsername() == null) {
            return "redirect:/login?error";
        }

        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
        if (u == null) {
            return "redirect:/login?error";
        }

        Mantenimiento mt = mttoRepo.findById(id).orElse(null);
        if (mt != null && nuevo != null) {
            // Verificar que el mantenimiento pertenece al técnico
            if (mt.getAsignadoA().getId().equals(u.getId())) {
                try {
                    mt.setEstado(EstadoMantenimiento.valueOf(nuevo));
                    mttoRepo.save(mt);
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
        return "redirect:/tecnico/mios?estadoOk";
    }
}