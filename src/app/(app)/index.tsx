import { CalendarDayHeader } from "@/src/components/calendar/CalendarDayHeader";
import { CalendarMonth } from "@/src/components/calendar/CalendarMonth";
import { useTheme } from "@/src/providers/ThemeProvider";
import { View } from "react-native";

export default function Homepage() {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <CalendarDayHeader />
      <CalendarMonth date={new Date()} />
    </View>
  );
}
