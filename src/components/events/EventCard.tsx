import { Text } from "@/src/components/Text";
import { useAuth } from "@/src/providers/AuthProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { EventWithAssignees } from "@/src/types/supabase-types";
import { formatDuration, formatTime } from "@/src/utils";
import { View } from "react-native";
import { AssigneeAvatar } from "./AssigneeAvatar";

export function EventCard({ event }: { event: EventWithAssignees }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);

  const timeRange = `${formatTime(start)} → ${formatTime(end)}`;
  const duration = formatDuration(start, end);

  return (
    <View
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
      className="rounded-2xl p-4 mb-3 border"
    >
      {/* Time row */}
      <View className="flex-row items-center gap-2">
        <View>
          <Text variant="placeholder">{timeRange}</Text>
        </View>
        <View>
          <Text variant="placeholder">{duration}</Text>
        </View>
      </View>

      {/* Title */}
      <Text variant="title" className="mb-3">
        {event.title}
      </Text>

      {/* Assignees */}
      {event.assignees.length > 0 && (
        <View className="flex-row items-center gap-1 flex-wrap">
          {event.assignees.slice(0, 5).map((a, i) => (
            <AssigneeAvatar key={a.user_id} email={user?.email} index={i} />
          ))}
          {event.assignees.length > 5 && (
            <View className="w-7 h-7 rounded-full bg-neutral-200 items-center justify-center">
              <Text className="text-xs font-semibold text-neutral-500">
                +{event.assignees.length - 5}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
