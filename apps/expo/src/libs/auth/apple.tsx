import type { FC } from "react";
import { Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import {
  CryptoDigestAlgorithm,
  digestStringAsync,
  randomUUID,
} from "expo-crypto";
import { useRouter } from "expo-router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const AppleSignInButton: FC = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const signInWithApple = async () => {
    const { token, nonce } = await initiateAppleSignIn();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token,
      nonce,
    });
    if (error) return Alert.alert("Error", error.message);

    if (router.canGoBack()) return router.back();
    else return router.replace("/");
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={8}
      onPress={signInWithApple}
      style={{ height: 40 }}
    />
  );
};

const initiateAppleSignIn = async () => {
  const rawNonce = randomUUID();
  const hashedNonce = await digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const credential = await signInAsync({
    requestedScopes: [
      AppleAuthenticationScope.FULL_NAME,
      AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  const token = credential.identityToken;
  if (!token) throw new Error("No id token");

  return { token, nonce: rawNonce };
};
