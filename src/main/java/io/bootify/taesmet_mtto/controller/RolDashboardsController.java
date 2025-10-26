package io.bootify.taesmet_mtto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RolDashboardsController {
    @GetMapping("/lider")   public String liderHome()   { return "rol/lider"; }
    @GetMapping("/tecnico") public String tecnicoHome() { return "rol/tecnico"; }
}