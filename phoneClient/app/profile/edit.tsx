import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#1A8A99",
  textDark: "#111827",
  textGray: "#64748B",
  white: "#FFFFFF",
  bgSubtle: "#F8FAFF",
  border: "#E5E7EB",
};

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "Something Surname",
    username: "something123",
    email: "something@example.com",
    phone: "+1 234 567 890",
  });

  const handleSave = () => {
    // Simulate saving
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
             <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollInner}>
          
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
               <Ionicons name="person" size={50} color={COLORS.textGray} />
               <TouchableOpacity style={styles.cameraIcon}>
                  <Feather name="camera" size={16} color="white" />
               </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                value={formData.name}
                onChangeText={(val) => setFormData({...formData, name: val})}
                placeholder="Full Name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput 
                style={styles.input}
                value={formData.username}
                onChangeText={(val) => setFormData({...formData, username: val})}
                placeholder="Username"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input}
                value={formData.email}
                onChangeText={(val) => setFormData({...formData, email: val})}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input}
                value={formData.phone}
                onChangeText={(val) => setFormData({...formData, phone: val})}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Additional Settings */}
          <View style={styles.footerInfo}>
             <Text style={styles.footerText}>
                Your profile information is used to personalize your university recommendations and study journey.
             </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.primary + "15",
  },
  saveButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
  scrollInner: {
    padding: 24,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerInfo: {
    marginTop: 40,
    padding: 20,
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 18,
    textAlign: "center",
  },
});
