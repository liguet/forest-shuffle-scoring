import { useEffect, useState } from "react";

import { Drawer, DrawerProps, Sheet } from "@mui/joy";

import Freeze from "@/components/common/Freeze";
import { useBreakpoint } from "@/utils/hooks";
import { mergeSx } from "@/utils/sx";

type Anchor = "left" | "top" | "right" | "bottom";
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface ResponsiveDrawerProps extends Omit<DrawerProps, "anchor"> {
  anchorSmall?: Anchor;
  anchorBig?: Anchor;
  breakpoint?: Breakpoint;
}

const TRANSITION_DURATION = 300;

const ResponsiveDrawer = ({
  anchorSmall = "bottom",
  anchorBig = "right",
  breakpoint = "sm",
  children,
  open,
  sx,
  ...otherProps
}: ResponsiveDrawerProps) => {
  const [isFullyClosed, setIsFullyClosed] = useState(!open);

  useEffect(() => {
    if (open) {
      setIsFullyClosed(false);
    } else {
      const timeout = setTimeout(
        () => setIsFullyClosed(true),
        TRANSITION_DURATION,
      );

      return () => clearTimeout(timeout);
    }
  }, [open]);

  const showSmallVariant = useBreakpoint((breakpoints) =>
    breakpoints.down(breakpoint),
  );

  const drawerProps = {
    ...otherProps,
    open,
    sx: mergeSx(
      {
        "--Drawer-horizontalSize": "400px",
        "--Drawer-verticalSize": "auto",
        "--Drawer-transitionDuration": `${TRANSITION_DURATION}ms`,
      },
      sx,
    ),
  };

  const frozenChildren = (
    <Freeze freeze={!open && !isFullyClosed}>{children}</Freeze>
  );

  return showSmallVariant ? (
    <Drawer {...drawerProps} anchor={anchorSmall}>
      {frozenChildren}
    </Drawer>
  ) : (
    <Drawer
      {...drawerProps}
      anchor={anchorBig}
      slotProps={{
        content: {
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            p: { md: 3 },
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: { md: "md" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "auto",
          p: 2,
        }}
      >
        {frozenChildren}
      </Sheet>
    </Drawer>
  );
};

export default ResponsiveDrawer;
