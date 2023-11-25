import { Component, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { circle, latLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  standalone: true,
  imports: [LeafletModule],
})
export default class LeafletMapComponent implements OnInit {
  @Input()
  latitud: number = 0;
  @Input()
  longitud: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.onLoadOption();
  }
  options: any;
  layers: any;

  onLoadOption() {
    this.options = {
      layers: [
        tileLayer(
          'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
          {
            maxZoom: 18,
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
          }
        ),
      ],
      zoom: 13,
      center: latLng(this.latitud, this.longitud),
    };
    this.layers = [
      circle([41.9, 12.45], {
        color: '#435fe3',
        opacity: 0.5,
        weight: 10,
        fillColor: '#435fe3',
        fillOpacity: 1,
        radius: 400000,
      }),

      marker([this.latitud, this.longitud]),
    ];
  }
}
