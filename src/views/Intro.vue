<template>
  <div :class="$style.root">
    <div :class="$style.image">
      <IconBus :class="$style.iconBus" />
      <IconShip :class="$style.iconShip" />
      <IconTrain :class="$style.iconTrain" />
    </div>

    <div :class="$style.actions">
      <Buttonizer>
        <ButtonWithIcon :class="$style.button" @click="handleButtonClick(true)">
          <template v-slot:icon>
            <RoundIconMap />
          </template>
          <template v-slot:text>
            Find stops on map
          </template>
        </ButtonWithIcon>
      </Buttonizer>

      <Buttonizer>
        <ButtonWithIcon
          :class="$style.button"
          @click="handleButtonClick(false)"
        >
          <template v-slot:icon>
            <RoundIconStarFull />
          </template>
          <template v-slot:text>
            Show nearby stops
          </template>
        </ButtonWithIcon>
      </Buttonizer>
    </div>
  </div>
</template>

<script>
import IconBus from "../components/IconBus";
import IconShip from "../components/IconShip";
import IconTrain from "../components/IconTrain";
import Buttonizer from "../components/Buttonizer";
import ButtonWithIcon from "../components/ButtonWithIcon";
import RoundIconMap from "../components/RoundIconMap";
import RoundIconStarFull from "../components/RoundIconStarFull";

export default {
  name: "Intro",
  components: {
    IconBus,
    IconShip,
    IconTrain,
    Buttonizer,
    RoundIconMap,
    RoundIconStarFull,
    ButtonWithIcon
  },
  beforeRouteEnter(to, from, next) {
    const hasFavourites = false;
    if (hasFavourites) {
      next({ name: "Favourites" });
    } else {
      next();
    }
  },
  methods: {
    handleButtonClick(isFavouritesCollapsed = true) {
      const route = {
        name: "Favourites"
      };

      if (isFavouritesCollapsed) {
        route.query = {
          isCollapsed: "yes"
        };
      }

      this.$router.push(route);
    }
  }
};
</script>

<style module>
.root {
  height: 100%;
  background: var(--c-yellow);
}

.image {
  position: relative;
  overflow: hidden;
  height: 60%;
}

.actions {
  height: 40%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
}

/*
 * Fallback to space-around on Edge because it doesn't support space-evenly on flex box so far
 * See https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15947692/
 */
@supports (-ms-accelerator: true) {
  .actions {
    justify-content: space-around;
  }
}

.iconBus {
  bottom: 0;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: 0;
  width: 180px;
}

.iconShip {
  bottom: 0;
  left: 0;
  margin-bottom: auto;
  margin-top: auto;
  position: absolute;
  top: 0;
  transform: translate(-50%, -80px);
  width: 225px;
}

.iconTrain {
  bottom: 0;
  margin-bottom: auto;
  margin-top: auto;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -80px);
  width: 180px;
}

.button {
  width: 240px;
}
</style>
