// src/main/java/io/bootify/taesmet_mtto/controller/RolDashboardsController.java
package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.EstadoMantenimiento;
import io.bootify.taesmet_mtto.domain.Mantenimiento;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.MantenimientoRepository;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Controller
public class RolDashboardsController {

    private final UsuarioRepository usuarioRepository;
    private final MantenimientoRepository mantenimientoRepository;

    public RolDashboardsController(UsuarioRepository usuarioRepository,
                                    MantenimientoRepository mantenimientoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.mantenimientoRepository = mantenimientoRepository;
    }


    /** ÚNICA ruta en este controlador */
    @GetMapping("/tecnico")
    public String tecnicoHome(@AuthenticationPrincipal User auth, Model m) {
        if (auth == null || auth.getUsername() == null) return "redirect:/login?error";

        Usuario u = usuarioRepository.findByEmailIgnoreCase(auth.getUsername()).orElse(null);
        if (u == null) return "redirect:/login?error";

        List<Mantenimiento> mttos = mantenimientoRepository.findByAsignadoA_Id(u.getId());
        if (mttos == null) mttos = new ArrayList<>();

        int pendientes = 0, enProceso = 0, realizados = 0;

for (Mantenimiento mt : mttos) {
    EstadoMantenimiento e = mt.getEstado();
    if (e == EstadoMantenimiento.PENDIENTE) pendientes++;
    else if (e == EstadoMantenimiento.EN_PROCESO) enProceso++;
    else if (e == EstadoMantenimiento.REALIZADO) realizados++;
}

        mttos.sort(new Comparator<Mantenimiento>() {
            @Override public int compare(Mantenimiento a, Mantenimiento b) {
                long ida = a.getId() == null ? 0L : a.getId();
                long idb = b.getId() == null ? 0L : b.getId();
                return Long.compare(idb, ida);
            }
        });
        List<Mantenimiento> recientes = mttos.stream().limit(5).toList();

        m.addAttribute("yo", u);
       // m.addAttribute("total", total);
        m.addAttribute("pendientes", pendientes);
       // m.addAttribute("enCurso", enCurso);
        //m.addAttribute("completados", completados);
        m.addAttribute("recientes", recientes);

        return "rol/tecnico";
    }
}
