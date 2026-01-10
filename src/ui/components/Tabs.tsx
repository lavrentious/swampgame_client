import clsx from "clsx";
import React, { createContext, ReactNode, useState } from "react";

type TabsContextType = {
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  children: ReactNode[];
  defaultIndex?: number;
  className?: string;
}

interface TabProps {
  children: ReactNode;
  label: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> & { Tab: React.FC<TabProps> } = ({
  children,
  defaultIndex = 0,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={clsx("flex flex-col w-full", className)}>
        {/* Tab headers */}
        <div className="flex border-b border-gray-300">
          {React.Children.map(children, (child, idx) => {
            if (!React.isValidElement<TabProps>(child)) return null;
            const { label } = child.props;
            const isActive = idx === activeIndex;

            return (
              <button
                className={clsx(
                  "px-4 py-2 -mb-px font-medium text-sm border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
                onClick={() => setActiveIndex(idx)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Active tab content */}
        <div className="pt-4">
          {React.Children.toArray(children)[activeIndex]}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ children }: TabProps) => {
  return <div>{children}</div>;
};
