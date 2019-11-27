import {
  Directive,
  Input,
  HostListener,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { Process } from "../process/process";
import { Terminal } from "xterm";
import { EMPTY } from "rxjs";
import { debounce } from "../util/debounce";

@Directive({ selector: "[terminal]" })
export class TerminalDirective implements OnDestroy {

  static readonly FONT_SIZE = 12;
  static readonly CHAR_WIDTH = 7;
  static readonly DEFAULT_ROWS = 30;

  @Input() set rows(rows: number) {
    this.height = this.element.nativeElement.style.flexBasis = rows * TerminalDirective.FONT_SIZE;
    this.terminal.resize(Math.floor(window.innerWidth / TerminalDirective.CHAR_WIDTH) - 1, rows);
  }
  @Input("terminal") set process(process: Process) {
    this.terminal.reset();
    this.buffer$$.unsubscribe();
    if (process) {
      this.buffer$$ = process.subscribe({
        next: chunk => this.terminal.write(chunk),
        complete: () => this.terminal.writeln("The process has exited"),
        error: code => this.terminal.writeln(`The process errored with code: ${code}`)
      });
    }
  }

  private height = TerminalDirective.DEFAULT_ROWS * TerminalDirective.FONT_SIZE;
  private terminal = new Terminal({
    cols: Math.floor(window.innerWidth / TerminalDirective.CHAR_WIDTH) - 1,
    rows: TerminalDirective.DEFAULT_ROWS,
    fontSize: TerminalDirective.FONT_SIZE,
    lineHeight: 1,
    theme: {
      background: "#1e1e1e"
    },
    windowsMode: true
  });
  private buffer$$ = EMPTY.subscribe();

  constructor(private element: ElementRef) {
    this.terminal.open(element.nativeElement);
    this.terminal.onSelectionChange(() => document.execCommand("copy"));
  }

  @HostListener("window:resize")
  @debounce()
  onResize() {
    this.terminal.resize(
      Math.floor(window.innerWidth / TerminalDirective.CHAR_WIDTH) - 1,
      this.height / TerminalDirective.FONT_SIZE
    );
  }

  ngOnDestroy() {
    this.buffer$$.unsubscribe();
    this.terminal.dispose();
  }

}
