import { Text } from "@/src/components/Text";
import { useAuth } from "@/src/providers/AuthProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      className="items-center justify-center gap-4 px-6"
    >
      <Text className="text-sm">Signed in as</Text>
      <Text variant="title" className="text-base font-medium">
        {user?.email}
      </Text>

      <TouchableOpacity
        onPress={signOut}
        style={{ borderColor: colors.border }}
        className="mt-6 w-full rounded-full border px-4 py-4 items-center"
      >
        <Text style={{ color: colors.titleText }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
