import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { scan } from "rxjs/operators";
import { select } from "../util/select";

interface State {
  tasks: Task[];
}
interface Task {
  content: string;
}

@Injectable({
  providedIn: "root"
})
export class TaskState {
  private actions$ = new BehaviorSubject<(state: State) => State>(state => state);
  private state$ = this.actions$.pipe(
    scan((state: State, action) => action(state), {
      tasks: []
    }));
}
