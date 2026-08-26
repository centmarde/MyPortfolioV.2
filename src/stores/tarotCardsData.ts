import { create } from "zustand";
import type { TarotReadingSession } from "@/lib/AiTarotReading";
import {
  calculateEndDate,
  formatDisplayDate,
  formatDisplayTime,
} from "@/utils/helpers";
// -----------------------------------------------------------------------------
// Tarot decks are stored locally (zustand state + browser localStorage cache).
// No database is used - data lives entirely on the client.
// -----------------------------------------------------------------------------
const STORAGE_KEY = "tarot_decks_cache";

// Key used to persist the current user's email (the email decks are filtered
// by in getMyDecks). Shared with the tarot selection store.
export const CURRENT_USER_EMAIL_KEY = "tarot_user_email";

/** Read the current user's email from localStorage (or null if not set). */
export function getUserEmail(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const email = window.localStorage.getItem(CURRENT_USER_EMAIL_KEY);
    return email && email.trim() !== "" ? email.trim() : null;
  } catch (error) {
    console.warn("🔮 Failed to read current user email:", error);
    return null;
  }
}

function loadDecksFromCache(): TarotCardsDeck[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TarotCardsDeck[]) : [];
  } catch (error) {
    console.warn("🔮 Failed to load tarot decks from cache:", error);
    return [];
  }
}

function saveDecksToCache(decks: TarotCardsDeck[]) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (error) {
    console.warn("🔮 Failed to cache tarot decks:", error);
  }
}

function nextDeckId(decks: TarotCardsDeck[]): number {
  if (decks.length === 0) return Date.now();
  return Math.max(...decks.map((deck) => deck.id)) + 1;
}

const sortByCreatedAtDesc = (a: TarotCardsDeck, b: TarotCardsDeck) =>
  b.created_at.localeCompare(a.created_at);

// Types matching the old database schema
export interface TarotCardData {
  name: string;
  aiDescription: string; // Store AI interpretation instead of original description
  [key: string]: string | number | boolean | null | undefined; // Allow additional properties for JSONB flexibility
}

export interface TarotCardsDeck {
  id: number;
  created_at: string;
  email: string | null;
  end_date: string | null;
  card1: TarotCardData | null;
  card2: TarotCardData | null;
  card3: TarotCardData | null;
  card4: TarotCardData | null;
  card5: TarotCardData | null;
  card6: TarotCardData | null;
}

export interface CreateTarotCardsDeckInput {
  email?: string | null;
  end_date?: string | null;
  card1?: TarotCardData | null;
  card2?: TarotCardData | null;
  card3?: TarotCardData | null;
  card4?: TarotCardData | null;
  card5?: TarotCardData | null;
  card6?: TarotCardData | null;
}

export interface UpdateTarotCardsDeckInput extends CreateTarotCardsDeckInput {
  id: number;
}

interface TarotCardsDataState {
  // State
  decks: TarotCardsDeck[];
  currentDeck: TarotCardsDeck | null;
  isLoading: boolean;
  error: string | null;

  // CRUD Actions
  createDeck: (
    deck: CreateTarotCardsDeckInput,
  ) => Promise<TarotCardsDeck | null>;
  getDeck: (id: number) => Promise<TarotCardsDeck | null>;
  getAllDecks: () => Promise<TarotCardsDeck[]>;
  updateDeck: (
    deck: UpdateTarotCardsDeckInput,
  ) => Promise<TarotCardsDeck | null>;
  deleteDeck: (id: number) => Promise<boolean>;

