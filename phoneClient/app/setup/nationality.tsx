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
  TextInput,
  ImageBackground,
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#33BFFF", 
  textDark: "#0F172A",
  textGray: "#64748B",
  white: "#FFFFFF",
  bgSubtle: "#F8FAFF",
  glassBorder: "rgba(0, 0, 0, 0.05)",
  teal: "rgb(41, 142, 168)",
};

const NATIONALITIES = [
  { id: "usa", name: "United States Of America", flag: "🇺🇸" },
  { id: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { id: "canada", name: "Canada", flag: "🇨🇦" },
  { id: "korea", name: "Korea", flag: "🇰🇷" },
  { id: "netherland", name: "Netherland", flag: "🇳🇱" },
  { id: "brazil", name: "Brazil", flag: "🇧🇷" },
  { id: "germany", name: "Germany", flag: "🇩🇪" },
  { id: "india", name: "India", flag: "🇮🇳" },
];

export default function NationalitySelection() {
  const [selectedNationality, setSelectedNationality] = useState<string>("usa");
  const [search, setSearch] = useState("");

  const filtered = NATIONALITIES.filter(n => 
    n.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <Text style={styles.headerTitle}>Nationality</Text>
            <View style={{ width: 44 }} /> 
          </View>

          <View style={styles.trackerContainer}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <Text style={styles.questionText}>What is your nationality?</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color={COLORS.textGray} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder='"Search study courses"'
                placeholderTextColor={COLORS.textGray}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Nationality List */}
            <View style={styles.list}>
              {filtered.map((item) => {
                const isSelected = selectedNationality === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.nationalityItem,
                      isSelected && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedNationality(item.id)}
                  >
                     <View style={styles.flagBox}>
                        <Text style={styles.flagEmoji}>{item.flag}</Text>
                     </View>
                    <Text style={[styles.nationalityName, isSelected && styles.selectedName]}>{item.name}</Text>
                    {isSelected && <Feather name="check" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Bottom Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push("/setup/english-test")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 80,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 28,
  },
  searchIcon: {
    marginRight: 12,
    opacity: 0.4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  list: {
    gap: 12,
  },
  nationalityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 2,
  },
  selectedItem: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  flagBox: {
    width: 44,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  flagEmoji: {
    fontSize: 20,
  },
  nationalityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  selectedName: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "white", // Solid background for footer
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  continueButton: {
    backgroundColor: COLORS.teal,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.teal,
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
});
