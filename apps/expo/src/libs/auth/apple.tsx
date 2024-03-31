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
import { api } from "@/utils/api";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const AppleSignInButton: FC = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { mutateAsync } = api.profile.upsert.useMutation();

  const signInWithApple = async () => {
    const { token, nonce, name } = await initiateAppleSignIn();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token,
      nonce,
    });
    if (error) return Alert.alert("Error", error.message);

    await mutateAsync({ name, image: null });

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
    requestedScopes: [AppleAuthenticationScope.FULL_NAME],
    nonce: hashedNonce,
  });

  const token = credential.identityToken;
  if (!token) throw new Error("No id token");

  return {
    token,
    nonce: rawNonce,
    name: getFullName(credential) ?? "匿名ユーザー",
  };
};

const getFullName = (
  credential: AppleAuthentication.AppleAuthenticationCredential,
) =>
  credential.fullName?.familyName && credential.fullName?.givenName
    ? `${credential.fullName?.familyName} ${credential.fullName?.givenName}`
    : credential.fullName?.familyName ?? credential.fullName?.givenName ?? null;
