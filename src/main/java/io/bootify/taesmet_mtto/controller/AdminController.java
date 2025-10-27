package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.CondicionMaquina;
import io.bootify.taesmet_mtto.domain.Maquina;
import io.bootify.taesmet_mtto.domain.Rol;
import io.bootify.taesmet_mtto.domain.TipoMaquina;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.MaquinaRepository;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import io.bootify.taesmet_mtto.util.TipoMaquinaLabel;
import io.bootify.taesmet_mtto.dto.UsuarioForm;

import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UsuarioRepository usuarioRepo;
    private final MaquinaRepository maquinaRepo;
    private final PasswordEncoder encoder;

    public AdminController(UsuarioRepository usuarioRepo,
                            MaquinaRepository maquinaRepo,
                            PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo;
        this.maquinaRepo = maquinaRepo;
        this.encoder = encoder;
    }

    /* ======================= DASHBOARD ======================= */
    @GetMapping({"", "/"})
    public String adminHome() {
        return "admin/dashboard";
    }

    /* ======================= USUARIOS ======================== */
    @GetMapping("/usuarios")
    public String usuarios(Model m) {
        m.addAttribute("usuarios", usuarioRepo.findAll());
        m.addAttribute("usuarioForm", new UsuarioForm());   // <-- usa DTO
        m.addAttribute("roles", Rol.values());
        return "admin/usuarios";
    }

    @PostMapping("/usuarios")
    public String crearUsuario(@Valid @ModelAttribute("usuarioForm") UsuarioForm form,
                                BindingResult br,
                                Model m) {

        // email único
        if (!br.hasErrors() && usuarioRepo.findByEmailIgnoreCase(form.getEmail()).isPresent()) {
            br.rejectValue("email", "email.duplicado", "Ese email ya está registrado");
        }

        if (br.hasErrors()) {
            m.addAttribute("usuarios", usuarioRepo.findAll());
            m.addAttribute("roles", Rol.values());
            return "admin/usuarios";
        }

        // mapear DTO -> Entidad
        Usuario u = new Usuario();
        u.setNombre(form.getNombre());
        u.setEmail(form.getEmail());
        u.setRol(form.getRol());
        u.setActivo(true);
        u.setPassword(encoder.encode(form.getPlainPassword())); // encriptar

        usuarioRepo.save(u);
        return "redirect:/admin/usuarios?ok";
    }

    @PostMapping("/usuarios/{id}/eliminar")
    public String eliminarUsuario(@PathVariable("id") Long id) {
        usuarioRepo.deleteById(id);
        return "redirect:/admin/usuarios?ok";
    }

    /* ============== MÁQUINAS: LISTA + FILTROS + PAGINACIÓN ============== */
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
        return "admin/maquinas";
    }

    /* ===== CREAR (solo selects, genera código/nombre automático) ===== */
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

        String back = String.format("redirect:/admin/maquinas?page=%d&size=%d%s%s",
                page, size,
                (tipoFilter != null ? "&tipo=" + tipoFilter : ""),
                (condFilter != null ? "&cond=" + condFilter : ""));
        return back;
    }

    /* ===== DUPLICAR ===== */
    @PostMapping("/maquinas/{id}/duplicar")
    public String duplicar(@PathVariable Long id,
                            @RequestParam(value = "page", defaultValue = "0") int page,
                            @RequestParam(value = "size", defaultValue = "10") int size,
                            @RequestParam(value = "tipo", required = false) TipoMaquina currentTipo,
                            @RequestParam(value = "cond", required = false) CondicionMaquina currentCond) {
        Maquina found = maquinaRepo.findById(id).orElseThrow();
        return "redirect:/admin/maquinas?page=" + page + "&size=" + size +
                "&prefTipo=" + found.getTipo() + "&prefCond=" + found.getCondicion() +
                (currentTipo != null ? "&tipo=" + currentTipo : "") +
                (currentCond != null ? "&cond=" + currentCond : "");
    }

    /* ===== ELIMINAR ===== */
    @PostMapping("/maquinas/{id}/eliminar")
    public String eliminarMaquina(@PathVariable("id") Long id,
                                    @RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "10") int size,
                                    @RequestParam(value = "tipo", required = false) TipoMaquina tipo,
                                    @RequestParam(value = "cond", required = false) CondicionMaquina cond) {
        maquinaRepo.deleteById(id);
        return "redirect:/admin/maquinas?page=" + page + "&size=" + size +
                (tipo != null ? "&tipo=" + tipo : "") +
                (cond != null ? "&cond=" + cond : "");
    }

    /* ===== EXPORT CSV ===== */
    @GetMapping(value = "/maquinas/export.csv", produces = "text/csv")
    @ResponseBody
    public org.springframework.http.ResponseEntity<byte[]> exportCsv(
            @RequestParam(value = "tipo", required = false) TipoMaquina tipo,
            @RequestParam(value = "cond", required = false) CondicionMaquina condicion) {

        List<Maquina> list =
                (tipo != null && condicion != null)
                        ? maquinaRepo.findByTipoAndCondicion(tipo, condicion, Pageable.unpaged()).getContent()
                        : (tipo != null)
                            ? maquinaRepo.findByTipo(tipo, Pageable.unpaged()).getContent()
                            : (condicion != null)
                                ? maquinaRepo.findByCondicion(condicion, Pageable.unpaged()).getContent()
                                : maquinaRepo.findAll();

        String header = "id,codigo,nombre,tipo,condicion\n";
        String body = list.stream()
                .map(x -> x.getId() + "," + x.getCodigo() + "," + escape(x.getNombre()) + "," + x.getTipo() + "," + x.getCondicion())
                .collect(Collectors.joining("\n"));

        String csv = header + body;
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        String filename = "maquinas_" + LocalDateTime.now() + ".csv";

        return org.springframework.http.ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(bytes);
    }

    private static String escape(String v) {
        if (v == null) return "";
        if (v.contains(",") || v.contains("\"")) {
            String safe = v.replace("\"", "\"\"");
            return "\"" + safe + "\"";
        }
        return v;
    }
}
