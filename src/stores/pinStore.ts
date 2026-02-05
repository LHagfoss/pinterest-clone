import { create } from "zustand";
import type { Pin } from "@/src/schemas";

interface PinState {
    selectedPin: Pin | null;
    setSelectedPin: (pin: Pin | null) => void;
}

export const usePinStore = create<PinState>((set) => ({
    selectedPin: null,
    setSelectedPin: (pin) => set({ selectedPin: pin }),
}));
