import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Stack, router } from "expo-router";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

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
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Horizontal Header with Arrow and Title */}
            <View style={styles.horizontalHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Feather name="chevron-left" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join AbroadLift and start your global journey.</Text>
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
                  <Feather name="user" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="example@mail.com"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color={COLORS.primaryBlue} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Create a password"
                    placeholderTextColor="rgba(15, 23, 42, 0.3)"
                    style={styles.input}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => router.push("/setup/country")}
              >
                <Text style={styles.signUpButtonText}>Create Account</Text>
                <Feather name="arrow-right" size={20} color="white" />
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
        </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80, // Increased further to bring title down
    paddingBottom: 60,
  },
  horizontalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28, // Reduced from 40
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
    top: -240, // Match the visual position of background icons
    left: -24,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Frosting tint
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
    height: 54, // Reduced from 60
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
