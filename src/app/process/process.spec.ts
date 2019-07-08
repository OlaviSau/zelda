import { async, TestBed } from "@angular/core/testing";
import { ProcessState } from "./process.state";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Process } from "./process";
import { ReplaySubject } from "rxjs";

class MockProcess implements Process {
  buffer$ = new ReplaySubject<string>();
  kill() {}
}

describe("[Process]", () => {
  let state: ProcessState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProcessState
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    state = TestBed.get(ProcessState);
  });

  describe("State", () => {
    it("should have an initial state", async(() => {
      expect.assertions(2);
      state.all$.subscribe(all => expect(Array.isArray(all)).toBe(true));
      state.selected$.subscribe(selected => expect(selected).toBeUndefined());
    }));

    it("should update the list and selected when the first process is added", async(() => {
      const process = new MockProcess();
      state.add(process);
      state.all$.subscribe(([first]) => expect(first).toBe(process));
      state.selected$.subscribe(first => expect(first).toBe(process));
    }));

    it("should handle adding multiple processes in quick succession", async(() => {
      const process = new MockProcess();
      for (let i = 0; i < 5; i++) {
        state.add(process);
      }
      state.all$.subscribe(all => expect(all.length).toEqual(5));
    }));

    it("should allow items to be removed from the list and set selected to undefined when the last process is removed", async(() => {
      const all$ = [] as (Process[])[];
      const selected$ = [] as (Process | undefined)[];
      const process = new MockProcess();
      state.all$.subscribe(all => all$.push(all));
      state.selected$.subscribe(selected => selected$.push(selected));
      state.add(process);
      state.remove(process);
      const [firstAll$, secondAll$, thirdAll$] = all$;
      expect(firstAll$.length).toEqual(0);
      expect(secondAll$.length).toEqual(1);
      expect(thirdAll$.length).toEqual(0);
      const [firstSelected$, secondSelected$, thirdSelected$] = selected$;
      expect(firstSelected$).toBeUndefined();
      expect(secondSelected$).toBe(process);
      expect(thirdSelected$).toBeUndefined();
    }));
  });
});
