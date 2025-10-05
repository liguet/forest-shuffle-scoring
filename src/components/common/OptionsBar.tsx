import { ReactNode } from "react";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  Box,
  Radio,
  RadioGroup,
  Sheet,
  Typography,
  radioClasses,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { mergeSx } from "@/utils/sx";

interface OptionProps<T> {
  icon?: ReactNode;
  value: T;
  children?: ReactNode;
}

const Option = <T extends string>({
  icon,
  value,
  children,
}: OptionProps<T>) => (
  <Sheet
    key={value}
    variant="outlined"
    sx={{
      flex: "1 1 0px",
      borderRadius: "md",
      boxShadow: "sm",
      display: "flex",
      alignItems: "center",
      gap: 1,
      p: 2,
    }}
  >
    {icon && <Box sx={{ display: "flex", fontSize: "24px" }}>{icon}</Box>}

    <Radio
      value={value}
      label={<Typography level="title-sm">{children}</Typography>}
      checkedIcon={<CheckCircleRoundedIcon />}
    />
  </Sheet>
);

interface OptionsBarProps<T> {
  value: T;
  onChange: (value: T) => void;
  sx?: SxProps;
  children?: ReactNode;
}

const OptionsBar = <T extends string>({
  value,
  onChange,
  children,
  sx,
}: OptionsBarProps<T>) => {
  return (
    <RadioGroup
      overlay
      orientation="horizontal"
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      sx={mergeSx(sx, {
        p: 1,
        gap: 2,
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: "2px solid",
            borderColor: "primary.500",
          },
        },
        [`& .${radioClasses.radio}`]: {
          "display": "contents",
          "& > svg": {
            zIndex: 2,
            position: "absolute",
            top: "-8px",
            right: "-8px",
            bgcolor: "background.surface",
            borderRadius: "50%",
          },
        },
      })}
    >
      {children}
    </RadioGroup>
  );
};

OptionsBar.Option = Option;

export default OptionsBar;
