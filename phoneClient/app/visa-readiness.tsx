import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { router, Stack } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#33BFFF",
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#64748B",
  white: "#FFFFFF",
  bgSubtle: "#F8FAFF",
  green: "#10B981",
  orange: "#F97316",
  red: "#EF4444",
  border: "#E2E8F0",
};

export default function VisaReadinessPage() {
  const insets = useSafeAreaInsets();

  const READINESS_DATA = [
    { title: "Academic Proof", status: "Strong", score: 90, color: COLORS.green, icon: "school" },
    { title: "Financial Support", status: "Weak", score: 40, color: COLORS.orange, icon: "wallet" },
    { title: "Language Proficiency", status: "Ready", score: 95, color: COLORS.green, icon: "chatbubbles" },
    { title: "Personal History", status: "Incomplete", score: 20, color: COLORS.red, icon: "person" },
  ];

  const DOCUMENTS = [
    { id: 1, name: "Passport (Valid > 6 months)", status: "verified" },
    { id: 2, name: "Acceptance Letter (CAS/I-20)", status: "pending" },
    { id: 3, name: "6-Month Bank Statement", status: "missing" },
    { id: 4, name: "Sponsorship Affidavit", status: "pending" },
    { id: 5, name: "Previous Academic Transcripts", status: "verified" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? (insets.top || 30) + 10 : insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visa Readiness</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollInner, { paddingBottom: 40 + insets.bottom }]}
      >
        
        {/* Readiness Overview Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreMain}>
             <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>60%</Text>
                <Text style={styles.scoreLabel}>Ready</Text>
             </View>
             <View style={styles.scoreTextContent}>
                <Text style={styles.statusBadge}>Status: <Text style={{ color: COLORS.orange }}>Needs Work</Text></Text>
                <Text style={styles.scoreQuote}>"Your visa probability is high but requires financial documentation."</Text>
             </View>
          </View>
          <View style={styles.scoreProgressBarContainer}>
             <View style={[styles.scoreProgressBar, { width: "60%" }]} />
          </View>
        </View>

        {/* Breakdown Section */}
        <Text style={styles.sectionTitle}>Profile Breakdown</Text>
        <View style={styles.breakdownGrid}>
           {READINESS_DATA.map((item, idx) => (
             <View key={idx} style={styles.breakdownItem}>
                <View style={[styles.iconCircle, { backgroundColor: item.color + "15" }]}>
                   <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                   <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={[styles.itemStatus, { color: item.color }]}>{item.status}</Text>
                   </View>
                   <View style={styles.miniProgressBackground}>
                      <View style={[styles.miniProgressFill, { width: `${item.score}%`, backgroundColor: item.color }]} />
                   </View>
                </View>
             </View>
           ))}
        </View>

        {/* Document Checklist */}
        <View style={styles.documentSection}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Document Checklist</Text>
              <Text style={styles.countText}>2/5 Completed</Text>
           </View>

           <View style={styles.checklistCard}>
              {DOCUMENTS.map((doc, idx) => (
                <View key={doc.id} style={[styles.docItem, idx === DOCUMENTS.length - 1 && { borderBottomWidth: 0 }]}>
                   <View style={styles.docLeft}>
                      <View style={styles.statusCircle}>
                         {doc.status === 'verified' ? (
                           <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
                         ) : doc.status === 'pending' ? (
                           <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.orange} />
                         ) : (
                           <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.red} />
                         )}
                      </View>
                      <Text style={[styles.docName, doc.status === 'verified' && styles.verifiedText]}>{doc.name}</Text>
                   </View>
                   <TouchableOpacity>
                      <Feather name="upload" size={18} color={COLORS.primary} />
                   </TouchableOpacity>
                </View>
              ))}
           </View>
        </View>

        {/* Action Plan */}
        <View style={styles.actionPlan}>
           <Text style={styles.sectionTitle}>Critical Action Plan</Text>
           <View style={styles.actionCard}>
              <View style={styles.actionPoint}>
                 <View style={styles.bulletDot} />
                 <Text style={styles.actionText}>Upload 6-month bank statement from a single sponsor.</Text>
              </View>
              <View style={styles.actionPoint}>
                 <View style={styles.bulletDot} />
                 <Text style={styles.actionText}>Finalize your SOP (Statement of Purpose) draft.</Text>
              </View>
              <TouchableOpacity style={styles.improveButton}>
                 <Text style={styles.improveButtonText}>Improve Strategy Now</Text>
                 <Feather name="arrow-right" size={18} color="white" />
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  scrollInner: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  scoreMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: COLORS.primary + "20",
    borderTopColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.textGray,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  scoreTextContent: {
    flex: 1,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  scoreQuote: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 18,
    fontStyle: "italic",
  },
  scoreProgressBarContainer: {
    height: 8,
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreProgressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  breakdownGrid: {
    gap: 16,
    marginBottom: 32,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSubtle,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: "900",
  },
  miniProgressBackground: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 2,
  },
  miniProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  documentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  checklistCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
  },
  docItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  docLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 15,
  },
  statusCircle: {
    marginRight: 12,
  },
  docName: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  verifiedText: {
    color: COLORS.textGray,
    textDecorationLine: "line-through",
    opacity: 0.8,
  },
  actionPlan: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#FDF5E1",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(146, 64, 14, 0.1)",
  },
  actionPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.orange,
    marginTop: 6,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: "#92400E",
    fontWeight: "600",
    lineHeight: 20,
  },
  improveButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  improveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
});
