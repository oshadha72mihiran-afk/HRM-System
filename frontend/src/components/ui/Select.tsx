import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-stack-sm">
      {label && (
        <label
          htmlFor={selectId}
          className="font-label-md text-label-md text-on-surface-variant block"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          quiet-input w-full font-body-lg text-body-lg
          ${error ? "border-error" : ""}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="font-caption text-caption text-error">{error}</p>}
    </div>
  );
};
