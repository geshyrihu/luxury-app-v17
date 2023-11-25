// import { Component, Input, OnChanges, OnInit } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';

// @Component({
//   selector: 'app-map-box',
//   templateUrl: './map-box.component.html',
//   standalone: true,
// })
// export default class MapBoxComponent implements OnInit, OnChanges {
//   @Input()
//   latitud: number = 0;
//   @Input()
//   longitud: number = 0;
//   options: any;
//   data: any[] = [];

//   mapa: mapboxgl.Map;
//   constructor() {
//     // (mapboxgl as any).accessToken = environment.mapboxToken;
//   }
//   ngOnChanges(): void {
//     this.onLoadMapa();
//   }

//   ngOnInit(): void {
//     this.onLoadMapa();
//   }
//   onLoadMapa() {
//     this.mapa = new mapboxgl.Map({
//       container: 'mapContainer',
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [this.longitud, this.latitud],
//       zoom: 16,
//     });

//     this.createMarcador(this.longitud, this.latitud);
//   }
//   createMarcador(lng: number, lat: number) {
//     const maker = new mapboxgl.Marker({
//       draggable: true,
//     })
//       .setLngLat([lng, lat])
//       .addTo(this.mapa);
//   }
// }
