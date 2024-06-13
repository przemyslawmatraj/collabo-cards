import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

function removeUserMetaData(itemValue: string) {
  let parsedItemValue = JSON.parse(itemValue);

  // Remove properties from the object
  if (parsedItemValue) {
    delete parsedItemValue.user?.identities;
    delete parsedItemValue.user?.user_metadata;
  }
  // Convert the modified object back to a JSON string
  return JSON.stringify(parsedItemValue);
}

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, removeUserMetaData(value));
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = "https://cuswdytdvmvhbxgujhre.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c3dkeXRkdm12aGJ4Z3VqaHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NDY5ODUsImV4cCI6MjAyOTEyMjk4NX0.hBX046AL6XtCfK2DmVGUw46qjfLwk-gwnLJ40Lph5ZA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
