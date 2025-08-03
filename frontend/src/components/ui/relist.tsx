// src/components/ui/list.tsx
import React from "react";

export const List: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => (
  <ul {...props} />
);

export const ListItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = (props) => (
  <li {...props} />
);
