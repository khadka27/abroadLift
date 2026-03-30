import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { UserProvider } from "./context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
