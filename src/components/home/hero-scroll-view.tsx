import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export interface HeroScrollViewProps extends ScrollViewProps {
  /** Offset Y to switch status bar color */
  threshold?: number;
}

export function HeroScrollView({
  threshold = 50,
  onScroll,
  children,
  style,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = "automatic",
  ...props
}: HeroScrollViewProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  return (
    <>
      {isFocused && (
        <StatusBar style={isScrolled ? "dark" : "light"} animated />
      )}
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.background },
          style,
        ]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setIsScrolled(offsetY > threshold);
          if (onScroll) {
            onScroll(e);
          }
        }}
        {...props}
      >
        {children}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
});
