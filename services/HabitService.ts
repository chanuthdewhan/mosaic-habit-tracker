import { Habit, HabitCompletion } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const HABITS_COL = "habits";
const COMPLETIONS_COL = "completions";

export const habitService = {
  createHabit: async (
    userId: string,
    data: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    const ref = collection(db, HABITS_COL);
    const payload = {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(ref, payload);
    return { id: docRef.id, ...payload };
  },

  getUserHabits: async (userId: string): Promise<Habit[]> => {
    const ref = collection(db, HABITS_COL);
    const q = query(
      ref,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() ?? new Date(),
      updatedAt: d.data().updatedAt?.toDate() ?? new Date(),
    })) as Habit[];
  },

  updateHabit: async (habitId: string, updates: Partial<Habit>) => {
    const ref = doc(db, HABITS_COL, habitId);
    // strip immutable fields before writing
    const { id, userId, createdAt, ...safe } = updates as any;
    await updateDoc(ref, { ...safe, updatedAt: Timestamp.now() });
  },

  deleteHabit: async (habitId: string, userId: string) => {
    await deleteDoc(doc(db, HABITS_COL, habitId));
    // cascade delete all completions for this habit
    const ref = collection(db, COMPLETIONS_COL);
    const q = query(
      ref,
      where("habitId", "==", habitId),
      where("userId", "==", userId),
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  },

  subscribeToHabits: (userId: string, callback: (habits: Habit[]) => void) => {
    const ref = collection(db, HABITS_COL);
    const q = query(
      ref,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snap) => {
      const habits = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
        updatedAt: d.data().updatedAt?.toDate() ?? new Date(),
      })) as Habit[];
      callback(habits);
    });
  },
};

export const completionService = {
  completeHabit: async (userId: string, habitId: string, note?: string) => {
    const ref = collection(db, COMPLETIONS_COL);
    const payload = {
      habitId,
      userId,
      completedAt: Timestamp.now(),
      note: note ?? null,
    };
    const docRef = await addDoc(ref, payload);
    return { id: docRef.id, ...payload };
  },

  uncompleteHabit: async (habitId: string, userId: string, date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const ref = collection(db, COMPLETIONS_COL);
    const q = query(
      ref,
      where("habitId", "==", habitId),
      where("userId", "==", userId),
      where("completedAt", ">=", Timestamp.fromDate(start)),
      where("completedAt", "<=", Timestamp.fromDate(end)),
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  },

  getHabitCompletions: async (
    habitId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<HabitCompletion[]> => {
    const ref = collection(db, COMPLETIONS_COL);
    const constraints: QueryConstraint[] = [
      where("habitId", "==", habitId),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
    ];
    if (startDate)
      constraints.push(
        where("completedAt", ">=", Timestamp.fromDate(startDate)),
      );
    if (endDate)
      constraints.push(where("completedAt", "<=", Timestamp.fromDate(endDate)));
    const snap = await getDocs(query(ref, ...constraints));
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      completedAt: d.data().completedAt?.toDate() ?? new Date(),
    })) as HabitCompletion[];
  },

  subscribeToCompletions: (
    userId: string,
    callback: (completions: HabitCompletion[]) => void,
  ) => {
    const ref = collection(db, COMPLETIONS_COL);
    const q = query(
      ref,
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
    );
    return onSnapshot(q, (snap) => {
      const completions = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        completedAt: d.data().completedAt?.toDate() ?? new Date(),
      })) as HabitCompletion[];
      callback(completions);
    });
  },
};
