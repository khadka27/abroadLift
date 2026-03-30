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
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

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
  divider: "#F1F5F9",
};

const SectionHeader = ({ title, icon, color, expanded = true }: { title: string; icon: any; color: string; expanded?: boolean }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionIconBox, { backgroundColor: color + "15" }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={THEME.textGray} />
  </View>
);

const CostItem = ({ label, value, subValue }: { label: string; value: string; subValue?: string }) => (
  <View style={styles.costItemRow}>
    <Text style={styles.costLabel}>{label}</Text>
    <View style={styles.costValueWrapper}>
      {subValue && <Text style={styles.costSubValue}>{subValue}</Text>}
      <Text style={styles.costValueText}>{value}</Text>
    </View>
  </View>
);

export default function CostBreakdownScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={THEME.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cost Breakdown</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={44} color="#E2E8F0" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryTitle}>Total Estimated Cost</Text>
              <Text style={styles.summaryValue}>NPR 25 - 40 Lakhs</Text>
              <View style={styles.averageBadge}>
                <View style={styles.orangeDot} />
                <Text style={styles.averageBadgeText}>Average Cost</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              {/* Mock Doughnut Chart using nested Circles */}
              <View style={[styles.chartBase, { borderColor: '#E2E8F0' }]}>
                <View style={[styles.chartSegment, { borderColor: '#10B981', borderLeftColor: 'transparent', transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.chartSegment, { borderColor: '#F59E0B', borderBottomColor: 'transparent', transform: [{ rotate: '-45deg' }] }]} />
              </View>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryFooter}>
            <Ionicons name="information-circle-outline" size={16} color={THEME.textGray} />
            <Text style={styles.summaryFooterText}>Cost based on country, lifestyle, university.</Text>
          </View>
        </View>

        {/* Breakdown Sections */}
        <View style={styles.breakdownContainer}>
          
          {/* Pre-application Cost */}
          <View style={styles.sectionBox}>
            <SectionHeader title="Pre-application Cost" icon="currency-usd" color={THEME.green} />
            <View style={styles.sectionBody}>
              <CostItem label="Consultancy Fee" value="NPR 0 - 50,000" />
              <CostItem label="IELTS Test" value="NPR 27,000 - 30,000" />
              <CostItem label="Documents" value="NPR 27,000 - 30,000" />
              <CostItem label="Medical" value="NPR 27,000 - 30,000" />
              <CostItem label="Application Fees" value="NPR 27,000 - 30,000" />
            </View>
          </View>

          {/* Tuition Fees */}
          <View style={styles.sectionBox}>
            <SectionHeader title="Tuition Fees" icon="school-outline" color={THEME.orange} />
            <View style={styles.sectionBody}>
              <CostItem label="USA/UK" value="NPR 17-44 Lakhs" subValue="per year " />
              <CostItem label="Canada/Australia" value="NPR 17-44 Lakhs" subValue="per year " />
              <CostItem label="Germany/Europe" value="NPR 17-44 Lakhs" subValue="per year " />
            </View>
          </View>

          {/* Visa & Government Costs */}
          <View style={styles.sectionBox}>
            <SectionHeader title="Visa & Government Costs" icon="card-account-details-outline" color={THEME.blue} />
            <View style={styles.sectionBody}>
              <CostItem label="Visa Fee" value="NPR 1.5-5 Lakhs" subValue="Insurance - " />
              <CostItem label="Biometrics" value="" />
            </View>
          </View>

          {/* Travel & Setup */}
          <View style={styles.sectionBox}>
            <SectionHeader title="Travel & Setup" icon="airplane-takeoff" color="#A855F7" />
            <View style={styles.sectionBody}>
              <CostItem label="Flight Ticket" value="NPR 47,000 - 2 Lakhs" />
            </View>
          </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.textDark,
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
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: "#FDF9F3", // Warm cream
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FBEBD6",
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.textDark,
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
    color: THEME.textDark,
    marginBottom: 12,
  },
  averageBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBEBD6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.orange,
  },
  averageBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.orange,
  },
  chartContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  chartBase: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 10,
    position: 'relative',
  },
  chartSegment: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 10,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryFooterText: {
    fontSize: 11,
    color: THEME.textGray,
    fontWeight: "500",
  },
  breakdownContainer: {
    gap: 20,
  },
  sectionBox: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.divider,
    backgroundColor: THEME.white,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: THEME.white,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.textDark,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
    paddingVertical: 8,
  },
  costItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.divider,
  },
  costLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  costValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  costSubValue: {
    fontSize: 11,
    color: THEME.textGray,
    fontWeight: "500",
  },
  costValueText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
  },
});
