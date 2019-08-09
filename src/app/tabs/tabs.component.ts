import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: "lx-tabs",
  styleUrls: ["./tabs.component.scss"],
  templateUrl: "./tabs.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  @HostListener("mousewheel", ["$event"]) scroll(event: WheelEvent) {
    const host = this.host.element.nativeElement as HTMLElement;
    host.scrollBy({
      left: +event.deltaY
    });
  }

  constructor(private host: ViewContainerRef) {}
}
