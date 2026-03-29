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
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#238B9B", // Teal from the button/search
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
  orange: "#F59E0B",
  blue: "#4D7EF1",
  heroBg: "#FDF5ED", // Light beige/cream
};

const DESTINATIONS = [
  { name: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400" },
  { name: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400" },
  { name: "Korea", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400" },
  { name: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400" },
  { name: "Canada", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=400" },
  { name: "India", image: "https://images.unsplash.com/photo-1524492707941-5f397b72b07d?auto=format&fit=crop&q=80&w=400" },
];

const DEGREES = [
  { name: "Bachelor's", icon: "school-outline", color: "#4D7EF1", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400" },
  { name: "Master's", icon: "briefcase-outline", color: "#F59E0B", image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=400" },
  { name: "PHD", icon: "ribbon-outline", color: "#10B981", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" },
  { name: "Diploma", icon: "document-text-outline", color: "#EC4899", image: "https://images.unsplash.com/photo-1498243639359-2cee29633c06?auto=format&fit=crop&q=80&w=400" },
];

const UNIVERSITIES = [
  {
    id: "1",
    title: "Harvard University",
    location: "Cambridge, USA",
    rating: "4.9",
    reviews: "1.2k",
    image: "https://images.unsplash.com/photo-1576091160550-2173bdd9962a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "University of Oxford",
    location: "Oxford, UK",
    rating: "4.8",
    reviews: "950",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Seoul National University",
    location: "Seoul, Korea",
    rating: "4.7",
    reviews: "820",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "University of Toronto",
    location: "Toronto, Canada",
    rating: "4.6",
    reviews: "740",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    title: "IIT Delhi",
    location: "New Delhi, India",
    rating: "4.5",
    reviews: "680",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "Stanford University",
    location: "Stanford, USA",
    rating: "4.9",
    reviews: "1.5k",
    image: "https://images.unsplash.com/photo-1533667586627-9f5cb393304a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "7",
    title: "University of Tokyo",
    location: "Tokyo, Japan",
    rating: "4.7",
    reviews: "920",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    title: "ETH Zurich",
    location: "Zurich, Switzerland",
    rating: "4.8",
    reviews: "880",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "9",
    title: "NUS Singapore",
    location: "Singapore",
    rating: "4.8",
    reviews: "1.1k",
    image: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "10",
    title: "University of Sydney",
    location: "Sydney, Australia",
    rating: "4.6",
    reviews: "650",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800",
  },
];

export default function ExploreTab() {
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push(("/category/" + title) as any)}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.locationLabel}>location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={THEME.orange} />
            <Text style={styles.locationText}>New York, USA</Text>
            <Feather name="chevron-down" size={16} color={THEME.textDark} style={{ marginLeft: 4 }} />
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <View style={[styles.avatar, { justifyContent: "center", alignItems: "center" }]}>
            <Ionicons name="person" size={24} color={THEME.textGray} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color={"#9CA3AF"} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search university or courses"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color={THEME.bgLight} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find Your Ideal{"\n"}University</Text>
            <Text style={styles.heroSubtitle}>
              Explore universities worldwide and discover programs that match your goal.
            </Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push("/search")}>
              <Text style={styles.heroButtonText}>Start Exploring</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/searching-for-university-location-illustration-download-in-svg-png-gif-formats--student-search-education-world-pack-people-illustrations-4712431.png" }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Popular Destinations */}
        <SectionHeader title="Popular Destinations" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {DESTINATIONS.map((dest, i) => (
            <TouchableOpacity key={i} style={styles.destinationItem} onPress={() => router.push(("/category/" + dest.name) as any)}>
              <View style={styles.destinationIconWrap}>
                 <Image source={{ uri: dest.image }} style={styles.destinationImage} />
              </View>
              <Text style={styles.destinationText}>{dest.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended For You */}
        <SectionHeader title="Recommended For You" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {UNIVERSITIES.slice(0, 5).map((u) => (
            <TouchableOpacity key={u.id} style={styles.cardContainerHorizontal} activeOpacity={0.9} onPress={() => router.push(("/university/" + u.id) as any)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: u.image }} style={styles.cardImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={10} color={THEME.orange} />
                  <Text style={styles.ratingText}>{u.rating}</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkSmall}>
                   <Feather name="bookmark" size={14} color={THEME.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {u.title}
              </Text>
              <View style={styles.cardInfoRow}>
                <View style={styles.cardLocationBox}>
                  <Ionicons name="location" size={12} color={THEME.orange} />
                  <Text style={styles.cardLocationText} numberOfLines={1}>
                    {u.location}
                  </Text>
                </View>
                <Text style={styles.reviewsText}>({u.reviews})</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Browse by Degree */}
        <SectionHeader title="Browse by Degree" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {DEGREES.map((degree) => (
            <TouchableOpacity key={degree.name} style={styles.degreeItem} onPress={() => router.push(("/category/" + degree.name) as any)}>
              <View style={styles.degreeIconWrap}>
                <Image source={{ uri: degree.image }} style={styles.degreeImage} />
                <View style={[styles.degreeIconOverlay, { backgroundColor: degree.color + "CC" }]}>
                  <Ionicons name={degree.icon as any} size={24} color="white" />
                </View>
              </View>
              <Text style={styles.degreeText}>{degree.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Fields */}
        <SectionHeader title="Trending Fields" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {[
            { name: "Computer Science", icon: "laptop", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
            { name: "Business Admin", icon: "briefcase", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400" },
            { name: "Medicine", icon: "medical", image: "https://images.unsplash.com/photo-1576091160550-2173bdd9962a?auto=format&fit=crop&q=80&w=400" },
            { name: "AI & Data", icon: "analytics", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" },
          ].map((field, i) => (
            <TouchableOpacity key={i} style={styles.trendingPill} onPress={() => router.push(("/category/" + field.name) as any)}>
               <View style={styles.trendingImageWrap}>
                 <Image source={{ uri: field.image }} style={styles.trendingImage} />
               </View>
              <Text style={styles.trendingPillText}>{field.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Ranked Universities */}
        <SectionHeader title="Top Ranked Universities" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalList, { paddingBottom: 24 }]}>
          {UNIVERSITIES.slice(5, 10).map((u) => (
            <TouchableOpacity key={`top-${u.id}`} style={styles.cardContainerHorizontal} activeOpacity={0.9} onPress={() => router.push(("/university/" + u.id) as any)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: u.image }} style={styles.cardImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={10} color={THEME.orange} />
                  <Text style={styles.ratingText}>{u.rating || "4.5"}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {u.title}
              </Text>
              <View style={styles.cardInfoRow}>
                <View style={styles.cardLocationBox}>
                  <Ionicons name="location" size={12} color={THEME.orange} />
                  <Text style={styles.cardLocationText} numberOfLines={1}>
                    {u.location}
                  </Text>
                </View>
                <Text style={styles.reviewsText}>({u.reviews || "500"})</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 64 : 44, // Generous padding 
    paddingBottom: 16,
    backgroundColor: THEME.bgLight,
  },
  headerLeft: {
    flexDirection: "column",
  },
  locationLabel: {
    fontSize: 12,
    color: THEME.textDark,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: THEME.textDark,
    marginLeft: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: THEME.textDark,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroBanner: {
    marginHorizontal: 24,
    backgroundColor: THEME.heroBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 180,
  },
  heroContent: {
    flex: 1.4,
    paddingRight: 10,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 11,
    color: THEME.textDark,
    lineHeight: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  heroButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: THEME.bgLight,
    fontWeight: "bold",
    fontSize: 12,
  },
  heroImageContainer: {
    flex: 1,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: "500",
  },
  horizontalList: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  destinationItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  destinationIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.bgLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden", // Keep image inside circle
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  destinationText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "500",
  },
  degreeItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  degreeIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#F3F4F6", 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    position: "relative",
  },
  degreeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  degreeIconOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  degreeText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "600",
  },
  trendingPill: {
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  trendingImageWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#F3F4F6",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trendingPillText: {
    color: THEME.textDark,
    fontWeight: "600",
    fontSize: 13,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  bookmarkSmall: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  reviewsText: {
    fontSize: 10,
    color: THEME.textGray,
  },
  cardContainerHorizontal: {
    width: 170, // Horizontal scrolling card width
    marginHorizontal: 8,
  },
  imageContainer: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  cardLocationBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  cardLocationText: {
    fontSize: 11,
    color: THEME.textGray,
    marginLeft: 4,
  },
});
