package io.bootify.taesmet_mtto.config;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@Component
@ControllerAdvice
public class CsrfAdvice {
    @ModelAttribute
    public void addCsrfToken(Model model, CsrfToken token) {
        if (token != null) {
            model.addAttribute("_csrf", token);
        }
    }
}