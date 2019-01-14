<template>
  <Panel :isCollapsed="isCollapsed">
    <RoundIconStarFull slot="icon"/>
    <template slot="title">Favourites</template>
    <template slot="buttons">
      <Buttonizer modifier="icon">
        <button>
          <IconEdit/>
        </button>
        <button @click="handleArrowClick">
          <IconArrow :direction="isCollapsed ? 'up' : 'down'"/>
        </button>
      </Buttonizer>
    </template>

    <ul slot="body">
      <li>body</li>
      <li>body</li>
      <li>body</li>
    </ul>
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
