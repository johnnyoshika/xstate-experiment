import { useState } from 'react';

export const FlightInput: React.FC<{
  value: any;
  onChange: any;
  disabled?: boolean;
  error: any;
  label: string;
}> = ({ value, onChange, disabled, error, label }) => {
  const [touched, setTouched] = useState(false);

  return (
    <label>
      <span style={{ color: error && touched ? 'red' : 'black' }}>
        {label}
      </span>
      <input
        type="date"
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value ?? ''}
        disabled={disabled}
        onBlur={e => setTouched(true)}
      />
    </label>
  );
};
