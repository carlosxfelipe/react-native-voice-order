import { NativeTabs } from "expo-router/unstable-native-tabs";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

export function IosNativeTabs({ colors }: { colors: any }) {
  return (
    <NativeTabs
      backgroundColor={colors.background}
      iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          // src={require("@/assets/images/tabIcons/home.png")}
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={MaterialDesignIcons}
                name="home-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon
                family={MaterialDesignIcons}
                name="home"
              />
            ),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(menu)">
        <NativeTabs.Trigger.Label>Menu</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          // src={require("@/assets/images/tabIcons/explore.png")}
          src={
            <NativeTabs.Trigger.VectorIcon
              family={MaterialDesignIcons}
              name="menu"
            />
          }
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
