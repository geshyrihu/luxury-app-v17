import { Component, inject, OnInit } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import ModalSearchComponent from "../modal-search/modal-search.component";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  standalone: true,
  imports: [],
})
export default class SearchComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  dialogHandlerService = inject(DialogHandlerService);
  dialogService = inject(DialogService);

  ngOnInit() {}

  onModalSearch() {
    this.ref = this.dialogService.open(ModalSearchComponent, {
      closeOnEscape: true,
      contentStyle: { overflow: "auto", borderRadius: "3px" },
      position: "top",
      showHeader: false,
      width: "40%",
      baseZIndex: 10000,
    });
  }
}
