import type { FC } from "react";
import { Text } from "react-native";
import { PageView } from "@/components/layout";

const Home: FC = () => (
  <PageView>
    <Text className="text-white">Tab Home</Text>
  </PageView>
);

export default Home;
