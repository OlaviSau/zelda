import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  HostBinding,
  HostListener,
  ViewEncapsulation
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { IconPickerDialogComponent } from "./icon-picker-dialog.component";
import { FormControl, FormControlName } from "@angular/forms";

@Component({
  selector: "lx-icon-picker",
  templateUrl: "./icon-picker.component.html",
  styleUrls: ["./icon-picker.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
}) export class IconPickerComponent {

  constructor(
    private dialog: MatDialog,
    private detector: ChangeDetectorRef
  ) {

  }
  @ContentChild(FormControlName, {static: false})
  set controlContainer(container: FormControlName) {
    this.control = container.control;
    if (this.control) {
      this.icon = this.control.value;
      this.control.registerOnChange((value: string) => {
        this.icon = value;
        this.detector.markForCheck();
      });
    }
  }
  @HostBinding("class.icon-picker") cssClass = true;

  control: FormControl | undefined;
  icon = "fa-edit";

  @HostListener("click") openDialog() {
    this.dialog.open(IconPickerDialogComponent, {
      data: {
        control: this.control
      }
    });
  }
}
