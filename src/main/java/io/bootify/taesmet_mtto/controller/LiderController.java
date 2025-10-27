// src/main/java/io/bootify/taesmet_mtto/controller/LiderController.java
package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.*;
import io.bootify.taesmet_mtto.repos.*;
import io.bootify.taesmet_mtto.util.TipoMaquinaLabel;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.List.of;

@Controller
@RequestMapping("/lider")
public class LiderController {

    private final MaquinaRepository maquinaRepo;
    private final UsuarioRepository usuarioRepo;
    private final MantenimientoRepository mantRepo;
    private final RepuestoSolicitudRepository repRepo;

    public LiderController(MaquinaRepository maquinaRepo,
            UsuarioRepository usuarioRepo,
            MantenimientoRepository mantRepo,
            RepuestoSolicitudRepository repRepo) {
        this.maquinaRepo = maquinaRepo;
        this.usuarioRepo = usuarioRepo;
        this.mantRepo = mantRepo;
        this.repRepo = repRepo;
    }

    /* ================= Dashboard ================= */
    @GetMapping({ "", "/" })
    public String dashboard(Model m) {
        long pendientes = mantRepo.countByEstado(EstadoMantenimiento.PENDIENTE);
        long enProceso = mantRepo.countByEstado(EstadoMantenimiento.EN_PROCESO);
        long realizados = mantRepo.countByEstado(EstadoMantenimiento.REALIZADO);
        long esperaRep = mantRepo.countByEstado(EstadoMantenimiento.EN_ESPERA_REPUESTOS);

        List<Mantenimiento> proximos = mantRepo
                .findByProgramadoParaGreaterThanEqualOrderByProgramadoParaAsc(
                        LocalDate.now(), PageRequest.of(0, 5))
                .getContent();

        m.addAttribute("pendientes", pendientes);
        m.addAttribute("enProceso", enProceso);
        m.addAttribute("realizados", realizados);
        m.addAttribute("esperaRepuestos", esperaRep);
        m.addAttribute("proximos", proximos);

        return "rol/lider";
    }

    @GetMapping("/maquinas/{id}/detalles")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDetallesMaquina(@PathVariable Long id) {
        try {
            return maquinaRepo.findById(id)
                    .map(this::maquinaToDetallesMap)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Map<String, Object> maquinaToDetallesMap(Maquina maquina) {
        Map<String, Object> detalles = new HashMap<>();
        detalles.put("id", maquina.getId());
        detalles.put("codigo", maquina.getCodigo());
        detalles.put("nombre", maquina.getNombre());
        detalles.put("tipo", maquina.getTipo().name());
        detalles.put("condicion", maquina.getCondicion().name());
        return detalles;
    }

    /* ============ Máquinas (ver/crear) ============ */
    @GetMapping("/maquinas")
    public String maquinas(
            @RequestParam(value = "tipo", required = false) TipoMaquina tipo,
            @RequestParam(value = "cond", required = false) CondicionMaquina condicion,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model m) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Maquina> pageData;

        if (tipo != null && condicion != null) {
            pageData = maquinaRepo.findByTipoAndCondicion(tipo, condicion, pageable);
        } else if (tipo != null) {
            pageData = maquinaRepo.findByTipo(tipo, pageable);
        } else if (condicion != null) {
            pageData = maquinaRepo.findByCondicion(condicion, pageable);
        } else {
            pageData = maquinaRepo.findAll(pageable);
        }

        m.addAttribute("page", pageData);
        m.addAttribute("maquinas", pageData.getContent());
        m.addAttribute("tipos", TipoMaquina.values());
        m.addAttribute("condiciones", CondicionMaquina.values());
        m.addAttribute("filtroTipo", tipo);
        m.addAttribute("filtroCond", condicion);
        return "lider/maquinas";
    }

    @PostMapping("/maquinas")
    public String crearMaquina(@RequestParam("tipo") TipoMaquina tipo,
            @RequestParam("condicion") CondicionMaquina condicion,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "tipoFilter", required = false) TipoMaquina tipoFilter,
            @RequestParam(value = "condFilter", required = false) CondicionMaquina condFilter) {

        long correl = maquinaRepo.countByTipoAndCondicion(tipo, condicion) + 1L;
        String sufijo = String.format("%03d", correl);
        String flag = (condicion == CondicionMaquina.NUEVA) ? "N" : "U";
        String codigo = tipo.name() + "-" + flag + "-" + sufijo;
        String nombre = TipoMaquinaLabel.descripcion(tipo) + " " + sufijo;

        int tries = 0;
        while (maquinaRepo.existsByCodigo(codigo) && tries < 5) {
            correl++;
            sufijo = String.format("%03d", correl);
            codigo = tipo.name() + "-" + flag + "-" + sufijo;
            tries++;
        }

        Maquina mq = new Maquina();
        mq.setTipo(tipo);
        mq.setCondicion(condicion);
        mq.setCodigo(codigo);
        mq.setNombre(nombre);
        maquinaRepo.save(mq);

        String back = String.format("redirect:/lider/maquinas?page=%d&size=%d%s%s",
                page, size,
                (tipoFilter != null ? "&tipo=" + tipoFilter : ""),
                (condFilter != null ? "&cond=" + condFilter : ""));
        return back;
    }

