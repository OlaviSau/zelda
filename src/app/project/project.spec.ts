import { ProjectState } from "./project.state";
import { async, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProcessState } from "../process/process.state";
import { MatSnackBarModule } from "@angular/material";

describe("[Project]", () => {
  let state: ProjectState;
  // const project: Project = {
  //   name: "project",
  //   directory: "directory",
  //   dependencies: []
  // };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ],
      providers: [
        ProjectState,
        ProcessState
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    state = TestBed.get(ProjectState);
  });

  describe("State", () => {
    it("should have an initial state", async(() => {
      expect.assertions(2);
      state.all$.subscribe(all => expect(Array.isArray(all)).toBe(true));
      state.selected$.subscribe(selected => expect(selected).toBeUndefined());
    }));

    // it("should update the list and selected when the first process is added", async(() => {
    //   state.add(project);
    //   expect.assertions(2);
    //   state.all$.subscribe(([first]) => expect(first).toBe(project));
    //   state.selected$.subscribe(first => expect(first).toBe(project));
    // }));
    //
    // it("should handle adding multiple processes in quick succession", async(() => {
    //   for (let i = 0; i < 5; i++) {
    //     state.add(project);
    //   }
    //   state.all$.subscribe(all => expect(all.length).toBe(5));
    // }));
  });
});
