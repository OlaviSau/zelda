import { FormGroup as NativeFormGroup, FormArray as NativeFormArray, FormControl as NativeFormControl } from "@angular/forms";

export type FormControl<T> = {
  value: T;
} & NativeFormControl;

export type FormArray<T> = {
  controls: Control<T>[]
  value: T[];
} & NativeFormArray;

export type FormGroup<T> = {
  controls: {
    [K in keyof T]: Control<T[K]>
  };
  value: T;
} & NativeFormGroup;


export type Control<T> =
  T extends Array<infer V>
  ? FormArray<V>
  : T extends object
    ? FormGroup<T>
    : FormControl<T>;

// constructor(specification: T) {
//     const controls: Partial<Controls<T>> = {};
//     for (const key in specification) {
//       const value = specification[key];
//       if (Array.isArray(value)) {
//         controls[key] = new FormArray(value) as any;
//       } else if (typeof value === "object" && value) {
//         controls[key] = new FormGroup(value) as any;
//       } else {
//         controls[key] = new FormControl(value) as any;
//       }
//     }
//
//     this.controls = controls as Controls<T>;
//   }
