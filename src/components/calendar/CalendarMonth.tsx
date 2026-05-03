import { getMonthString, isToday } from "@/src/utils/utils";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { Text } from "../Text";

interface Props {
  date: Date;
  focused?: boolean;
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

export function CalendarMonth({ date, focused = false }: Props) {
  const { colors } = useTheme();

  const year = date.getFullYear();
  const month = date.getMonth();
  const days = getDaysInMonth(year, month);

  return (
    <View className="pb-6">
      {!focused && <Text variant="title">{getMonthString(date)}</Text>}
      <View className="flex-1 flex-row flex-wrap justify-between">
        {days.map((day, index) => (
          <View
            key={index}
            style={{ width: `${100 / 7}%` }}
            className="items-center py-1"
          >
            {day ? (
              <TouchableOpacity
                style={
                  isToday(day)
                    ? { backgroundColor: colors.titleText }
                    : undefined
                }
                className="w-8 h-8 items-center justify-center rounded-full"
              >
                <Text
                  style={{
                    color: isToday(day) ? colors.background : colors.titleText,
                  }}
                  className="text-sm"
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
