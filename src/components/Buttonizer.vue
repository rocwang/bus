<script>
export default {
  functional: true,
  name: "Buttonizer",
  props: {
    modifier: {
      type: String,
      required: false,
      validator(modifier) {
        return ["primary", "secondary", "icon"].includes(modifier);
      }
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  render(createElement, { props, children, $style }) {
    let classNames = [$style.root, { [$style["full-width"]]: props.fullWidth }];

    if (props.modifier) {
      classNames.push($style[props.modifier]);
    }

    return children.map(child => {
      if (child.data) {
        child.data.class = child.data.class
          ? classNames.concat(child.data.class)
          : classNames;
      } else {
        child.data = { class: classNames };
      }

      return child;
    });
  }
};
</script>

<style module>
.root {
  cursor: pointer;
  touch-action: manipulation;
}

.root[disabled] {
  cursor: default;
}

.root:active {
  transform: translate(1px, 1px);
}

.full-width {
  display: block;
  width: 100%;
}

.primary {
  font-size: 1.3rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  padding: 11px 35px;
  background-color: var(--c-yellow);
  color: var(--c-white);
}

.primary:disabled {
  background-color: var(--c-gray);
}

.secondary {
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  padding: 12px 35px;
  background-color: transparent;
  color: var(--c-ocean-blue);
}

.secondary:disabled {
  color: var(--c-gray);
}

.icon {
  padding: 8px;
}

.icon svg {
  width: 20px;
}
</style>
