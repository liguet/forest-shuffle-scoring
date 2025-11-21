import { useEffect, useRef } from "react";

interface FreezeProps {
  freeze?: boolean;
  children?: React.ReactNode;
}

const Freeze = ({ freeze, children }: FreezeProps) => {
  const frozenChildrenRef = useRef<React.ReactNode>(children);

  useEffect(() => {
    if (!freeze) {
      frozenChildrenRef.current = children;
    }
  }, [freeze, children]);

  return freeze ? frozenChildrenRef.current : children;
};

export default Freeze;
