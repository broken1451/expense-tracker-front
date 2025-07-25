// import { Pipe, PipeTransform } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa SafeResourceUrl

// @Pipe({
//   name: 'domSeguro'
// })
// export class DomSeguroPipe implements PipeTransform {

//   constructor(private sanitizer: DomSanitizer) {}

//   transform(url: string | null | undefined): SafeResourceUrl { // Cambiado a SafeResourceUrl
//     if (!url) {
//       return ''; // Devuelve una cadena vacía o una URL de imagen por defecto si es nula/indefinida
//     }

//     // Opcional: Si el console.log del paso 1 muestra que la URL es HTTP,
//     // esta línea intentará forzarla a HTTPS.
//     // Solo haz esto si confirmas que la URL es HTTP y tu app es HTTPS.
//     const secureUrl = url.replace(/^http:\/\//i, 'https://');

//     return this.sanitizer.bypassSecurityTrustResourceUrl(secureUrl); // Usa secureUrl
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'domSeguro'
})
export class DomSeguroPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }
  /**
   * Transforma una cadena de texto en una URL segura para ser utilizada en un iframe.
   * @param value El valor de la cadena de texto que representa el identificador de la pista de Spotify - tracks.id.
   * @returns La URL segura para ser utilizada en un iframe.
   */
  transform(value: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`${value}`);
  }

}