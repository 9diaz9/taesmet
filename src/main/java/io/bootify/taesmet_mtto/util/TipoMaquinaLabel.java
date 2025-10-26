package io.bootify.taesmet_mtto.util;

import io.bootify.taesmet_mtto.domain.TipoMaquina;

public final class TipoMaquinaLabel {
    private TipoMaquinaLabel() {}

    public static String descripcion(TipoMaquina t) {
        if (t == null) return "";
        switch (t) {
            case PGH:
                return "Puente Grúa Hyundai";
            case PHT:
                return "Prensa Hidráulica Taesmet";
            case ESM:
                return "Equipo de Soldadura Miller";
            case ESL:
                return "Equipo de Soldadura Lincoln";
            case PM7:
                return "Pulidora de 7\"";
            case PM5:
                return "Pulidora de 5\"";
            case KF:
                return "Kärcher Frío";
            case KDX:
                return "Kärcher Diesel";
            case LT:
                return "Lijadora de Trombón";
            case PAT:
                return "Planta de Aire Taesmet";
            default:
                return t == null ? "" : t.name();
        }
    }
}
