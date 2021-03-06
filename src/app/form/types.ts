import { FormGroup as NativeFormGroup, FormControl as NativeFormControl } from "@angular/forms";
import { DynamicFormArray } from "./dynamic.form-array";

export type FormControl<T> = {
  value: T;
} & NativeFormControl;

export type FormArray<T> = {
  controls: Control<T>[]
  value: T[];
} & DynamicFormArray<T>;

export type FormGroup<T> = {
  controls: {
    [K in keyof T]: Control<T[K]>
  };
  value: Partial<T>;
  setValue(
    value: Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
} & NativeFormGroup;


export type Control<T> =
  T extends Array<infer V>
    ? FormArray<V>
    : T extends object
    ? FormGroup<T>
    : FormControl<T>;
