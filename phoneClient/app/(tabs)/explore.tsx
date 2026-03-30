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
import { router } from "expo-router";
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#1A8A99",
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#64748B",
  bgLight: "#F8FAFF",
  orange: "#F97316",
  green: "#10B981",
  white: "#FFFFFF",
  blue: "#3B82F6",
};

export default function DashboardScreen() {
  const { userData } = useUser();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hi, Grishma 👋</Text>
          <Text style={styles.subGreetingText}>Here's your abroad study overview</Text>
        </View>
        <View style={styles.topBarIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={THEME.textDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={44} color="#E2E8F0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Study Plan Card */}
        <TouchableOpacity 
          style={styles.studyPlanCard}
          onPress={() => router.push("/search")}
        >
          <View style={styles.studyPlanInfo}>
            <Text style={styles.flagEmoji}>{userData.flag}</Text>
            <View style={styles.studyPlanTextWrapper}>
                <Text style={styles.studyPlanLabel}>Study Plan <Text style={styles.studyCountry}>{userData.country}</Text></Text>
            </View>
          </View>
          <View style={styles.editButton}>
            <Feather name="edit-2" size={14} color={THEME.blue} />
            <Text style={styles.editText}>Edit</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
           {/* Estimated Cost Card */}
           <View style={styles.statCard}>
              <View>
                <View style={styles.statIconHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: "#F3F4F6" }]}>
                    <MaterialCommunityIcons name="currency-inr" size={20} color={THEME.textDark} />
                  </View>
                  <Text style={styles.statTitle}>Estimated Cost</Text>
                </View>
                <Text style={styles.statValue}>NPR 20,500,00 <Text style={styles.statUnit}>/ year</Text></Text>
                <View style={styles.statBadge}>
                  <View style={styles.affordableDot} />
                  <Text style={styles.statBadgeText}>Affordable</Text>
                </View>
                <Text style={styles.statSubtitle}>Tuition + Living</Text>
              </View>
              <TouchableOpacity 
                style={[styles.statButton, { backgroundColor: THEME.green }]}
                onPress={() => router.push("/university/cost-breakdown")}
              >
                <Text style={styles.statButtonText}>View Breakdown</Text>
              </TouchableOpacity>
           </View>

           {/* Admission Chances Card */}
           <View style={styles.statCard}>
              <View>
                <View style={styles.statIconHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: "#FFF7ED" }]}>
                    <MaterialCommunityIcons name="target" size={20} color={THEME.orange} />
                  </View>
                  <Text style={styles.statTitle}>Admission Chances</Text>
                </View>
                <Text style={styles.statValue}>75% <Text style={styles.statUnit}>- Moderate</Text></Text>
                
                <View style={styles.checkRow}>
                   <Ionicons name="checkmark-circle" size={16} color={THEME.green} />
                   <Text style={styles.checkText}>Good GPA</Text>
                </View>
                <View style={styles.checkRow}>
                   <Ionicons name="warning" size={16} color={THEME.orange} />
                   <Text style={styles.checkText}>Improve IELTS</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.statButton, { backgroundColor: THEME.orange }]}
                onPress={() => router.push("/university/admission-chance")}
              >
                <Text style={styles.statButtonText}>Set Goals</Text>
              </TouchableOpacity>
           </View>
        </ScrollView>

        {/* Improve Your Chances Banner */}
        <View style={styles.improveBanner}>
           <View style={styles.improveContent}>
              <View style={styles.improveTitleRow}>
                 <Ionicons name="sparkles" size={18} color={THEME.orange} />
                 <Text style={styles.improveTitle}>Improve Your Chances</Text>
              </View>
              <Text style={styles.improveSubtitle}>Follow these steps to boost your success rate.</Text>
              <View style={styles.improveBullets}>
                 <Text style={styles.bulletItem}>• Increase IELTS</Text>
                 <Text style={styles.bulletItem}>• Apply for safer Unis</Text>
              </View>
              <TouchableOpacity style={styles.viewPlanButton}>
                <Text style={styles.viewPlanButtonText}>View Plan</Text>
              </TouchableOpacity>
           </View>
           <Image 
             source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/searching-for-university-location-illustration-download-in-svg-png-gif-formats--student-search-education-world-pack-people-illustrations-4712431.png" }} 
             style={styles.improveImage}
             resizeMode="contain"
           />
        </View>

        {/* Recommended Universities */}
        <View style={styles.sectionHeader}>
           <View>
            <Text style={styles.sectionTitle}>Recommended Universities</Text>
            <Text style={styles.sectionSubtitle}>Based on your profile & budget</Text>
           </View>
           <TouchableOpacity onPress={() => router.push("/search")}>
              <Text style={styles.seeAllText}>See All</Text>
           </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.uniCardsScroll}>
           <View style={styles.uniCard}>
              <View style={styles.uniImageContainer}>
                 <Image 
                   source={{ uri: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=400" }} 
                   style={styles.uniImage} 
                 />
                 <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>85% Match</Text>
                 </View>
              </View>
              <View style={styles.uniCardContent}>
                 <Text style={styles.uniCardName}>University of Melbourne</Text>
                 <View style={styles.uniLocationRow}>
                    <Ionicons name="location" size={14} color={THEME.orange} />
                    <Text style={styles.uniLocationText}>Melbourne, Australia</Text>
                 </View>
                 <View style={styles.uniCostRow}>
                    <Text style={styles.uniCostValue}>NPR 20,500,00<Text style={styles.uniCostUnit}>/ year</Text></Text>
                    <View style={styles.safeBadge}>
                        <Text style={styles.safeText}>Safe</Text>
                    </View>
                 </View>
                 <View style={styles.uniActions}>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.compareBtn}>
                        <Text style={styles.compareBtnText}>Compare</Text>
                    </TouchableOpacity>
                 </View>
              </View>
           </View>

           <View style={styles.uniCard}>
              <View style={styles.uniImageContainer}>
                 <Image 
                   source={{ uri: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" }} 
                   style={styles.uniImage} 
                 />
                 <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>72% Match</Text>
                 </View>
              </View>
              <View style={styles.uniCardContent}>
                 <Text style={styles.uniCardName}>University of Toronto</Text>
                 <View style={styles.uniLocationRow}>
                    <Ionicons name="location" size={14} color={THEME.orange} />
                    <Text style={styles.uniLocationText}>Toronto, Canada</Text>
                 </View>
                 <View style={styles.uniCostRow}>
                    <Text style={styles.uniCostValue}>NPR 11,500,00<Text style={styles.uniCostUnit}>/ year</Text></Text>
                    <View style={[styles.safeBadge, { backgroundColor: "#FFF7ED" }]}>
                        <Text style={[styles.safeText, { color: THEME.orange }]}>Moderate</Text>
                    </View>
                 </View>
                 <View style={styles.uniActions}>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.compareBtn}>
                        <Text style={styles.compareBtnText}>Compare</Text>
                    </TouchableOpacity>
                 </View>
              </View>
           </View>
        </ScrollView>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { marginHorizontal: 20, marginBottom: 16 }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
           <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIconBox, { backgroundColor: "#E0F2FE" }]}>
                <Ionicons name="search" size={20} color={THEME.blue} />
              </View>
              <Text style={styles.quickActionText}>Compare Universities</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIconBox, { backgroundColor: "#F5F3FF" }]}>
                <MaterialCommunityIcons name="file-document-outline" size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>View Documents</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIconBox, { backgroundColor: "#DCFCE7" }]}>
                <MaterialCommunityIcons name="bullseye-arrow" size={20} color={THEME.green} />
              </View>
              <Text style={styles.quickActionText}>Improve My Chances</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIconBox, { backgroundColor: "#FFEDD5" }]}>
                <Ionicons name="bookmark" size={20} color={THEME.orange} />
              </View>
              <Text style={styles.quickActionText}>Saved Universities</Text>
           </TouchableOpacity>
        </View>

        {/* Global Search Bar */}
        <View style={styles.globalSearchContainer}>
          <View style={styles.globalSearchBar}>
            <Feather name="search" size={18} color="#94A3B8" />
            <TextInput 
              placeholder="Search university or courses" 
              style={styles.globalSearchInput}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity style={styles.filterBtnSmall}>
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.textDark,
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 13,
    color: THEME.textGray,
    fontWeight: "500",
  },
  topBarIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  studyPlanCard: {
    marginHorizontal: 20,
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  studyPlanInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagEmoji: {
    fontSize: 20,
    width: 32,
    height: 32,
    textAlign: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    lineHeight: 32,
  },
  studyPlanTextWrapper: {
  },
  studyPlanLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
  },
  studyCountry: {
    color: THEME.blue,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.blue,
  },
  statsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  statCard: {
    width: 200,
    backgroundColor: THEME.white,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    minHeight: 280, // Ensure equal height for alignment
    justifyContent: "space-between", // Push buttons to bottom
  },
  statIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.textDark,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.textDark,
    marginBottom: 8,
  },
  statUnit: {
    fontSize: 12,
    color: THEME.textGray,
    fontWeight: "500",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    gap: 6,
  },
  affordableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.green,
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
  },
  statSubtitle: {
    fontSize: 11,
    color: THEME.textGray,
    marginBottom: 16,
  },
  statButton: {
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statButtonText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "800",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  checkText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textDark,
  },
  improveBanner: {
    marginHorizontal: 20,
    backgroundColor: "#FDF5E1", // Warm beige/cream from mockup
    borderRadius: 32,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  improveContent: {
    width: "60%",
    zIndex: 10,
  },
  improveTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  improveTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#92400E",
  },
  improveSubtitle: {
    fontSize: 12,
    color: "#92400E",
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 18,
  },
  improveBullets: {
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  viewPlanButton: {
    backgroundColor: THEME.blue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  viewPlanButtonText: {
    color: THEME.white,
    fontSize: 13,
    fontWeight: "800",
  },
  improveImage: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 160,
    height: 160,
    zIndex: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.textDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.textGray,
    marginTop: 4,
    fontWeight: "500",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.blue,
  },
  uniCardsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  uniCard: {
    width: 280,
    backgroundColor: THEME.white,
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  uniImageContainer: {
    height: 140,
    width: "100%",
  },
  uniImage: {
    width: "100%",
    height: "100%",
  },
  matchBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "900",
    color: THEME.green,
  },
  uniCardContent: {
    padding: 16,
  },
  uniCardName: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.textDark,
    marginBottom: 8,
  },
  uniLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  uniLocationText: {
    fontSize: 12,
    color: THEME.textGray,
    fontWeight: "600",
  },
  uniCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  uniCostValue: {
    fontSize: 15,
    fontWeight: "900",
    color: THEME.textDark,
  },
  uniCostUnit: {
    fontSize: 11,
    color: THEME.textGray,
    fontWeight: "500",
  },
  safeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  safeText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.green,
  },
  uniActions: {
    flexDirection: "row",
    gap: 10,
  },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: THEME.orange,
    fontSize: 13,
    fontWeight: "800",
  },
  compareBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  compareBtnText: {
    color: THEME.blue,
    fontSize: 13,
    fontWeight: "800",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginBottom: 32,
  },
  quickActionItem: {
    width: "46%",
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 16,
    margin: "2%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  quickActionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textDark,
    lineHeight: 16,
  },
  globalSearchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  globalSearchBar: {
    flex: 1,
    height: 54,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  globalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.textDark,
    fontWeight: "600",
  },
  filterBtnSmall: {
    width: 54,
    height: 54,
    backgroundColor: THEME.blue,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
