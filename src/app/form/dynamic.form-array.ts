import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from "@angular/forms";

export abstract class DynamicFormArray<T> extends FormArray {
  constructor(
    values: Partial<T>[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(values.map(value => this.createControl(value)), validatorOrOpts, asyncValidator);
  }

  abstract createControl(dependency?: Partial<T>): AbstractControl;

  setValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    this.patchValue(value, options);
  }

  patchValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    value.forEach((dependency: Partial<T>, index: number) => {
      if (this.at(index)) {
        this.at(index).patchValue(dependency, {onlySelf: true, emitEvent: options.emitEvent});
      } else {
        this.createIndex(dependency, index);
      }
    });
    this.controls = this.controls.filter((control, index) => !!value[index]);
    this.updateValueAndValidity(options);
  }

  createIndex(dependency?: Partial<T>, index?: number) {
    if (index === undefined) {
      return this.push(this.createControl(dependency));
    }
    this.insert(index, this.createControl(dependency));
  }
}
