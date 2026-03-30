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
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#33BFFF", 
  textDark: "#0F172A",
  textGray: "#64748B",
  white: "#FFFFFF",
  bgSubtle: "#F8FAFF",
  glassBorder: "rgba(0, 0, 0, 0.05)",
};

const COUNTRIES = [
  { id: "usa", name: "USA", flag: "🇺🇸", badge: "Gold" },
  { id: "uk", name: "UK", flag: "🇬🇧" },
  { id: "canada", name: "Canada", flag: "🇨🇦" },
  { id: "korea", name: "Korea", flag: "🇰🇷" },
  { id: "nether", name: "Nether", flag: "🇳🇱", badge: "Silver" },
  { id: "brazil", name: "Brazil", flag: "🇧🇷" },
  { id: "germany", name: "Germany", flag: "🇩🇪" },
  { id: "india", name: "India", flag: "🇮🇳" },
  { id: "usa2", name: "USA", flag: "🇺🇸", badge: "Bronce" },
  { id: "uk2", name: "UK", flag: "🇬🇧" },
  { id: "canada2", name: "Canada", flag: "🇨🇦" },
  { id: "korea2", name: "Korea", flag: "🇰🇷" },
];

export default function CountrySelection() {
  const { userData, setUserData } = useUser();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(userData.country ? [userData.country.toLowerCase()] : []);

  const toggleCountry = (id: string, name: string, flag: string) => {
    // For study plan, we'll pick the most recently selected as the primary
    setSelectedCountries([id]);
    setUserData(prev => ({ ...prev, country: name, flag: flag }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Country</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <View style={styles.trackerContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View 
            key={i} 
            style={[
              styles.trackerSegment, 
              i === 1 ? styles.trackerSegmentActive : styles.trackerSegmentInactive
            ]} 
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>Which countries are you interested in?</Text>

        {/* Landmark Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../assets/images/onboarding-bg-4k.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Country Grid */}
        <View style={styles.grid}>
          {COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={[
                styles.countryItem,
                selectedCountries.includes(country.id) && styles.selectedItem,
              ]}
              onPress={() => toggleCountry(country.id, country.name, country.flag)}
            >
              <View style={styles.flagContainer}>
                 {/* Better approach: Use a modern card-style for flags */}
                <Text style={styles.flagEmoji}>{country.flag}</Text>
                {country.badge && (
                  <View style={[
                    styles.badge, 
                    { backgroundColor: country.badge === 'Gold' ? '#FFD700' : country.badge === 'Silver' ? '#C0C0C0' : '#CD7F32' }
                  ]}>
                    <Text style={styles.badgeText}>{country.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.countryName}>{country.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/setup/study-level")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40, // Increased to provide breathing room from status bar
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  questionText: {
    fontSize: 18,
    color: COLORS.textDark,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "500",
    opacity: 0.8,
  },
  bannerContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: COLORS.bgSubtle,
    overflow: "hidden",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  countryItem: {
    width: (width - 64) / 4,
    alignItems: "center",
    marginBottom: 24,
  },
  selectedItem: {
    transform: [{ scale: 1.05 }],
  },
  flagContainer: {
    width: 65,
    height: 50,
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    position: "relative",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  flagEmoji: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textGray,
  },
  badge: {
    position: "absolute",
    top: -5,
    left: 10,
    right: 10,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  continueButton: {
    backgroundColor: "rgb(41, 142, 168)", // Matching the teal/blue in screenshot
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgb(41, 142, 168)",
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
