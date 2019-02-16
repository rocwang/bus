<template>
  <Panel :isCollapsed="isCollapsed">
    <template v-slot:icon>
      <RoundIconStarFull />
    </template>
    <template v-slot:title>
      Favourites
    </template>
    <template v-slot:buttons>
      <Buttonizer modifier="icon">
        <button aria-label="edit">
          <IconEdit />
        </button>
        <button @click="handleArrowClick" aria-label="toggle the panel">
          <IconArrow :direction="isCollapsed ? 'up' : 'down'" />
        </button>
      </Buttonizer>
    </template>

    <template v-slot:body>
      <ul>
        <li>body</li>
        <li>body</li>
        <li>body</li>
      </ul>
    </template>
  </Panel>
</template>

<script>
import Panel from "../components/Panel";
import RoundIconStarFull from "../components/RoundIconStarFull";
import IconArrow from "../components/IconArrow";
import IconEdit from "../components/IconEdit";
import Buttonizer from "../components/Buttonizer";

export default {
  name: "PanelFavourites",
  components: { Panel, RoundIconStarFull, IconArrow, IconEdit, Buttonizer },
  data() {
    return {
      isCollapsed: true
    };
  },
  methods: {
    handleArrowClick() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>
