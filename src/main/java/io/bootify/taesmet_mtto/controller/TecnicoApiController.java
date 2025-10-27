package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.RepuestoSolicitud;
import io.bootify.taesmet_mtto.domain.Usuario;
import io.bootify.taesmet_mtto.repos.RepuestoSolicitudRepository;
import io.bootify.taesmet_mtto.repos.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tecnico")
public class TecnicoApiController {

    private final UsuarioRepository usuarioRepo;
    private final RepuestoSolicitudRepository solicitudRepo;

    public TecnicoApiController(
            UsuarioRepository usuarioRepo,
            RepuestoSolicitudRepository solicitudRepo) {
        this.usuarioRepo = usuarioRepo;
        this.solicitudRepo = solicitudRepo;
    }

    /**
     * API para obtener las solicitudes del técnico
     */
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> getMisSolicitudes(@AuthenticationPrincipal User user) {
        try {
            if (user == null || user.getUsername() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
            }

            Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
            if (u == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            }

            List<RepuestoSolicitud> solicitudes = solicitudRepo.findByMantenimientoAsignadoAOrderByCreadaEnDesc(u);

            // Crear respuesta simplificada para JSON
            List<Map<String, Object>> response = solicitudes.stream().map(sol -> {
                Map<String, Object> solMap = new HashMap<>();
                solMap.put("id", sol.getId());
                solMap.put("motivo", sol.getMotivo());
                solMap.put("codigoMaquina", sol.getCodigoMaquina());
                solMap.put("descripcion", sol.getDescripcion());
                solMap.put("estado", sol.getEstado().toString());
                solMap.put("creadaEn", sol.getCreadaEn());
                solMap.put("actualizadaEn", sol.getActualizadaEn());
                solMap.put("observaciones", sol.getObservaciones());
                solMap.put("aprobado", sol.getAprobado());

                // Información del mantenimiento
                if (sol.getMantenimiento() != null) {
                    Map<String, Object> mttoMap = new HashMap<>();
                    mttoMap.put("id", sol.getMantenimiento().getId());
                    mttoMap.put("tipo", sol.getMantenimiento().getTipo());
                    mttoMap.put("estado", sol.getMantenimiento().getEstado());

                    if (sol.getMantenimiento().getMaquina() != null) {
                        Map<String, Object> maquinaMap = new HashMap<>();
                        maquinaMap.put("id", sol.getMantenimiento().getMaquina().getId());
                        maquinaMap.put("nombre", sol.getMantenimiento().getMaquina().getNombre());
                        maquinaMap.put("codigo", sol.getMantenimiento().getMaquina().getCodigo());
                        mttoMap.put("maquina", maquinaMap);
                    }
                    solMap.put("mantenimiento", mttoMap);
                }

                return solMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }

    /**
     * API para obtener detalles de una solicitud específica
     */
    @GetMapping("/solicitudes/{id}")
    public ResponseEntity<?> getSolicitudDetalles(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
            }

            RepuestoSolicitud solicitud = solicitudRepo.findById(id).orElse(null);
            if (solicitud == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Solicitud no encontrada"));
            }

            // Verificar que la solicitud pertenece al técnico
            Usuario u = usuarioRepo.findByEmailIgnoreCase(user.getUsername()).orElse(null);
            if (u == null ||
                    solicitud.getMantenimiento() == null ||
                    !solicitud.getMantenimiento().getAsignadoA().getId().equals(u.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
            }

            // Crear respuesta detallada
            Map<String, Object> response = new HashMap<>();
            response.put("id", solicitud.getId());
            response.put("motivo", solicitud.getMotivo());
            response.put("codigoMaquina", solicitud.getCodigoMaquina());
            response.put("descripcion", solicitud.getDescripcion());
            response.put("estado", solicitud.getEstado().toString());
            response.put("creadaEn", solicitud.getCreadaEn());
            response.put("actualizadaEn", solicitud.getActualizadaEn());
            response.put("observaciones", solicitud.getObservaciones());
            response.put("aprobado", solicitud.getAprobado());

            // Información del mantenimiento
            if (solicitud.getMantenimiento() != null) {
                Map<String, Object> mttoMap = new HashMap<>();
                mttoMap.put("id", solicitud.getMantenimiento().getId());
                mttoMap.put("tipo", solicitud.getMantenimiento().getTipo());
                mttoMap.put("estado", solicitud.getMantenimiento().getEstado());

                if (solicitud.getMantenimiento().getMaquina() != null) {
                    Map<String, Object> maquinaMap = new HashMap<>();
                    maquinaMap.put("id", solicitud.getMantenimiento().getMaquina().getId());
                    maquinaMap.put("nombre", solicitud.getMantenimiento().getMaquina().getNombre());
                    maquinaMap.put("codigo", solicitud.getMantenimiento().getMaquina().getCodigo());
                    mttoMap.put("maquina", maquinaMap);
                }

                response.put("mantenimiento", mttoMap);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }
}