package io.bootify.taesmet_mtto.config;

import io.bootify.taesmet_mtto.service.UsuarioDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioDetailsService uds;

    public SecurityConfig(UsuarioDetailsService uds) {
        this.uds = uds;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public GrantedAuthoritiesMapper authoritiesMapper() {
        SimpleAuthorityMapper mapper = new SimpleAuthorityMapper();
        mapper.setConvertToUpperCase(true);
        mapper.setDefaultAuthority("ROLE_TECNICO");
        return mapper;
    }

    @Bean
    public DaoAuthenticationProvider authProvider(GrantedAuthoritiesMapper gam) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setAuthoritiesMapper(gam);
        return provider;
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        // redirección según el rol
        AuthenticationSuccessHandler handler = (request, response, authentication) -> {
            java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities =
                    authentication.getAuthorities();

            boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isLider = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_LIDER"));

            if (isAdmin) {
                response.sendRedirect("/admin");
            } else if (isLider) {
                response.sendRedirect("/lider");
            } else {
                response.sendRedirect("/tecnico");
            }
        };
        return handler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(registry -> registry
                .requestMatchers("/webjars/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/login", "/", "/error").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/lider/**").hasAnyRole("ADMIN", "LIDER")
                .requestMatchers("/tecnico/**").hasAnyRole("ADMIN", "LIDER", "TECNICO")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login").permitAll()
                .loginProcessingUrl("/login")
                .usernameParameter("email")      // aquí se alinea con tu formulario
                .passwordParameter("password")
                .successHandler(successHandler())
                .failureUrl("/login?error")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
            )
            .csrf(Customizer.withDefaults());

        return http.build();
    }
}