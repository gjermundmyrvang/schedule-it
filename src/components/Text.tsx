import { clsx } from "clsx";
import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

type Variant = "title" | "label" | "placeholder";

interface Props extends TextProps {
  variant?: Variant;
}

export function Text({ variant = "label", style, className, ...props }: Props) {
  const { colors } = useTheme();

  const variantColor: Record<Variant, string> = {
    title: colors.titleText,
    label: colors.labelText,
    placeholder: colors.placeholderText,
  };

  const variantClass: Record<Variant, string> = {
    title: "text-2xl font-bold",
    label: "text-base font-normal",
    placeholder: "text-sm font-light",
  };

  return (
    <RNText
      className={clsx(variantClass[variant], className)}
      style={[{ color: variantColor[variant] }, style]}
      {...props}
    />
  );
}
