import { create } from 'zustand';

type Page = "home" | "list-topics" | "list-groups";

interface State {
  page: Page,
  setPage: (page: Page) => void
}

export const useStore = create<State>((set) => ({
  page: "home",
  setPage: (page: Page) => set({page})
}))
