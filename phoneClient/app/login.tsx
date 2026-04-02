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
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, userData } = useUser();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter both identifier and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(identifier, password);
      // Sequential check for missing setup fields to decide redirection
      if (!user.country) {
          router.push("/setup/country");
      } else if (!user.studyLevel) {
          router.push("/setup/study-level");
      } else if (!user.fieldOfStudy) {
          router.push("/setup/field-of-study");
      } else if (!user.cgpa || !user.recentAcademicField) {
          router.push("/setup/academics");
      } else if (!user.score && !user.englishLevel) {
          router.push("/setup/english-test");
      } else if (!user.intake) {
          router.push("/setup/target");
      } else {
          router.push("/(tabs)/explore");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong. Please check your credentials.");
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
              { paddingTop: 20 + insets.top, paddingBottom: 60 + insets.bottom }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Horizontal Header with Arrow and Title */}
            <View style={styles.horizontalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Feather name="chevron-left" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Sign in to continue your global journey.</Text>
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
                <Text style={styles.label}>Email or Username</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email or Username"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    autoCapitalize="none"
                    value={identifier}
                    onChangeText={setIdentifier}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signInButton, isSubmitting && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                    <Feather name="arrow-right" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR LOGIN WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialIcon}>
                  <AntDesign name="google" size={24} color="#EA4335" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <FontAwesome name="apple" size={26} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <FontAwesome name="facebook" size={26} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.footerLink}>Sign Up</Text>
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
    marginBottom: 20, 
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
    marginBottom: 8,
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
    marginBottom: 20,
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
    marginBottom: 28, 
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
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    fontSize: 14,
    color: COLORS.primaryBlue,
    fontWeight: "700",
  },
  signInButton: {
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
    marginBottom: 30,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#0F172A",
    fontSize: 11,
    fontWeight: "800",
    opacity: 0.3,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
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
