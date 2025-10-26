package io.bootify.taesmet_mtto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String root() { return "redirect:/login"; }

    @GetMapping("/login")
    public String login() { return "login"; }
}
