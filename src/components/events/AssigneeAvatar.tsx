import { View } from "react-native";
import { Text } from "../Text";

const AVATAR_COLORS = [
  "bg-rose-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-sky-400",
];

export function AssigneeAvatar({
  email,
  index,
}: {
  email?: string;
  index: number;
}) {
  const initial = email ? email.slice(0, 1).toUpperCase() : "U";
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <View
      className={`w-7 h-7 rounded-full ${color} items-center justify-center`}
    >
      <Text>{initial}</Text>
    </View>
  );
}
