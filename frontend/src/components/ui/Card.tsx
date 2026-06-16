import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-surface-container-lowest p-stack-md shadow-sm
        ${hover ? "transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
