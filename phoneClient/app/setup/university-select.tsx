import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useUser } from "../context/UserContext";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#33BFFF", 
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#F8FAFF",
  orange: "#F59E0B",
  green: "#10B981",
  red: "#EF4444",
  white: "#FFFFFF",
};

const MATCHED_UNIVERSITIES = [
  {
    id: "1",
    name: "University College London",
    course: "MSc Computer Science",
    location: "LONDON, UK",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    rank: "#1 Global",
    duration: "1 Year",
    tuition: "$32,100 / yr",
    acceptanceRate: 75,
    recommended: true,
  },
  {
    id: "2",
    name: "Imperial College London",
    course: "MSc Artificial Intelligence",
    location: "LONDON, UK",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    rank: "#3 Global",
    duration: "1 Year",
    tuition: "$35,500 / yr",
    acceptanceRate: 58,
    recommended: true,
  },
  {
    id: "3",
    name: "University of Oxford",
    course: "MSc Software Engineering",
    location: "OXFORD, UK",
    image: "https://images.unsplash.com/photo-1533667586627-9f5cb393304a?auto=format&fit=crop&q=80&w=800",
    rank: "#2 Global",
    duration: "1 Year",
    tuition: "$38,000 / yr",
    acceptanceRate: 25,
    recommended: true,
  },
];

const ProgressTracker = ({ percentage }: { percentage: number }) => {
  const getColor = (p: number) => {
    if (p >= 70) return THEME.green;
    if (p >= 50) return THEME.orange;
    return THEME.red;
  };

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: getColor(percentage) }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: getColor(percentage) }]}>{percentage}%</Text>
    </View>
  );
};

export default function UniversitySelectionSetup() {
  const { userData, selectUniversity } = useUser();

  const handleSelect = (uni: any) => {
    selectUniversity(uni);
    router.push("/(tabs)/explore");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Feather name="chevron-left" size={28} color={THEME.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>University Selection</Text>
            <View style={{ width: 44 }} />
        </View>

        <View style={styles.trackerContainer}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
            <View 
                key={i} 
                style={[
                styles.trackerSegment, 
                i === 6 ? styles.trackerSegmentActive : styles.trackerSegmentInactive
                ]} 
            />
            ))}
        </View>

        {/* Study Plan Status Bar */}
        <View style={styles.studyPlanBar}>
            <Text style={styles.studyPlanEmoji}>{userData.flag}</Text>
            <Text style={styles.studyPlanText}>Study Plan <Text style={styles.studyPlanCountry}>{userData.country}</Text></Text>
        </View>
        
        <Text style={styles.title}>Universities Matched For You</Text>
        <Text style={styles.subtitle}>
          Compare costs, admission chances, and visa success — all in one place
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {MATCHED_UNIVERSITIES.map((uni) => (
          <TouchableOpacity 
            key={uni.id} 
            activeOpacity={0.95} 
            style={styles.card}
            onPress={() => handleSelect(uni)}
          >
            {/* Banner Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: uni.image }} style={styles.cardImage} />
              <View style={styles.rankBadge}>
                <BlurView intensity={20} style={styles.rankBlur}>
                  <Ionicons name="trophy-outline" size={12} color="#004be3" />
                  <Text style={styles.rankText}>{uni.rank}</Text>
                </BlurView>
              </View>
            </View>

            {/* University Info */}
            <View style={styles.cardInfo}>
              <View style={styles.locationRow}>
                <View style={styles.locationLeft}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.locationText}>{uni.location}</Text>
                </View>
                {uni.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>

              <View style={styles.nameRow}>
                <View style={styles.uniIconBox}>
                    <Ionicons name="school" size={20} color={THEME.secondary} />
                </View>
                <View style={styles.nameTexts}>
                    <Text style={styles.uniName}>{uni.name}</Text>
                    <Text style={styles.courseName}>{uni.course}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Feather name="calendar" size={14} color="#64748B" />
                    <View style={styles.detailTextWrapper}>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>{uni.duration}</Text>
                    </View>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="briefcase" size={14} color="#64748B" />
                    <View style={styles.detailTextWrapper}>
                        <Text style={styles.detailLabel}>Tuition</Text>
                        <Text style={styles.detailValue}>{uni.tuition}</Text>
                    </View>
                </View>
              </View>

              <View style={styles.acceptanceRow}>
                <View style={styles.acceptanceLabelBox}>
                    <Ionicons name="checkmark-done" size={14} color="#64748B" />
                    <Text style={styles.acceptanceLabel}>Acceptance Rate</Text>
                </View>
                <ProgressTracker percentage={uni.acceptanceRate} />
              </View>

              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => handleSelect(uni)}
              >
                <Text style={styles.selectButtonText}>Select University</Text>
                <Feather name="arrow-right" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: THEME.white,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: THEME.textDark,
  },
  trackerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 24,
  },
  trackerSegment: {
    height: 6,
    borderRadius: 3,
    width: 32,
  },
  trackerSegmentActive: {
    backgroundColor: THEME.primary,
  },
  trackerSegmentInactive: {
    backgroundColor: "#E5E7EB",
  },
  studyPlanBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    gap: 10,
  },
  studyPlanEmoji: {
    fontSize: 20,
  },
  studyPlanText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.textGray,
  },
  studyPlanCountry: {
    color: THEME.secondary,
    fontWeight: "800",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.textDark,
    lineHeight: 30,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 24,
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  imageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  rankBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  rankBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    gap: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#004be3",
  },
  cardInfo: {
    padding: 20,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  recommendedBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#F97316",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  uniIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTexts: {
    flex: 1,
  },
  uniName: {
    fontSize: 17,
    fontWeight: "800",
    color: THEME.textDark,
    marginBottom: 2,
  },
  courseName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366F1",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "48%",
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.textDark,
  },
  acceptanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  acceptanceLabelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  acceptanceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 0.8,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: "900",
    width: 28,
    textAlign: "right",
  },
  selectButton: {
    backgroundColor: "#004be3",
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#004be3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  selectButtonText: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
