import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Text } from "../components/Text";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import { isValidEmail } from "../utils/utils";

export default function SignIn() {
  const { colors } = useTheme();
  const { signIn, verifyOtp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isSubmitting, setIsSubmitting] = useState({
    label: "",
    loading: false,
  });

  useEffect(() => {
    if (otp.length === 6) handleVerifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleRequestOtp = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting({
      label: "Sending OTP...",
      loading: true,
    });
    const success = await signIn(email);
    setIsSubmitting({
      label: "",
      loading: false,
    });

    if (success) setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      Alert.alert("Invalid code", "Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting({
      label: "Verifying OTP...",
      loading: true,
    });
    const success = await verifyOtp(email, otp);
    setIsSubmitting({
      label: "",
      loading: false,
    });

    if (success) router.replace("/");
  };

  const reset = () => {
    setOtp("");
    setStep("email");
  };

  const handleResend = async () => {
    setIsSubmitting({
      label: "Sending new OTP...",
      loading: true,
    });
    const success = await signIn(email);
    setIsSubmitting({
      label: "",
      loading: false,
    });
    if (success) Alert.alert("Code resent", `A new code was sent to ${email}`);
  };

  const inputStyle = {
    borderColor: colors.border,
    color: colors.titleText,
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
          gap: 12,
        }}
      >
        <TextInput
          placeholder="youremail@domain.com"
          placeholderTextColor={colors.placeholderText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType={step === "email" ? "done" : "next"}
          onSubmitEditing={step === "email" ? handleRequestOtp : undefined}
          editable={step === "email"}
          style={[
            inputStyle,
            {
              opacity: step === "otp" ? 0.5 : 1,
            },
          ]}
          className="w-full rounded-full border px-4 py-4"
        />
        {step === "otp" && (
          <>
            <Text
              style={{ color: colors.labelText }}
              className="text-sm text-center"
            >
              A 6-digit code was sent to {email}
            </Text>
            <TextInput
              placeholder="6-digit code"
              placeholderTextColor={colors.placeholderText}
              value={otp}
              onChangeText={(text) => setOtp(text.slice(0, 6))}
              keyboardType="number-pad"
              autoFocus
              style={inputStyle}
              className="w-full rounded-full border px-4 py-4"
            />
            <TouchableOpacity
              onPress={handleResend}
              disabled={isSubmitting.loading}
            >
              <Text className="text-sm">
                Didn&apos;t receive it? Resend code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset}>
              <Text className="text-sm">Wrong email? Go back</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={step === "email" ? handleRequestOtp : handleVerifyOtp}
          disabled={isSubmitting.loading}
        >
          <Text variant="title">
            {isSubmitting.loading
              ? isSubmitting.label
              : step === "email"
                ? "Send OTP"
                : "Verify code"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
