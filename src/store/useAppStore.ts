import { TUser } from "@/service/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  profile: TUser;
  setProfile: (profile: TUser) => void;
  clearProfile: () => void;
}

const initialProfileState: TUser = {
  id: "",
  aud: "",
  role: "",
  email: "",
  phone: "",
  app_metadata: {
    provider: "",
    providers: [],
  },
  user_metadata: {
    email: "",
    email_verified: false,
    phone_verified: false,
  },
  identities: [
    {
      identity_id: "",
      id: "",
      user_id: "",
      identity_data: {
        email: "",
        email_verified: false,
        phone_verified: false,
        sub: "",
      },
    },
  ],
  is_anonymous: false,
};

const initialState: AppState = {
  profile: initialProfileState,
  setProfile: () => {},
  clearProfile: () => {},
};

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      ...initialState,
      setProfile: (profile: TUser) => {
        set((state) => {
          state.profile = profile;
        });
      },
      clearProfile: () =>
        set((state) => {
          state.profile = initialProfileState;
        }),
    })),
    {
      name: "app",
    }
  )
);
