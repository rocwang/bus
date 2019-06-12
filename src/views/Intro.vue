<template>
  <div :class="$style.root">
    <div :class="$style.image">
      <Icon name="Bus" :class="$style.iconBus" :color="colors.oceanBlue" />
      <Icon name="Ship" :class="$style.iconShip" :color="colors.oceanBlue" />
      <Icon name="Train" :class="$style.iconTrain" :color="colors.oceanBlue" />
    </div>

    <div :class="$style.actions">
      <Buttonizer>
        <ButtonWithIcon :class="$style.button" @click="handleButtonClick(true)">
          <template v-slot:icon>
            <RoundIcon
              name="Map"
              :bg="colors.yellow"
              :color="colors.oceanBlue"
            />
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
            <RoundIcon
              name="FullStar"
              :bg="colors.yellow"
              :color="colors.oceanBlue"
            />
          </template>
          <template v-slot:text>
            Favourites
          </template>
        </ButtonWithIcon>
      </Buttonizer>
    </div>
  </div>
</template>

<script>
import Icon from "../components/Icon/index";
import Buttonizer from "../components/Buttonizer";
import ButtonWithIcon from "../components/ButtonWithIcon";
import RoundIcon from "../components/RoundIcon";

export default {
  name: "Intro",
  inject: ["colors"],
  components: {
    Icon,
    Buttonizer,
    RoundIcon,
    ButtonWithIcon
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
