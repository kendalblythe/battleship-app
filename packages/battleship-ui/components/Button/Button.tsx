import { MouseEvent } from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.scss';

export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ text, variant, onClick }: ButtonProps) => (
  <button
    className={clsx(styles.button, !!variant && styles[variant])}
    type="button"
    onClick={(event): void => onClick?.(event)}
  >
    {text}
  </button>
);

export enum ButtonVariant {
  Primary = 'primary',
}
