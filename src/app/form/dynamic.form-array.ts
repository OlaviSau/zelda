import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from "@angular/forms";

export abstract class DynamicFormArray<T> extends FormArray {
  constructor(
    values: Partial<T>[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(values.map(value => this.createIndex(value)), validatorOrOpts, asyncValidator);
  }

  abstract createIndex(dependency: Partial<T>): AbstractControl;

  setValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    this.patchValue(value, options);
  }

  patchValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean } = {}): void {
    value.forEach((dependency: Partial<T>, index: number) => {
      if (this.at(index)) {
        this.at(index).patchValue(dependency, {onlySelf: true, emitEvent: options.emitEvent});
      } else {
        this.insert(index, this.createIndex(dependency));
      }
    });
    this.controls = this.controls.filter((control, index) => !!value[index]);
    this.updateValueAndValidity(options);
  }
}
