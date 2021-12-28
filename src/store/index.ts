import axios from 'axios'
import { createStore } from 'vuex'
export default createStore({
    state: {
        currentDay: null,
        currentDayDate: null,
        dailyMenu: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ]
    },
    mutations: {
        SET_MENU(state, menu) {
            state.dailyMenu = menu
        }
    },
    getters: {
        getMenu: state => state.dailyMenu,
        getCurrentDay: state => {
            const curDay =  new Date()
            if(curDay.getDay() === 0) {
                return state.dailyMenu.find(i => i.id == 1)
            } else if (curDay.getDay() < 6) {
                return state.dailyMenu.find(i => i.id == curDay.getDay())
            }
            return null
        }
    },
    actions: {
        getMenu({ commit }) {
            axios.get('./json/menu.json')
                .then(response => {
                    commit('SET_MENU', response.data.dailyMenu)
                })
        },
    }
})