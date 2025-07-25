import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "../../scripts/friebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        alert("Login failed. " + error.message);
      } else {
        alert("Login failed.");
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={{ marginTop: 10 }}
        onPress={() => router.push("/auth/signup")}
      >
        Don&apos;t have an account? Sign Up
      </Text>
    </View>
  );
}
