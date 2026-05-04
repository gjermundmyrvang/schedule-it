import { EventWithAssignees } from "@/src/types/supabase-types";
import {
  formatDateParam,
  getDaysInMonthGrid,
  getMonthYearString,
  isToday,
} from "@/src/utils/utils";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text } from "../Text";

interface Props {
  date: Date;
  events: EventWithAssignees[];
}

export function CalendarMonth({ date }: Props) {
  const router = useRouter();

  const year = date.getFullYear();
  const month = date.getMonth();
  const days = getDaysInMonthGrid(year, month);

  const isCurrent = month === new Date().getMonth();

  const CELL_SIZE = Math.floor(Dimensions.get("window").width / 7);

  return (
    <View className="pt-6 pb-6">
      <Text
        style={{ color: isCurrent ? "#ff4800" : undefined }}
        className="font-bold px-4 uppercase tracking-wider"
      >
        {getMonthYearString(date)}
      </Text>
      <View className="flex-row flex-wrap">
        {days.map((day, index) => (
          <View
            key={index}
            style={{ width: CELL_SIZE }}
            className="items-center py-8"
          >
            {day ? (
              <TouchableOpacity
                onPress={() => router.push(`/day/${formatDateParam(day)}`)}
                className={clsx(
                  "w-10 h-10 items-center justify-center rounded-full",
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
