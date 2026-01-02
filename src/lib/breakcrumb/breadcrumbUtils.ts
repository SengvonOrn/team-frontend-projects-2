//======================================================
//
//======================================================

export const formatLabel = (label: string): string => {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const isCurrentPath = (
  itemPath: string,
  currentPath: string
): boolean => {
  return itemPath === currentPath;
};

export const isLastBreadcrumb = (
  currentIndex: number,
  totalItems: number
): boolean => {
  return currentIndex === totalItems - 1;
};
