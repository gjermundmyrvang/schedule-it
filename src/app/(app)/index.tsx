import { CalendarDayHeader } from "@/src/components/calendar/CalendarDayHeader";
import { CalendarMonth } from "@/src/components/calendar/CalendarMonth";
import { useAuth } from "@/src/providers/AuthProvider";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { generateMonths } from "@/src/utils/utils";
import { FlashList, FlashListRef, ViewToken } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";

export default function Homepage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { events, focusedMonth, setFocusedMonth } = useCalendarContext();

  const listRef = useRef<FlashListRef<Date>>(null);

  const months = useMemo(() => {
    const start = user?.created_at ? new Date(user.created_at) : new Date();
    return generateMonths(start);
  }, [user?.created_at]);

  const renderMonth = useCallback(
    ({ item }: { item: Date }) => <CalendarMonth date={item} events={events} />,
    [events],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Date>[] }) => {
      if (viewableItems[0]?.item) {
        setFocusedMonth(viewableItems[0].item);
      }
    },
    [],
  );

  useEffect(() => {
    const todayIndex = months.findIndex(
      (m) =>
        m.getFullYear() === new Date().getFullYear() &&
        m.getMonth() === new Date().getMonth(),
    );

    if (todayIndex !== -1) {
      listRef.current?.scrollToIndex({ index: todayIndex, animated: false });
    }
  }, [months]);

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <CalendarDayHeader date={focusedMonth} />
      <FlashList
        ref={listRef}
        data={months}
        keyExtractor={(item) => item.toISOString()}
        renderItem={renderMonth}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
      />
    </View>
  );
}
