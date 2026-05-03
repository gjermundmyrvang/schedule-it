import { CalendarDayHeader } from "@/src/components/calendar/CalendarDayHeader";
import { CalendarMonth } from "@/src/components/calendar/CalendarMonth";
import { useAuth } from "@/src/providers/AuthProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { generateMonths } from "@/src/utils/utils";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

export default function Homepage() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const months = useMemo(() => {
    const start = user?.created_at ? new Date(user.created_at) : new Date();
    return generateMonths(start);
  }, [user?.created_at]);

  const renderMonth = useCallback(
    ({ item }: { item: Date }) => <CalendarMonth date={item} />,
    [],
  );

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <CalendarDayHeader />
      <FlashList
        data={months}
        keyExtractor={(item) => item.toISOString()}
        renderItem={renderMonth}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
