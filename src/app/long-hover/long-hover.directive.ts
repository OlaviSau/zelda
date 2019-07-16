import {
  Directive,
  Input,
  HostListener,
  HostBinding,
  ChangeDetectorRef
} from "@angular/core";

@Directive({ selector: "[longHover]" })
export class LongHoverDirective {

  @HostBinding("class.long-hover") longHover = false;
  @Input() duration = 500;

  constructor(private changeDetector: ChangeDetectorRef) {}

  private timeout: any;

  @HostListener("mouseenter")
  onMouseEnter() {
    this.timeout = setTimeout(() => {
      this.longHover = true;
      this.changeDetector.markForCheck();
    }, this.duration);
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    clearTimeout(this.timeout);
    this.longHover = false;
  }

}
