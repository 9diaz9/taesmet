
package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.*;
import io.bootify.taesmet_mtto.repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/lider")
public class LiderController {
    @Autowired private MantenimientoRepository mttoRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private SolicitudRepuestoRepository repRepo;

    @GetMapping("/asignaciones")
    public String asignaciones(Model m) {
        m.addAttribute("mttos", mttoRepo.findAll());
        m.addAttribute("tecnicos", usuarioRepo.findAll().stream().filter(u -> u.getRol()==Rol.TECNICO).toList());
        return "lider/asignaciones";
    }

    @PostMapping("/mttos/{id}/asignar")
    public String asignar(@PathVariable Long id, @RequestParam Long tecnicoId) {
        var mtto = mttoRepo.findById(id).orElseThrow();
        var tec = usuarioRepo.findById(tecnicoId).orElseThrow();
        mtto.setAsignadoA(tec);
        mttoRepo.save(mtto);
        return "redirect:/lider/asignaciones";
    }

    @GetMapping("/repuestos")
    public String repuestos(Model m) {
        m.addAttribute("pendientes", repRepo.findByAprobado(false));
        m.addAttribute("aprobados", repRepo.findByAprobado(true));
        return "lider/repuestos";
    }

    @PostMapping("/repuestos/{id}/aprobar")
    public String aprobar(@PathVariable Long id, @RequestParam String observacion) {
        var s = repRepo.findById(id).orElseThrow();
        s.setAprobado(true); s.setObservacionLider(observacion);
        repRepo.save(s);
        return "redirect:/lider/repuestos";
    }
}
