import axios from "axios";
import { createStore } from "vuex";
export default createStore({
  state: {
    currentDay: null,
    currentDayDate: null,
    dailyMenu: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    repeatedMenu: null,
  },
  mutations: {
    SET_MENU(state, menu) {
      state.dailyMenu = menu;
    },
    SET_REPEATED(state, menu) {
      state.repeatedMenu = menu;
    },
  },
  getters: {
    getMenu: (state) => state.dailyMenu,
    getRepeated: (state) => state.repeatedMenu,
    getCurrentDay: (state) => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
      const currentHour = now.getHours();

      // After 14:00 (2 PM), show next day's menu
      const isAfter14 = currentHour >= 14;

      // Saturday (6) - show Monday's menu
      if (dayOfWeek === 6) {
        return state.dailyMenu.find((i) => i.id === 1);
      }

      // Sunday (0) - show Monday's menu
      if (dayOfWeek === 0) {
        return state.dailyMenu.find((i) => i.id === 1);
      }

      // Friday (5)
      if (dayOfWeek === 5) {
        // Before 14:00 show Friday's menu, after 14:00 show nothing
        if (isAfter14) {
          return null;
        }
        return state.dailyMenu.find((i) => i.id === 5);
      }

      // Monday (1) to Thursday (4)
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        if (isAfter14) {
          // Show next day's menu
          return state.dailyMenu.find((i) => i.id === dayOfWeek + 1);
        }
        // Show current day's menu
        return state.dailyMenu.find((i) => i.id === dayOfWeek);
      }

      return null;
    },
  },
  actions: {
    getMenu({ commit }) {
      axios.get("./json/menu.json").then((response) => {
        commit("SET_MENU", response.data.dailyMenu);
        commit("SET_REPEATED", response.data.dailyRepeat);
      });
    },
  },
});
