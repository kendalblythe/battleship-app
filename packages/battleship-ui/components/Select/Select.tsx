import { ChangeEvent } from 'react';

import styles from './Select.module.scss';

export interface SelectProps {
  value?: string | number;
  options?: Array<SelectOption>;
  onChange?: (event: SelectChangeEvent) => void;
}

export const Select = ({ value, options, onChange }: SelectProps) => (
  <select
    className={styles.select}
    value={value}
    onChange={(event): void => onChange?.({ value: event.target.value, event })}
  >
    {options?.map(({ value, label }) => (
      <option key={value || label} value={value}>
        {label}
      </option>
    ))}
  </select>
);

export interface SelectOption {
  value?: string;
  label: string;
}

export interface SelectChangeEvent {
  value: string;
  event: ChangeEvent<HTMLSelectElement>;
}
