import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { router, Stack } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const THEME = {
  primary: "#33BFFF",
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#64748B",
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

export default function UniversitySelection() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [admissionChance, setAdmissionChance] = useState("High");
  const [matchRating, setMatchRating] = useState("4.5");
  const [fee, setFee] = useState(60);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Search and Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Universities That Match Your Profile</Text>
        <Text style={styles.subtitle}>
          Compare costs, admission chances, and visa success — all in one place
        </Text>

        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#94A3B8" />
          <TextInput 
            placeholder="Search universities, courses..." 
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="swap-vert" size={20} color={THEME.textDark} />
            <Text style={styles.actionButtonText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color={THEME.textDark} />
            <Text style={styles.actionButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>
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
            onPress={() => router.push(`/university/${uni.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: uni.image }} style={styles.cardImage} />
              <View style={styles.rankBadge}>
                <BlurView intensity={20} style={styles.rankBlur}>
                  <Ionicons name="trophy-outline" size={12} color="#004be3" />
                  <Text style={styles.rankText}>{uni.rank}</Text>
                </BlurView>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.locationRow}>
                <View style={styles.locationLeft}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.locationText}>{uni.location}</Text>
                </View>
                {uni.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Matched</Text>
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
                    <Ionicons name="stats-chart" size={14} color="#64748B" />
                    <Text style={styles.acceptanceLabel}>Admission Chance</Text>
                </View>
                <ProgressTracker percentage={uni.acceptanceRate} />
              </View>

              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text style={styles.selectButtonText}>Select University</Text>
                <Feather name="arrow-right" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            activeOpacity={1} 
            onPress={() => setFilterVisible(false)} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color={THEME.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              
              {/* Admission Chances */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Admission Chances</Text>
                <View style={styles.chipRow}>
                  {["High", "Moderate", "Low"].map((level) => (
                    <TouchableOpacity 
                      key={level} 
                      style={[
                        styles.filterChip, 
                        admissionChance === level && styles.activeChip,
                        level === "High" && admissionChance === level && { backgroundColor: "#DCFCE7", borderColor: THEME.green }
                      ]}
                      onPress={() => setAdmissionChance(level)}
                    >
                      <Text style={[
                        styles.chipText, 
                        admissionChance === level && styles.activeChipText,
                        level === "High" && admissionChance === level && { color: THEME.green }
                      ]}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Match Rating */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Match Rating</Text>
                {[
                  { id: "4.5", label: "4.5 & above", stars: 4 },
                  { id: "4.0", label: "4.0 - 4.5", stars: 4 },
                  { id: "3.5", label: "3.5 - 4.0", stars: 3 },
                ].map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.ratingRow, matchRating === item.id && styles.activeRatingRow]}
                    onPress={() => setMatchRating(item.id)}
                  >
                    <View style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons 
                          key={s} 
                          name={s <= item.stars ? "star" : "star-outline"} 
                          size={16} 
                          color={s <= item.stars ? "#FBBF24" : "#E2E8F0"} 
                          style={{ marginRight: 2 }}
                        />
                      ))}
                      <Text style={[styles.ratingText, matchRating === item.id && styles.activeRatingText]}>{item.label}</Text>
                    </View>
                    <Ionicons 
                      name={matchRating === item.id ? "checkmark-circle" : "ellipse-outline"} 
                      size={24} 
                      color={matchRating === item.id ? "#6366F1" : "#E2E8F0"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Estimated Fee */}
              <View style={styles.filterSection}>
                <View style={styles.feeHeader}>
                  <Text style={styles.filterLabel}>Estimated Fee / yr</Text>
                  <Text style={styles.feeValue}>$60k</Text>
                </View>
                <View style={styles.sliderMock}>
                  <View style={styles.sliderTrack} />
                  <View style={[styles.sliderFill, { width: '60%' }]} />
                  <View style={[styles.sliderThumb, { left: '60%' }]} />
                </View>
                <View style={styles.feeRange}>
                  <Text style={styles.rangeText}>$20k</Text>
                  <Text style={styles.rangeText}>$100k+</Text>
                </View>
              </View>

              {/* Country Dropdown */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Country</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>All Countries</Text>
                  <Feather name="chevron-down" size={20} color={THEME.textGray} />
                </TouchableOpacity>
              </View>

              {/* City Dropdown */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>City</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>Any City</Text>
                  <Feather name="chevron-down" size={20} color={THEME.textGray} />
                </TouchableOpacity>
              </View>

              {/* Locality Input */}
              <View style={[styles.filterSection, { borderBottomWidth: 0 }]}>
                <Text style={styles.filterLabel}>Locality</Text>
                <View style={styles.textInputWrap}>
                  <TextInput 
                    placeholder="e.g. Urban, Suburban..." 
                    style={styles.localityInput}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={() => setFilterVisible(false)}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterVisible(false)}>
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: THEME.textDark,
    lineHeight: 32,
    marginBottom: 8,
    marginTop: 20,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: THEME.textDark,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    height: 50,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
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
    height: 180,
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
    padding: 24,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  recommendedBadge: {
    backgroundColor: "rgba(51, 191, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.primary,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  uniIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTexts: {
    flex: 1,
  },
  uniName: {
    fontSize: 19,
    fontWeight: "800",
    color: THEME.textDark,
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "48%",
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
  },
  acceptanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  acceptanceLabelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  acceptanceLabel: {
    fontSize: 12,
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
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "900",
    width: 32,
    textAlign: "right",
  },
  selectButton: {
    backgroundColor: THEME.secondary,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: THEME.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  selectButtonText: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: THEME.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.textDark,
  },
  filterScroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  filterSection: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    backgroundColor: "transparent",
  },
  activeChip: {
    borderColor: "#6366F1",
    backgroundColor: "transparent",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textGray,
  },
  activeChipText: {
    color: "#6366F1",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  activeRatingRow: {
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
    marginLeft: 10,
  },
  activeRatingText: {
    color: "#4F46E5",
  },
  feeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6366F1",
  },
  sliderMock: {
    height: 30,
    justifyContent: "center",
    position: "relative",
    marginBottom: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
  },
  sliderFill: {
    position: "absolute",
    height: 6,
    backgroundColor: "#6366F1",
    borderRadius: 3,
    top: 12,
  },
  sliderThumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    borderWidth: 4,
    borderColor: THEME.white,
    top: 3,
    marginLeft: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  feeRange: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: THEME.textGray,
    fontWeight: "600",
  },
  textInputWrap: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  localityInput: {
    fontSize: 14,
    color: THEME.textDark,
    fontWeight: "600",
  },
  modalFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 24,
    backgroundColor: THEME.white,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    height: 54,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.textDark,
  },
  applyBtn: {
    flex: 2,
    height: 54,
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.white,
  },
});
