/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package io.bootify.taesmet_mtto.controller;

import io.bootify.taesmet_mtto.domain.TipoMaquina;

/**
 * Clase adaptadora en el paquete `controller` para evitar colisiones de nombre.
 * Delegamos la obtención de la etiqueta a la implementación en `util`.
 */
public final class TipoMaquinaLabel {
	private TipoMaquinaLabel() {
	}

	public static String descripcion(TipoMaquina tipo) {
		return io.bootify.taesmet_mtto.util.TipoMaquinaLabel.descripcion(tipo);
	}
}
