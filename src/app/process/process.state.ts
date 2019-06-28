import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Process } from "./process";
import { scan } from "rxjs/operators";
import { select } from "../util/select";
import { ConfigService } from "../config/config.service";

interface State {
  processes: Process[];
  selected: Process | undefined;
}

@Injectable({
  providedIn: "root"
})
export class ProcessState {

  constructor(private config: ConfigService) {}

  private actions$ = new BehaviorSubject<(state: State) => State>(state => state);
  private state$ = this.actions$.pipe(
    scan((state: State, action) => action(state), {
      processes: [],
      selected: undefined
    }));
  readonly all$ = this.state$.pipe(
    select(state => state.processes)
  );

  readonly selected$ = this.state$.pipe(
    select(state => state.selected)
  );

  select(selected: Process) {
    this.actions$.next(state => ({
      ...state,
        selected
    }));
  }

  remove(processToRemove: Process) {
    this.actions$.next(state => (
      {
        selected: state.selected === processToRemove ? state.processes.find(process => process !== processToRemove) : state.selected,
        processes: state.processes.filter(process => process !== processToRemove)
      }
    ));
  }

  add(process: Process) {
    this.actions$.next(state => (
      {
        selected: state.selected || process,
        processes: [...state.processes, process]
      }
    ));
  }
}
