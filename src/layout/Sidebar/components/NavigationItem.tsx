import React from "react";
import FeatherIcon from "feather-icons-react";
import { AiOutlineRight } from "react-icons/ai";

interface NavigationItemProps {
  item: {
    id: string;
    name: string;
    icon: any;
  };
  navBarClass: string;
  expandedChildId: string | null;
  handleCollapseChild: (id: string) => void;
  state: { isSidebarOpen: boolean };
  isExpand: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  navBarClass,
  expandedChildId,
  handleCollapseChild,
  state,
  isExpand,
}) => {
  const isActive = expandedChildId === item.id;
  const showName = !state.isSidebarOpen || (isExpand && state.isSidebarOpen);

  return (
    <div
      className={`${navBarClass} text-sm relative justify-between ${
        isActive
          ? "bg-blue-50 text-primary before:content-[''] before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-primary"
          : ""
      }`}
      key={item.id} // Use item.id as the key
      onClick={() => handleCollapseChild(item.id)}
    >
      <div className="flex gap-3 py-4">
        <FeatherIcon icon={item.icon} size={16} />
        {showName && <h5 className="line-clamp-1">{item.name}</h5>}
      </div>

      <AiOutlineRight
        className={`text-sm transition-all duration-500 ease-in-out ${
          isActive ? "rotate-90" : ""
        }`}
      />
    </div>
  );
};

export default NavigationItem;
