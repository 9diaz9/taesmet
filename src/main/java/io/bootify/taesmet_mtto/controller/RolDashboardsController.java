package io.bootify.taesmet_mtto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class RolDashboardsController {
    
    //@GetMapping("/lider")   public String liderHome()   { return "rol/lider"; }
    @GetMapping("/tecnico") public String tecnicoHome() { return "rol/tecnico"; }
}