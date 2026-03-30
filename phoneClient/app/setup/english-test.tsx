import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
  ImageBackground,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Animated,
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#33BFFF", 
  textDark: "#0F172A",
  textGray: "#64748B",
  white: "#FFFFFF",
  glassBase: "rgba(255, 255, 255, 0.8)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

const ENGLISH_LEVELS = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];
const TEST_TYPES = ["IELTS", "PTE", "TOEFL", "Duolingo"];

export default function EnglishTestSelection() {
  const { userData, setUserData } = useUser();
  const [hasTakenTest, setHasTakenTest] = useState<boolean | null>(
    userData.testType && userData.testType !== "Not Taken" ? true :
    userData.englishLevel ? false : null
  );
  const [testType, setTestType] = useState<string>(userData.testType === "Not Taken" ? "" : userData.testType || "");
  const [score, setScore] = useState(userData.score === "Pending" ? "" : userData.score || "");
  const [englishLevel, setEnglishLevel] = useState(userData.englishLevel || "");

  const handleToggle = (taken: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHasTakenTest(taken);
    // Reset other fields when toggling
    if (taken) setEnglishLevel("");
    else { setTestType(""); setScore(""); }
  };
  
  const handleComplete = () => {
    setUserData(prev => ({
        ...prev,
        score: hasTakenTest ? score : "N/A",
        testType: hasTakenTest ? testType : "Not Taken",
        englishLevel: hasTakenTest ? "N/A" : englishLevel
    }));
    router.push("/setup/university-select");
  };

  const isFormValid = hasTakenTest === true 
    ? (testType !== "" && score.trim().length > 0)
    : (hasTakenTest === false && englishLevel !== "");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/onboarding-bg-4k.png")}
        style={styles.background}
        imageStyle={{ top: -140, height: height + 140 }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={28} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>English</Text>
            <View style={{ width: 44 }} /> 
          </View>

          <View style={styles.trackerContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View 
                key={i} 
                style={[
                  styles.trackerSegment, 
                  i === 5 ? styles.trackerSegmentActive : styles.trackerSegmentInactive
                ]} 
              />
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.questionText}>Have you taken an English test?</Text>

            {/* Banner */}
            <View style={styles.bannerContainer}>
              <Image
                source={require("../../assets/images/onboarding-bg-4k.png")} 
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>

            {/* Yes/No Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, hasTakenTest === true && styles.activeToggle]}
                onPress={() => handleToggle(true)}
              >
                {hasTakenTest === true && (
                  <>
                    <Image 
                      source={require("../../assets/images/onboarding-bg-4k.png")}
                      style={styles.glassImageBackground}
                      blurRadius={30}
                    />
                    <View style={styles.glassOverlay} />
                  </>
                )}
                <Text style={[styles.toggleText, hasTakenTest === true && styles.activeToggleText]}>Yes, I have</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleBtn, hasTakenTest === false && styles.activeToggle]}
                onPress={() => handleToggle(false)}
              >
                {hasTakenTest === false && (
                  <>
                    <Image 
                      source={require("../../assets/images/onboarding-bg-4k.png")}
                      style={styles.glassImageBackground}
                      blurRadius={30}
                    />
                    <View style={styles.glassOverlay} />
                  </>
                )}
                <Text style={[styles.toggleText, hasTakenTest === false && styles.activeToggleText]}>No, I haven't</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Content based on selection */}
            {hasTakenTest === true && (
              <Animated.View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Select your test type</Text>
                
                <View style={styles.horizontalList}>
                  {TEST_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.badge, testType === type && styles.activeBadge]}
                      onPress={() => setTestType(type)}
                    >
                      <Text style={[styles.badgeText, testType === type && styles.activeBadgeText]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {testType !== "" && (
                  <View style={styles.inputCard}>
                    <Image 
                      source={require("../../assets/images/onboarding-bg-4k.png")}
                      style={[styles.glassImageBackground, { top: -600 }]}
                      blurRadius={30}
                    />
                    <View style={styles.glassOverlay} />
                    <Text style={[styles.inputLabel, { zIndex: 1 }]}>Overall Score</Text>
                    <TextInput
                      style={[styles.textInput, { zIndex: 1 }]}
                      placeholder={
                        testType === "IELTS" ? "e.g. 7.5" :
                        testType === "PTE" ? "e.g. 65" :
                        testType === "TOEFL" ? "e.g. 100" :
                        testType === "Duolingo" ? "e.g. 120" :
                        "Score"
                      }
                      placeholderTextColor={COLORS.textGray}
                      value={score}
                      onChangeText={setScore}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </Animated.View>
            )}

            {hasTakenTest === false && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Select your proficiency level</Text>
                <View style={styles.horizontalList}>
                  {ENGLISH_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[styles.badge, englishLevel === level && styles.activeBadge]}
                      onPress={() => setEnglishLevel(level)}
                    >
                      <Text style={[styles.badgeText, englishLevel === level && styles.activeBadgeText]}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton, 
                { marginTop: 40 },
                !isFormValid && { opacity: 0.5 }
              ]}
              disabled={!isFormValid}
              onPress={handleComplete}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 100,
  },
  questionText: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 32,
    fontWeight: "500",
  },
  bannerContainer: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  toggleBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  activeToggle: {
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    zIndex: 1,
  },
  activeToggleText: {
    color: COLORS.primary,
  },
  glassImageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    top: -460,
    left: -20,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  formSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textGray,
    textAlign: "center",
    marginBottom: 20,
  },
  horizontalList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  activeBadge: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  activeBadgeText: {
    color: COLORS.white,
  },
  inputCard: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textGray,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  textInput: {
    fontSize: 18,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  trackerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  trackerSegment: {
    height: 6,
    borderRadius: 3,
    width: 32,
  },
  trackerSegmentActive: {
    backgroundColor: COLORS.primary,
  },
  trackerSegmentInactive: {
    backgroundColor: "#E5E7EB",
  },
});
