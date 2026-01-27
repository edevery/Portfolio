import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function Grid({
  children,
  className,
  cols = 3,
  gap = "md"
}: GridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid",
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | "full";
}

export function GridItem({
  children,
  className,
  span = 1
}: GridItemProps) {
  const spanClasses = {
    1: "",
    2: "sm:col-span-2",
    3: "sm:col-span-2 lg:col-span-3",
    4: "sm:col-span-2 lg:col-span-3 xl:col-span-4",
    full: "col-span-full",
  };

  return (
    <div className={cn(spanClasses[span], className)}>
      {children}
    </div>
  );
}
