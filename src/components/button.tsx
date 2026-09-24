import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
} from "react-native";

import { Text } from "@/components/text";
import { useTheme } from "@/hooks/use-theme";

function getOpacity({
  disabled,
  pressed,
  hovered,
}: {
  disabled?: boolean | null;
  pressed: boolean;
  hovered: boolean;
}) {
  if (disabled) return 0.5;
  if (pressed) return 0.7;
  if (hovered) return 0.85;
  return 1;
}

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<PressableProps, "children"> & {
  variant?: "plain" | "tinted" | "filled" | "outline";
  color?: string;
  shape?: "pill" | "rounded" | "sharp";
  size?: ButtonSize;
  loading?: boolean;
  children: string | string[];
  iconLeft?: (color: string) => React.ReactNode;
  iconRight?: (color: string) => React.ReactNode;
};

const sizeStyles: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 15 },
  lg: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 17 },
};

export function Button({
  variant = "filled",
  shape = "rounded",
  size = "md",
  loading = false,
  children,
  color,
  iconLeft,
  iconRight,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.primary;
  const isDisabled = disabled || loading;

  const textColor: Record<typeof variant, string> = {
    filled: theme.onPrimary,
    tinted: resolvedColor,
    outline: resolvedColor,
    plain: resolvedColor,
  };

  const borderRadius: Record<typeof shape, number> = {
    pill: 999,
    rounded: 8,
    sharp: 0,
  };

  const labelColor = textColor[variant];
  const radius = borderRadius[shape];

  const { paddingVertical, paddingHorizontal, fontSize } = sizeStyles[size];

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => {
        const opacity = getOpacity({
          disabled: isDisabled,
          pressed: state.pressed,
          hovered: Platform.OS === "web" && state.hovered,
        });
        return [
          styles.base,
          { borderRadius: radius, opacity, paddingVertical, paddingHorizontal },
          Platform.OS === "web" && (styles.cursorPointer as object),
          variant === "filled" && { backgroundColor: resolvedColor },
          variant === "tinted" && { backgroundColor: theme.backgroundElement },
          variant === "outline" && {
            borderWidth: 1,
            borderColor: resolvedColor,
          },
          typeof style === "function" ? style(state) : style,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <View style={styles.icon}>
          <ActivityIndicator size="small" color={labelColor} />
        </View>
      ) : (
        iconLeft && <View style={styles.icon}>{iconLeft(labelColor)}</View>
      )}
      <Text
        style={[styles.label, { color: labelColor, fontSize }]}
        numberOfLines={1}
      >
        {children}
      </Text>
      {!loading && iconRight && (
        <View style={styles.icon}>{iconRight(labelColor)}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  cursorPointer: {
    cursor: "pointer",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});
