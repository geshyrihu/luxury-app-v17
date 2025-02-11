import { Component, OnInit, inject } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiRequestService } from "src/app/core/services/api-request.service";

@Component({
  selector: "app-hours-work-position",
  templateUrl: "./hours-work-position.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class HoursWorkPositionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  data: any;

  ngOnInit() {
    this.onLoadData(this.config.data.workPositionId);
  }

  onLoadData(workPositionId: number) {
    const urlApi = `WorkPosition/GetHours/${workPositionId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
