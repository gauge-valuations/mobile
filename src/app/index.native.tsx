import { Redirect } from "expo-router";

// The iOS and Android apps skip the web landing page and open the report screen.
export default function Index() {
  return <Redirect href="/report" />;
}
