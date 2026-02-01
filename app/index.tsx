import { Redirect } from "expo-router";

/**
 * Index route decides where to send the user based on authentication status.
 */
export default function Index() {
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
