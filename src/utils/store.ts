import { create } from 'zustand';

type Page = "home" | "list-topics" | "list-groups";

interface State {
  page: Page,
  history: Page[],
  setPage: (page: Page) => void,
  historyBack: () => void
}

export const useStore = create<State>((set) => ({
  page: "home",
  history: ["home"],
  setPage: (page: Page) => {
    set((state) => (
      {
        page,
        history: [
          ...state.history,
          page
        ]
      }
    ))
  },
  historyBack: () => {
    // if last page is "home" do nothing
    // else pop last and set history
    set((state) => {
      if (state.history.length === 1) return state;
      const history = state.history.slice(0, -1)
      return {
        history,
        page: history[history.length - 1]
      }
    })
  }
}))
