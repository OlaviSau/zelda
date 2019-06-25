import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Process } from "./process";
import { map, scan } from "rxjs/operators";

interface State {
  processes: Process[];
  selected: Process | undefined;
}

@Injectable({
  providedIn: "root"
})
export class ProcessState {

  private actions$ = new BehaviorSubject<(state: State) => State>(state => state);
  private state$ = this.actions$.pipe(
    scan((state: State, action) => action(state), {
      processes: [],
      selected: undefined
    }));
  readonly all$ = this.state$.pipe(
    map(state => state.processes)
  );

  readonly selected$ = this.state$.pipe(
    map(state => state.selected)
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
