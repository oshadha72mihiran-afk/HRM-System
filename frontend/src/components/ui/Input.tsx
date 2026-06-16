import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-stack-sm">
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-md text-label-md text-on-surface-variant block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            quiet-input w-full font-body-lg text-body-lg placeholder:text-on-surface-variant/30
            ${icon ? "pl-8" : ""}
            ${error ? "border-error" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="font-caption text-caption text-error">{error}</p>}
    </div>
  );
};
