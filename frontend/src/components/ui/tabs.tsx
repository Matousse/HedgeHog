import React from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs = ({ defaultValue, className, children }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue);

  const onValueChange = React.useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={clsx('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList = ({ className, children }: TabsListProps) => {
  return (
    <div
      role="tablist"
      className={clsx(
        'inline-flex items-center justify-center rounded-lg bg-gray-100 p-1',
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger = ({ value, className, children }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-white text-cyan-700 shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={clsx(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};