  // Utility Actions
  setCurrentDeck: (deck: TarotCardsDeck | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;

  // Filtering Actions
  getMyDecks: () => Promise<TarotCardsDeck[]>;
  getRecentDecks: (limit?: number) => Promise<TarotCardsDeck[]>;

  // AI Reading Integration
  saveFromAiReading: (
    session: TarotReadingSession,
    email?: string | null,
  ) => Promise<TarotCardsDeck | null>;
}

export const useTarotCardsDataStore = create<TarotCardsDataState>(
  (set, get) => ({
    // Initial State (loaded from the local browser cache)
    decks: loadDecksFromCache(),
    currentDeck: null,
    isLoading: false,
    error: null,

    // CRUD Operations
    createDeck: async (deckData: CreateTarotCardsDeckInput) => {
      set({ isLoading: true, error: null });

      try {
        const createdAt = new Date().toISOString();
        const deck: TarotCardsDeck = {
          id: nextDeckId(get().decks),
          created_at: createdAt,
          // IMPORTANT: keep the email exactly as provided so it can be compared
          // against the current user's email when filtering "my" decks.
          email: deckData.email ?? null,
          end_date: deckData.end_date || calculateEndDate(createdAt),
          card1: deckData.card1 || null,
          card2: deckData.card2 || null,
          card3: deckData.card3 || null,
          card4: deckData.card4 || null,
          card5: deckData.card5 || null,
          card6: deckData.card6 || null,
        };

        // Add to local state and cache
        const decks = [...get().decks, deck];
        set({ decks, currentDeck: deck, isLoading: false });
        saveDecksToCache(decks);

        console.log("🔮 Created tarot deck:", deck.id);
        return deck;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create deck";
        console.error("🔮 Error creating deck:", error);
        set({ error: errorMessage, isLoading: false });
        return null;
      }
    },

    getDeck: async (id: number) => {
      set({ isLoading: true, error: null });

      const existingDeck = get().decks.find((deck) => deck.id === id) || null;

      if (existingDeck) {
        set({ currentDeck: existingDeck, isLoading: false });
        return existingDeck;
      }

      set({ error: "Deck not found", isLoading: false });
      return null;
    },

    getAllDecks: async () => {
      const decks = [...get().decks].sort(sortByCreatedAtDesc);
      set({ decks, isLoading: false, error: null });
      return decks;
    },

    updateDeck: async (deckData: UpdateTarotCardsDeckInput) => {
      set({ isLoading: true, error: null });

      try {
        const currentDecks = get().decks;
        const index = currentDecks.findIndex((deck) => deck.id === deckData.id);

        if (index === -1) {
          set({ error: "Deck not found", isLoading: false });
          return null;
        }

        const current = currentDecks[index];
        const updated: TarotCardsDeck = {
          ...current,
          email:
            deckData.email !== undefined ? deckData.email : current.email,
          end_date:
            deckData.end_date !== undefined
              ? deckData.end_date
              : current.end_date,
          card1: deckData.card1 !== undefined ? deckData.card1 : current.card1,
          card2: deckData.card2 !== undefined ? deckData.card2 : current.card2,
          card3: deckData.card3 !== undefined ? deckData.card3 : current.card3,
          card4: deckData.card4 !== undefined ? deckData.card4 : current.card4,
          card5: deckData.card5 !== undefined ? deckData.card5 : current.card5,
          card6: deckData.card6 !== undefined ? deckData.card6 : current.card6,
        };

        const decks = [...currentDecks];
        decks[index] = updated;

        set({
          decks,
          currentDeck:
            get().currentDeck?.id === deckData.id ? updated : get().currentDeck,
          isLoading: false,
        });
        saveDecksToCache(decks);

        console.log("🔮 Updated tarot deck:", updated.id);
        return updated;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update deck";
        console.error("🔮 Error updating deck:", error);
        set({ error: errorMessage, isLoading: false });
        return null;
      }
    },

    deleteDeck: async (id: number) => {
      set({ isLoading: true, error: null });

      try {
        const decks = get().decks.filter((deck) => deck.id !== id);

        set({
          decks,
          currentDeck: get().currentDeck?.id === id ? null : get().currentDeck,
          isLoading: false,
        });
        saveDecksToCache(decks);

        console.log("🔮 Deleted tarot deck:", id);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete deck";
        console.error("🔮 Error deleting deck:", error);
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },

    // Utility Actions
    setCurrentDeck: (deck: TarotCardsDeck | null) => {
      set({ currentDeck: deck });
    },

    clearError: () => {
      set({ error: null });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    // Filtering Actions
    getMyDecks: async () => {
      set({ isLoading: true, error: null });

      try {
        // "My" decks are those owned by the current user's email. When no email
        // is configured yet, fall back to decks that were saved without an email.
        const currentEmail = getUserEmail();
        const decks = get()
          .decks.filter((deck) =>
            currentEmail ? deck.email === currentEmail : !deck.email,
          )
          .sort(sortByCreatedAtDesc);

        set({ isLoading: false });
        return decks;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get my decks";
        console.error("🔮 Error getting my decks:", error);
        set({ error: errorMessage, isLoading: false });
        return [];
      }
    },

    getRecentDecks: async (limit: number = 10) => {
      set({ isLoading: true, error: null });

      try {
        const decks = [...get().decks]
          .sort(sortByCreatedAtDesc)
          .slice(0, limit);

        set({ isLoading: false });
        return decks;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get recent decks";
        console.error("🔮 Error getting recent decks:", error);
        set({ error: errorMessage, isLoading: false });
        return [];
      }
    },

    // AI Reading Integration
    saveFromAiReading: async (
      session: TarotReadingSession,
      email: string | null = null,
    ) => {
      set({ isLoading: true, error: null });

      try {
        // Convert AI reading session to deck format
        const createdAt = new Date(session.createdAt).toISOString();
        const endDate = calculateEndDate(createdAt);

        // Transform AI readings to TarotCardData format
        const cards: (TarotCardData | null)[] = [];

        // Ensure we have exactly 6 cards
        for (let i = 0; i < 6; i++) {
          const reading = session.readings.find((r) => r.cardIndex === i);
          if (reading) {
            cards.push({
              name: reading.cardName,
              aiDescription: reading.aiInterpretation,
            });
          } else {
            cards.push(null);
          }
        }

        // Create deck data
        const deckData: CreateTarotCardsDeckInput = {
          email,
          end_date: endDate,
          card1: cards[0],
          card2: cards[1],
          card3: cards[2],
          card4: cards[3],
          card5: cards[4],
          card6: cards[5],
        };

        // Use existing createDeck method
        const result = await get().createDeck(deckData);

        console.log(
          `🔮 Saved AI reading session ${session.sessionId}:`,
          result,
        );

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save AI reading to cache";
        console.error("🔮 Error saving AI reading to cache:", error);
        set({ error: errorMessage, isLoading: false });
        return null;
      }
    },
  }),
);

// Helper functions for working with tarot cards
export const useTarotCardsHelpers = () => {
  const store = useTarotCardsDataStore();

  return {
    // Save AI reading session to local state/cache
    saveAiReadingToDatabase: async (
      session: TarotReadingSession,
      email?: string | null,
    ) => {
      return await store.saveFromAiReading(session, email);
    },

    // Save current tarot reading to local state/cache (legacy support)
    saveCurrentReading: async (
      cards: TarotCardData[],
      email?: string | null,
    ) => {
      const deckData: CreateTarotCardsDeckInput = {
        email: email || null,
        card1: cards[0] || null,
        card2: cards[1] || null,
        card3: cards[2] || null,
        card4: cards[3] || null,
        card5: cards[4] || null,
        card6: cards[5] || null,
      };

      return await store.createDeck(deckData);
    },

    // Get all cards from a deck as array
    getCardsFromDeck: (deck: TarotCardsDeck): TarotCardData[] => {
      return [
        deck.card1,
        deck.card2,
        deck.card3,
        deck.card4,
        deck.card5,
        deck.card6,
      ].filter(Boolean) as TarotCardData[];
    },

    // Check if deck has complete reading (6 cards)
    isCompleteReading: (deck: TarotCardsDeck): boolean => {
      return !!(
        deck.card1 &&
        deck.card2 &&
        deck.card3 &&
        deck.card4 &&
        deck.card5 &&
        deck.card6
      );
    },

    // Format deck for display
    formatDeckForDisplay: (deck: TarotCardsDeck) => ({
      id: deck.id,
      date: formatDisplayDate(deck.created_at),
      time: formatDisplayTime(deck.created_at),
      endDate: deck.end_date ? formatDisplayDate(deck.end_date) : null,
      email: deck.email,
      cardCount: [
        deck.card1,
        deck.card2,
        deck.card3,
        deck.card4,
        deck.card5,
        deck.card6,
      ].filter(Boolean).length,
      isComplete: !!(
        deck.card1 &&
        deck.card2 &&
        deck.card3 &&
        deck.card4 &&
        deck.card5 &&
        deck.card6
      ),
      isAiReading: !!deck.card1?.aiDescription, // Check if this is an AI reading
    }),

    // Get display description (AI or fallback)
    getCardDescription: (card: TarotCardData | null): string => {
      if (!card) return "";
      return card.aiDescription || "No AI interpretation available";
    },
  };
};
