package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.Mantenimiento;
import io.bootify.taesmet_mtto.domain.SolicitudRepuesto;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.MantenimientoRepository;
import io.bootify.taesmet_mtto.repos.SolicitudRepuestoRepository;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/tecnico")
public class TecnicoController {

    private final MantenimientoRepository mttoRepo;
    private final UsuarioRepository usuarioRepo;
    private final SolicitudRepuestoRepository repRepo;

    public TecnicoController(MantenimientoRepository mttoRepo,
                            UsuarioRepository usuarioRepo,
                            SolicitudRepuestoRepository repRepo) {
        this.mttoRepo = mttoRepo;
        this.usuarioRepo = usuarioRepo;
        this.repRepo = repRepo;
    }

    @GetMapping("/mios")
    public String mios(@AuthenticationPrincipal User user, Model m) {
        // IMPORTANTE: usa findByEmailIgnoreCase si así está definido tu repositorio
        Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElseThrow();
        m.addAttribute("mttos", mttoRepo.findByAsignadoA_Id(u.getId()));
        return "tecnico/mios"; // templates/tecnico/mios.html
    }

    @GetMapping("/repuestos/solicitar/{mttoId}")
    public String solicitarForm(@PathVariable("mttoId") Long mttoId, Model model) {
        model.addAttribute("mttoId", mttoId);
        return "tecnico/solicitud_repuesto"; // templates/tecnico/solicitud_repuesto.html
    }

    @PostMapping("/repuestos/solicitar")
    public String solicitar(@RequestParam("mttoId") Long mttoId,
                            @RequestParam("motivo") String motivo,
                            @RequestParam("codigoMaquina") String codigoMaquina,
                            @RequestParam("descripcion") String descripcion) {

        Mantenimiento mtto = mttoRepo.findById(mttoId).orElseThrow();

        // Construcción explícita (sin Lombok builder)
        SolicitudRepuesto s = new SolicitudRepuesto();
        s.setMantenimiento(mtto);
        s.setMotivo(motivo);
        s.setCodigoMaquina(codigoMaquina);
        s.setDescripcion(descripcion);
        // campos por defecto (aprobado=false, creadaEn=now) los debe setear la entidad

        repRepo.save(s);
        return "redirect:/tecnico/mios";
    }
}