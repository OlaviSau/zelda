import { Injectable } from "@angular/core";
import { Process } from "./process";
import { select } from "../state/select";
import { State } from "../state/state";
import { exclude } from "../util/array/exclude";
import { other } from "../util/array/other";
import { include } from "../util/array/include";

@Injectable()
export class ProcessState extends State<{
  processes: Process[];
  selected?: Process;
}> {

  constructor() {
    super({processes: []});
  }
  readonly all$ = this.pipe(select(state => state.processes));
  readonly selected$ = this.pipe(select(state => state.selected));

  select(selected: Process) {
    this.update({selected});
  }

  remove(processToRemove: Process) {
    processToRemove.kill();
    const selected = this.value.selected;
    const processes = this.value.processes;
    this.update({
      selected: selected === processToRemove ? other(processes, processToRemove) : selected,
      processes: exclude(processes, processToRemove)
    });
  }

  add(process: Process) {
    this.update({
      selected: this.value.selected || process,
      processes: include(this.value.processes, process)
    });
  }
}
