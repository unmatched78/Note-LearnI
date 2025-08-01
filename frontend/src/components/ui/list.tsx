import React from "react";

export function List({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <ul className={`space-y-1 ${className}`}>{children}</ul>;
}

export function ListItem({ children, className = "", ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={`px-3 py-2 rounded hover:bg-muted transition-colors cursor-pointer ${className}`} {...props}>
      {children}
    </li>
  );
}
