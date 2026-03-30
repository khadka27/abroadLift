import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const THEME = {
  primary: "#33BFFF", 
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#F8FAFF",
  orange: "#F59E0B",
  blue: "#3B82F6",
  green: "#10B981",
  white: "#FFFFFF",
};

// Dummy data for demonstration since we are using dynamic routes
const UNIVERSITIES: Record<string, any> = {
  "1": {
    title: "University of Melbourne",
    location: "Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    description: "The University of Melbourne is one of Australia's leading research universities, known for academic excellence and global reputation.",
    programs: "29 Programs",
    intake: "February",
    tuition: "Tuition Fee",
    type: "International",
    offered: ["Master of Data Science", "Bachelor of Business", "PhD in Engineering", "PhD in Engineering"],
    facilities: [
      "https://images.unsplash.com/photo-1555854816-802f18809c14?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1540317580114-ed684c15ffcc?auto=format&fit=crop&q=80&w=400"
    ],
  },
  "2": {
    title: "University of Toronto",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    description: "The University of Toronto is a globally top-ranked public research university in Canada, offering world-class innovation and learning programs.",
    programs: "35 Programs",
    intake: "September",
    tuition: "$42k/yr",
    type: "Public",
    offered: ["Artificial Intelligence", "Life Sciences", "Economics", "Law"],
    facilities: [
      "https://images.unsplash.com/photo-1498243639359-2cee29633c06?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=400"
    ],
  },
  "3": {
    title: "Stanford University",
    location: "Stanford, USA",
    image: "https://images.unsplash.com/photo-1533667586627-9f5cb393304a?auto=format&fit=crop&q=80&w=800",
    description: "Stanford University is known for its proximity to Silicon Valley and its role as a premier private research university.",
    programs: "42 Programs",
    intake: "August",
    tuition: "$55k/yr",
    type: "Private",
    offered: ["CS", "MBA", "Medicine", "AI & Data"],
    facilities: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=400"
    ],
  },
};

export default function UniversityDetails() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const details = UNIVERSITIES[id as string] || UNIVERSITIES["1"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header with manual insets */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? (insets.top || 30) + 10 : insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={THEME.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContent} 
        contentContainerStyle={[
          styles.scrollInner,
          { paddingBottom: 40 + insets.bottom }
        ]}
      >
        
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: details.image }} style={styles.mainImage} />
        </View>

        {/* Info Header */}
        <View style={styles.infoHead}>
           <View style={{ flex: 1 }}>
              <Text style={styles.uniTitle}>{details.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={THEME.orange} />
                <Text style={styles.locationText}>{details.location}</Text>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Ionicons key={i} name="star" size={18} color="#FBBF24" style={{ marginRight: 2 }} />
                ))}
              </View>
           </View>
           <TouchableOpacity style={styles.bookmarkButton}>
              <Feather name="bookmark" size={24} color={THEME.blue} />
           </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the University</Text>
          <Text style={styles.aboutText}>{details.description}</Text>
        </View>

        {/* Key Information Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Ionicons name="school" size={20} color="#000" />
              </View>
              <Text style={styles.infoCardText}>{details.programs}</Text>
            </View>
            <View style={styles.infoCard}>
               <View style={styles.infoIconBox}>
                <Ionicons name="globe-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.infoCardText}>{details.type}</Text>
            </View>
            <View style={styles.infoCard}>
               <View style={styles.infoIconBox}>
                 <Ionicons name="calendar-outline" size={20} color="#EF4444" />
               </View>
              <Text style={styles.infoCardText}>{details.intake}</Text>
            </View>
            <View style={styles.infoCard}>
               <View style={styles.infoIconBox}>
                 <MaterialIcons name="monetization-on" size={20} color="#84CC16" />
               </View>
              <Text style={styles.infoCardText}>{details.tuition}</Text>
            </View>
          </View>
        </View>

        {/* Programs Offered */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programs Offered</Text>
          <View style={styles.programsGrid}>
            {details.offered.map((prog: string, i: number) => (
              <View key={i} style={styles.programItem}>
                <Ionicons name="checkmark-circle" size={20} color="#84CC16" />
                <Text style={styles.programText} numberOfLines={1}>{prog}</Text>
              </View>
            ))}
          </View>
        </View>



        {/* Campus Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campus Facilities</Text>
          <View style={styles.facilitiesRow}>
            {details.facilities.map((fac: string, i: number) => (
              <Image key={i} source={{ uri: fac }} style={styles.facilityImage} />
            ))}
          </View>
        </View>

        {/* Location Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Map</Text>
          <Image 
            source={{ uri: "https://www.maproom.net/wp-content/uploads/Map-of-London.jpg" }} 
            style={styles.mapImage} 
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: THEME.white,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.textDark,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#EEE",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  infoHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  uniTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 4,
    fontWeight: "500",
  },
  starsRow: {
    flexDirection: "row",
  },
  bookmarkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    opacity: 0.9,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoCard: {
    width: (width - 52) / 2,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 12,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  infoCardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  programsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  programItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  programText: {
    fontSize: 13,
    color: "#475569",
    marginLeft: 8,
    fontWeight: "500",
  },
  eligibilityCard: {
    backgroundColor: THEME.primary + "10",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: THEME.primary + "30",
  },
  eligibilityContent: {
    marginBottom: 20,
  },
  eligibilityTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.primary,
    marginBottom: 8,
  },
  eligibilitySubtext: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  checkButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  costContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  costItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  costLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  costLabel: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 10,
    fontWeight: "500",
  },
  costValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  totalCostItem: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.primary,
  },
  facilitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  facilityImage: {
    width: "48%",
    height: 140,
    borderRadius: 16,
  },
  mapImage: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
});
