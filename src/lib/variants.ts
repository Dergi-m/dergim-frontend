import { cn as cnBase, CnOptions } from 'tailwind-variants';

export function cn<T extends CnOptions>(...classes: T) {
  return cnBase(classes)({ twMerge: true });
}

export { tv } from 'tailwind-variants';
export { type VariantProps } from 'tailwind-variants';
