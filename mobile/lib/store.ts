import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getDeviceId } from "./device";
import {
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "./language";
import { normalizeInterest, type InterestId } from "./options";
import { RECENT_STORIES, type Story } from "./stories";

function normalizeStory(story: Story): Story {
  return {
    ...story,
    interest: normalizeInterest(String(story.interest)) as InterestId,
  };
}

interface StoryStore {
  deviceId: string | null;
  language: Language;
  library: Story[];
  savedIds: string[];
  hydrated: boolean;
  initDevice: () => Promise<void>;
  setLanguage: (lang: Language) => void;
  addStory: (story: Story) => void;
  getStory: (id: string) => Story | undefined;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  setHydrated: (value: boolean) => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      deviceId: null,
      language: "en",
      library: [...RECENT_STORIES],
      savedIds: [],
      hydrated: false,

      initDevice: async () => {
        const deviceId = await getDeviceId();
        // Prefer dedicated language key if set independently
        try {
          const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
          if (isLanguage(stored)) {
            set({ deviceId, language: stored });
            return;
          }
        } catch {
          /* ignore */
        }
        set({ deviceId });
      },

      setLanguage: (lang) => {
        if (!isLanguage(lang)) return;
        set({ language: lang });
        AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang).catch(() => {});
      },

      addStory: (story) =>
        set((state) => ({
          library: [
            normalizeStory(story),
            ...state.library.filter((s) => s.id !== story.id),
          ],
        })),

      getStory: (id) => get().library.find((s) => s.id === id),

      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((x) => x !== id)
            : [...state.savedIds, id],
        })),

      isSaved: (id) => get().savedIds.includes(id),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "moonlit_stories",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
        language: state.language,
        library: state.library,
        savedIds: state.savedIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.library) {
          state.library = state.library.map(normalizeStory);
        }
        if (state?.language) {
          AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, state.language).catch(
            () => {},
          );
        }
        state?.setHydrated(true);
      },
    },
  ),
);
