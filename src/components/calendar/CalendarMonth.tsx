import { getMonthYearString, isToday } from "@/src/utils/utils";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../Text";

interface Props {
  date: Date;
}

function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-based offset (0 = Mon, 6 = Sun)
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days: (Date | null)[] = Array(startOffset).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Pad end to complete the last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function CalendarMonth({ date }: Props) {
  const router = useRouter();

  const year = date.getFullYear();
  const month = date.getMonth();
  const days = getDaysInMonth(year, month);

  const isCurrent = month === new Date().getMonth();

  return (
    <View className="pt-6 pb-6">
      <Text
        style={{ color: isCurrent ? "#ff4800" : undefined }}
        className="font-bold px-4 uppercase tracking-wider"
      >
        {getMonthYearString(date)}
      </Text>
      <View className="flex-1 flex-row flex-wrap justify-between">
        {days.map((day, index) => (
          <View
            key={index}
            style={{ width: `${100 / 7}%` }}
            className="items-center py-6"
          >
            {day ? (
              <TouchableOpacity
                onPress={() => router.push(`/day/${day.toISOString()}`)}
                className={clsx(
                  "w-12 h-12 items-center justify-center rounded-full",
                  isToday(day) && "border border-[#ff4800]",
                )}
              >
                <Text className="text-lg">{day.getDate()}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
