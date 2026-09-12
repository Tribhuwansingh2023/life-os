import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  PlayerProfile,
  AttributeInfo,
  Quest,
  WorldRegion,
  BossBattle,
  InventoryItem,
  Badge,
  OracleInsight,
  ReplayDay
} from '../types';

export interface UserCloudState {
  userId: string;
  callsign: string;
  createdAt: string;
  updatedAt: string;
  player: PlayerProfile;
  attributes: Record<string, AttributeInfo>;
  quests: Quest[];
  regions: WorldRegion[];
  boss: BossBattle;
  inventory: InventoryItem[];
  badges: Badge[];
  replayDays: ReplayDay[];
}

/**
 * Timeout wrapper to prevent Firestore RPCs from hanging indefinitely
 * if Cloud Firestore API is disabled or connection is unavailable.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 3500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('FIRESTORE_TIMEOUT: Network deadline exceeded')), timeoutMs)
    )
  ]);
}

class FirestoreService {
  /**
   * Load the entire persistent state for an authenticated user.
   * Checks the primary document /users/{uid} and reconstructs the game state.
   */
  public async loadUserState(uid: string): Promise<UserCloudState | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await withTimeout(getDoc(userRef), 3500);

      if (!snap.exists()) {
        return null;
      }

      const data = snap.data() as UserCloudState;

      // Also check subcollections if present for quests, inventory, and replay
      try {
        const questsSubCol = collection(db, 'users', uid, 'quests');
        const questsSnap = await withTimeout(getDocs(questsSubCol), 2000);
        if (!questsSnap.empty) {
          const subQuests: Quest[] = [];
          questsSnap.forEach((d) => subQuests.push(d.data() as Quest));
          data.quests = subQuests;
        }
      } catch {
        // Fall back to array in primary user doc
      }

      return data;
    } catch (error) {
      console.warn(`[FirestoreService] Notice reading user state for ${uid}:`, error);
      return null;
    }
  }

  /**
   * Save the entire user state to /users/{uid}.
   */
  public async saveUserState(uid: string, state: Partial<UserCloudState>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await withTimeout(
        setDoc(
          userRef,
          {
            ...state,
            userId: uid,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ),
        3500
      );
    } catch (error) {
      console.warn(`[FirestoreService] Cloud sync notice:`, error);
    }
  }

  /**
   * Create a new quest under /users/{uid}/quests/{questId}
   */
  public async createQuest(uid: string, quest: Quest): Promise<void> {
    try {
      const questRef = doc(db, 'users', uid, 'quests', quest.id);
      await withTimeout(
        setDoc(questRef, {
          ...quest,
          updatedAt: new Date().toISOString()
        }),
        3500
      );
    } catch (error) {
      console.warn(`[FirestoreService] Notice creating quest ${quest.id}:`, error);
    }
  }

  /**
   * Update an existing quest under /users/{uid}/quests/{questId}
   */
  public async updateQuest(uid: string, questId: string, updates: Partial<Quest>): Promise<void> {
    try {
      const questRef = doc(db, 'users', uid, 'quests', questId);
      await withTimeout(
        setDoc(
          questRef,
          {
            ...updates,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ),
        3500
      );
    } catch (error) {
      console.warn(`[FirestoreService] Notice updating quest ${questId}:`, error);
    }
  }

  /**
   * Delete a quest from /users/{uid}/quests/{questId}
   */
  public async deleteQuest(uid: string, questId: string): Promise<void> {
    try {
      const questRef = doc(db, 'users', uid, 'quests', questId);
      await withTimeout(deleteDoc(questRef), 3500);
    } catch (error) {
      console.warn(`[FirestoreService] Notice deleting quest ${questId}:`, error);
    }
  }

  /**
   * Mark a quest complete under /users/{uid}/quests/{questId}
   */
  public async completeQuest(uid: string, questId: string, updates?: Partial<Quest>): Promise<void> {
    try {
      const questRef = doc(db, 'users', uid, 'quests', questId);
      await withTimeout(
        setDoc(
          questRef,
          {
            status: 'completed',
            completedAt: new Date().toISOString(),
            ...updates,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ),
        3500
      );
    } catch (error) {
      console.warn(`[FirestoreService] Notice completing quest ${questId}:`, error);
    }
  }

  /**
   * Save inventory items under /users/{uid}/inventory/{itemId}
   */
  public async saveInventory(uid: string, inventory: InventoryItem[]): Promise<void> {
    try {
      for (const item of inventory) {
        const itemRef = doc(db, 'users', uid, 'inventory', item.id);
        await withTimeout(setDoc(itemRef, item, { merge: true }), 2000);
      }
    } catch (error) {
      console.warn(`[FirestoreService] Notice saving inventory:`, error);
    }
  }

  /**
   * Save replay entry under /users/{uid}/replay/{entryId}
   */
  public async saveReplayEntry(uid: string, entry: ReplayDay): Promise<void> {
    try {
      const replayRef = doc(db, 'users', uid, 'replay', entry.dayName.toLowerCase());
      await setDoc(replayRef, entry, { merge: true });
    } catch (error) {
      console.error(`[FirestoreService] Failed to save replay entry:`, error);
    }
  }
}

export const firestoreService = new FirestoreService();
