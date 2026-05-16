import { CalendarDayHeader } from "@/src/components/calendar/CalendarDayHeader";
import { CalendarMonth } from "@/src/components/calendar/CalendarMonth";
import { FAB } from "@/src/components/FAB";
import { useAuth } from "@/src/providers/AuthProvider";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { generateMonths } from "@/src/utils/utils";
import { FlashList, FlashListRef, ViewToken } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, View } from "react-native";

export default function Homepage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { events, focusedMonth, setFocusedMonth, refetchEvents } =
    useCalendarContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await refetchEvents();
    setRefreshing(false);
  }, [refetchEvents]);

  const router = useRouter();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <View
      style={{ backgroundColor: colors.background }}
      className="flex-1 relative"
    >
      <CalendarDayHeader date={focusedMonth} />
      <FlashList
        ref={listRef}
        data={months}
        keyExtractor={(item) => item.toISOString()}
        renderItem={renderMonth}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FAB
        icon="calendar"
        onPress={() => router.push("/calendars")}
        color={colors.accent}
      />
    </View>
  );
}
