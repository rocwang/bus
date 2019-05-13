<template>
  <PanelFavourites :isCollapsedInitially="$route.query.isCollapsed === 'yes'" />
</template>

<script>
import PanelFavourites from "../components/PanelFavourites";

export default {
  name: "Favourites",
  components: { PanelFavourites }
};
</script>
