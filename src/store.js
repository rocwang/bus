import Vue from "vue";
import Vuex from "vuex";
import at from "./api/at";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routes: []
  },
  getters: {
    routeGroups(state) {
      return Array.from(
        state.routes.reduce(
          (groups, route) => groups.add(route.route_short_name),
          new Set()
        )
      ).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      );
    }
  },
  mutations: {
    setRoutes(state, routes) {
      state.routes = routes;
    }
  },
  actions: {
    async getRoutesByStop({ commit }, stopCode) {
      let routes = await at.getRoutesByStop(stopCode);
      routes = routes.sort((a, b) =>
        a.route_short_name.localeCompare(b.route_short_name)
      );

      commit("setRoutes", routes);
    }
  }
});
