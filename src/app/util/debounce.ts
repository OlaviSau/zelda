export function debounce(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timeout: any;

    const original = descriptor.value;

    descriptor.value = function (...args: number[]) {
      clearTimeout(timeout as number);
      timeout = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
