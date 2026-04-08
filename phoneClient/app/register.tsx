import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "./context/UserContext";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primaryBlue: "#33BFFF",
  textDark: "#0F172A",
  white: "#FFFFFF",
  glassBlue: "rgba(51, 191, 255, 0.12)", // Light blue tint for glass
  glassBorder: "rgba(255, 255, 255, 0.5)",
  divider: "rgba(0, 0, 0, 0.05)",
};

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { register, login } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+977");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const phoneE164 = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;
      
      const response = await register({
        name,
        email,
        countryDialCode: countryCode,
        phoneNumber: phoneNumber.replace(/\D/g, ""),
        prefersWhatsApp: true,
      });

      // Redirect to verification screen
      router.push({
        pathname: "/verify-otp",
        params: { 
            phoneE164, 
            purpose: "register" 
        }
      });
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../assets/images/onboarding-bg-4k.png")}
        style={styles.background}
        imageStyle={{ top: -140, height: height + 140 }}
        resizeMode="cover"
      >
        <View style={styles.mainContent}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: 20 + insets.top,
                paddingBottom: 60 + insets.bottom,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Horizontal Header with Arrow and Title */}
            <View style={styles.horizontalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Feather
                  name="chevron-left"
                  size={28}
                  color={COLORS.textDark}
                />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join AbroadLift and start your global journey.
                </Text>
              </View>
            </View>

            {/* Distinctive Blue Glass Form with True Native Blur */}
            <View style={styles.glassCard}>
              <Image
                source={require("../assets/images/onboarding-bg-4k.png")}
                style={styles.glassImageBackground}
                blurRadius={40}
              />
              <View style={styles.glassOverlay} />
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="user"
                    size={20}
                    color={COLORS.primaryBlue}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="mail"
                    size={20}
                    color={COLORS.primaryBlue}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="example@mail.com"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputWrapper}>
                  <View style={styles.countryCodeBox}>
                     <Text style={styles.countryCodeText}>{countryCode}</Text>
                     <Feather name="chevron-down" size={14} color={COLORS.textDark} />
                  </View>
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, isSubmitting && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                    <Feather name="arrow-right" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  horizontalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28,
    gap: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textDark,
    lineHeight: 38,
    letterSpacing: -1.2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  glassCard: {
    borderRadius: 44,
    padding: 32,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    backgroundColor: "transparent",
    overflow: "hidden",
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    position: "relative",
  },
  glassImageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    top: -240,
    left: -24,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 18,
    height: 54,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 18,
    height: 54,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  countryCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 8,
    gap: 4,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  signUpButton: {
    backgroundColor: COLORS.primaryBlue,
    height: 64,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    opacity: 0.8,
  },
  termsLink: {
    fontWeight: "700",
    color: COLORS.primaryBlue,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
  footerLink: {
    fontSize: 15,
    color: COLORS.primaryBlue,
    fontWeight: "800",
  },
});
