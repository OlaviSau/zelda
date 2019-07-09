import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild, ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { readFile, writeFile } from "fs";

interface TasksFormGroup extends FormGroup {
  controls: {
    tasks: FormArray
  };
}

@Component({
  selector: "lx-tasks",
  styleUrls: ["./tasks.component.scss"],
  templateUrl: "./tasks.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    tasks:
      new FormArray([
        new FormGroup({
          content: new FormControl("")
        })
      ])
  }) as TasksFormGroup;
  tasks = this.form.controls.tasks;

  constructor(private changeDetector: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    readFile("tasks.json", {encoding: "utf8"}, (err, data) => {
      let tasks = [
        new FormGroup({
          content: new FormControl("")
        })
      ];
      const savedTasks = JSON.parse(data);
      if (!err && Array.isArray(savedTasks) && savedTasks.length) {
        tasks = savedTasks.map(task => new FormGroup({content: new FormControl(task.content)}));
        this.form = new FormGroup({ tasks: new FormArray(tasks) }) as TasksFormGroup;
        this.tasks = this.form.controls.tasks;
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    writeFile("tasks.json", JSON.stringify(
      this.form.controls.tasks.value
    ), err => err ? console.log(err) : null);
  }

  addTask() {
    this.tasks.push(
      new FormGroup({
        content: new FormControl("")
      })
    );

    setTimeout(() => this.elementRef.nativeElement.querySelector(".task:last-child input").focus());
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }
}
