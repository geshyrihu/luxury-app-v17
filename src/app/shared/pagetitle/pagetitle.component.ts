import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagetitle',
  standalone: true,
  imports: [],
  templateUrl: './pagetitle.component.html',
})
export default class PagetitleComponent implements OnInit {
  @Input() title: string | undefined;

  constructor(private titleService: Title, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Si title es undefined, captura el título de la ruta
    if (!this.title) {
      this.route.data.subscribe((data) => {
        // Supone que el título está en data.title
        this.title = data['title'];
        // Opcional: establecer el título del documento
        this.titleService.setTitle(this.title);
      });
    }
  }
}
