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
      const curDay = new Date();
      const currentHour = curDay.getHours();
      let dayToShow = curDay.getDay();

      // After 2PM (14:00), show next day's menu (except Friday)
      if (currentHour >= 14 && dayToShow >= 1 && dayToShow <= 4) {
        // Monday-Thursday after 2PM: show next day
        dayToShow = dayToShow + 1;
      }

      // Friday after 2PM or Saturday: don't show menu (next week not ready yet)
      if (dayToShow === 5 && currentHour >= 14) {
        return null;
      }
      if (dayToShow === 6) {
        return null;
      }

      // On Sunday, show Monday's menu (freshly uploaded)
      if (dayToShow === 0) {
        return state.dailyMenu.find((i) => i.id == 1);
      } else if (dayToShow >= 1 && dayToShow <= 5) {
        return state.dailyMenu.find((i) => i.id == dayToShow);
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
