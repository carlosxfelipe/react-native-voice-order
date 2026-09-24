import React from "react";
import { StyleProp, ViewStyle, Pressable, StyleSheet } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Extract the name type from the glyphmap keys
export type IconName = React.ComponentProps<typeof MaterialDesignIcons>["name"];

export interface IconProps {
  /**
   * The name of the Material Design Icon.
   * Autocomplete/Typescript support is fully available for all 7000+ icons!
   */
  name: IconName;
  /**
   * The size of the icon. Defaults to 24.
   */
  size?: number;
  /**
   * The color of the icon.
   */
  color?: string;
  /**
   * Custom style for the icon container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Optional click/tap handler. If provided, the icon renders as a pressable element
   * with premium micro-interactions.
   */
  onPress?: () => void;
  /**
   * Enables subtle micro-animations (scale bounce on tap/hover). Defaults to true.
   */
  animated?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A premium, state-of-the-art Icon component utilizing modular `@react-native-vector-icons`.
 * Automatically supports responsive scaling, interactive spring-based micro-animations,
 * and high-performance cross-platform rendering (iOS, Android, and Web).
 */
export function Icon({
  name,
  size = 24,
  color,
  style,
  onPress,
  animated = true,
}: IconProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (animated) {
      scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (animated) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const content = <MaterialDesignIcons name={name} size={size} color={color} />;

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedStyle, style]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
