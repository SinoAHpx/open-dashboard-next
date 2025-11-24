"use client";

import type { ReactNode } from "react";

export interface TablePageProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TablePage({
  title,
  description,
  actions,
  children,
  className = "",
}: TablePageProps) {
  const descriptionNode =
    description === undefined ? null : typeof description === "string" ? (
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    ) : (
      <div className="mt-2 text-gray-600 dark:text-gray-400">{description}</div>
    );

  return (
    <div className={`flex flex-1 min-h-0 flex-col p-8 ${className}`}>
      <div className="mb-6 flex flex-col gap-4 shrink-0 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {descriptionNode}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}
