import PrimaryButton from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
 
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const user = {
    name: "Ko Tee",
    email: "ko.tee@lamduan.mfc.ac.th",
    university: "Mae Fah Luan University",
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        { label: "Profile", subtext: "Update your personal info" },
        { label: "Payment Methods", subtext: "Manage cards and wallets" },
        { label: "Security", subtext: "PIN, biometrics, and device" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { label: "Default Currency", subtext: "Thai Baht (THB)" },
        { label: "Notifications", subtext: "Budget alerts and reminders" },
        { label: "Monthly Budget", subtext: "Set your spending cap" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Help Center", subtext: "FAQs and guides" },
        { label: "Feedback", subtext: "Share ideas or report issues" },
        { label: "About", subtext: "Version and legal" },
      ],
    },
  ];

  const handleLogout = () => {
    router.replace("/");
    console.log("User logged out");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
     
          <View
            style={[
              styles.profileCard,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBackground,
              },
            ]}
          >
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>KT</ThemedText>
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>{user.name}</ThemedText>
                <ThemedText style={styles.profileEmail}>
                  {user.email}
                </ThemedText>
                <ThemedText style={styles.profileMeta}>
                  {user.university}
                </ThemedText>
              </View>
            </View>
          </View>

          {menuSections.map((section) => (
            <View key={section.title} style={styles.sectionBlock}>
              <ThemedText style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <View
                style={[
                  styles.menuCard,
                  {
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cardBackground,
                  },
                ]}
              >
                {section.items.map((item, index) => (
                  <View key={item.label}>
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={() => console.log(`${item.label} pressed`)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuLeft}>
                        <ThemedText style={styles.menuLabel}>
                          {item.label}
                        </ThemedText>
                        <ThemedText style={styles.menuSubtext}>
                          {item.subtext}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.menuChevron}>{">"}</ThemedText>
                    </TouchableOpacity>
                    {index < section.items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: themeColors.border },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.logoutSection}>
            <PrimaryButton title="Logout" onPress={handleLogout} />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profileMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  menuCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuLeft: {
    flex: 1,
    paddingRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  menuSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  menuChevron: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  logoutSection: {
    marginTop: 6,
  },
});
