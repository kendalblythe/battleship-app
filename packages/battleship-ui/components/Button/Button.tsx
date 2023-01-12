import { MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: ReactNode;
  title?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ children, title, variant, className, onClick }: ButtonProps) => (
  <button
    className={clsx(styles.button, !!variant && styles[variant], className)}
    type="button"
    title={title}
    onClick={(event): void => onClick?.(event)}
  >
    {children}
  </button>
);

export type ButtonVariant = 'primary' | 'icon';