    /* ====== Asignar / Listar Mantenimiento ====== */
    @GetMapping("/mantenimientos")
    public String mantenimientos(
            @RequestParam(value = "maquinaId", required = false) Long maquinaId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model m) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Mantenimiento> data = (maquinaId != null)
                ? mantRepo.findByMaquinaId(maquinaId, pageable)
                : mantRepo.findAll(pageable);

        m.addAttribute("page", data);
        m.addAttribute("mantenimientos", data.getContent());
        m.addAttribute("tipos", TipoMantenimiento.values());
        m.addAttribute("estados", EstadoMantenimiento.values());
        m.addAttribute("maquinas", maquinaRepo.findAll());
        m.addAttribute("tecnicos", usuarioRepo.findTecnicosActivos());
        m.addAttribute("selMaquinaId", maquinaId);
        return "lider/mantenimientos";
    }

    @PostMapping("/mantenimientos/asignar")
    public String asignarMantenimiento(
            @RequestParam("maquinaId") @NotNull Long maquinaId,
            @RequestParam("tecnicoId") @NotNull Long tecnicoId,
            @RequestParam("tipo") TipoMantenimiento tipo,
            @RequestParam(value = "programadoPara", required = false) String programadoPara,
            @RequestParam(value = "descripcion", required = false) String descripcion) {
        Maquina maquina = maquinaRepo.findById(maquinaId).orElseThrow();
        Usuario tecnico = usuarioRepo.findById(tecnicoId).orElseThrow();

        boolean exists = mantRepo.existsByMaquinaAndTipoAndEstadoIn(
                maquina, tipo, of(EstadoMantenimiento.PENDIENTE, EstadoMantenimiento.EN_PROCESO));
        if (exists) {
            return "redirect:/lider/mantenimientos?error=duplicado";
        }

        Mantenimiento m = new Mantenimiento();
        m.setMaquina(maquina);
        m.setAsignadoA(tecnico);
        m.setTipo(tipo);
        m.setEstado(EstadoMantenimiento.PENDIENTE);
        if (programadoPara != null && !programadoPara.isBlank()) {
            m.setProgramadoPara(LocalDate.parse(programadoPara));
        }
        m.setDescripcion(descripcion);
        mantRepo.save(m);

        return "redirect:/lider/mantenimientos?ok";
    }

    /* ====== Repuestos solicitados ====== */
    @GetMapping("/repuestos")
    public String repuestos(Model m) {
        List<RepuestoSolicitud> solicitudes = repRepo.findAllByOrderByCreadaEnDesc();
        m.addAttribute("solicitudes", solicitudes);
        return "lider/repuestos";
    }
}