import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide headers for cleaner login/signup screens
      }}
    />
  );
}
