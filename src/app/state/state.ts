import { BehaviorSubject } from "rxjs";

export class State<T> extends BehaviorSubject<T> {
  update(changes: Partial<T>) {
    this.next({
      ...this.value,
      ...changes
    });
  }
}
