import PrimaryButton from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCurrencyPreference } from "@/features/currency/context/CurrencyContext";
import { db } from "@/services/firebase";
import { CURRENCY_OPTIONS, getCurrencyDisplayName } from "@/utils/currency";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { currency, setCurrencyPreference } = useCurrencyPreference(user?.uid);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const profile = {
    name: user?.displayName || "OneTap User",
    email: user?.email || "No email",
    university: "",
  };

  const handleCurrencyPress = () => {
    Alert.alert(
      "Default Currency",
      "Choose the currency you want to use for expense amounts.",
      [
        ...CURRENCY_OPTIONS.map((option) => ({
          text:
            option.code === currency.code
              ? `${option.label} (${option.code}) - Selected`
              : `${option.label} (${option.code})`,
          onPress: () => setCurrencyPreference(option.code),
        })),
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  const submitDeletionRequest = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "You need to be logged in to submit a request.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "deletionRequests"), {
        userId: user.uid,
        userEmail: user.email || "",
        userDisplayName: user.displayName || "",
        status: "pending",
        source: "mobile-app",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Request submitted",
        "Your account deletion request was sent. We will process it shortly.",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit request. Please try again.");
    }
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      "Request account deletion",
      "This will send a deletion request to support. Your account is not deleted immediately.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send request",
          style: "destructive",
          onPress: submitDeletionRequest,
        },
      ],
    );
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
                <Image
                  source={require("@/assets/images/lightlogo.png")}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>
                  {profile.name}
                </ThemedText>
                <ThemedText style={styles.profileEmail}>
                  {profile.email}
                </ThemedText>
                {!!profile.university && (
                  <ThemedText style={styles.profileMeta}>
                    {profile.university}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
            <View
              style={[
                styles.menuCard,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBackground,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuRow}
                onPress={handleCurrencyPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <ThemedText style={styles.menuLabel}>
                    Default Currency
                  </ThemedText>
                  <ThemedText style={styles.menuSubtext}>
                    {getCurrencyDisplayName(currency.code)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.menuChevron}>{">"}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.logoutSection}>
            <TouchableOpacity
              onPress={handleRequestDeletion}
              style={[
                styles.deleteRequestButton,
                {
                  borderColor: "#FF7B7B",
                  backgroundColor: themeColors.cardBackground,
                },
              ]}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.deleteRequestText}>
                Request Account Deletion
              </ThemedText>
            </TouchableOpacity>

            <View style={{ height: 12 }} />
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
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  deleteRequestButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteRequestText: {
    color: "#FF7B7B",
    fontWeight: "700",
  },
});
