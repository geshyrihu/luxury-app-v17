import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  standalone: true,
  imports: [CommonModule],
})
export default class LoadingSpinnerComponent implements OnInit {
  colors: string[] = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "body",
  ];
  currentColorIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentColorIndex =
        (this.currentColorIndex + 1) % this.colors.length;
    }, 1000); // Cambia cada 1 segundo
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getCurrentColorClass(): string {
    return `spinner-border text-${this.colors[this.currentColorIndex]}`;
  }
}
