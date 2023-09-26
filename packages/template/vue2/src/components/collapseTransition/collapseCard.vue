<template>
  <div :class="['collapse-card', isCollapse ? 'card-collapsed' : '']">
    <div class="collapse-card__title">
      <slot name="title">
        <div
          class="collapse-card__title--default"
          @click="handleToggleCollapse"
        >
          <div class="arrow">
            <span class="el-icon-caret-right" />
          </div>
          <span class="collapse-card__title--text">{{ title }}</span>
        </div>
      </slot>
    </div>
    <collapse-transition>
      <div v-show="isCollapse" class="collapse-card__contain">
        <div>
          <slot />
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import CollapseTransition from './collapseTransition';

export default {
  name: 'CollapseCard',
  components: { CollapseTransition },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss">
.collapse-card {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
.collapse-card {
  --collapse-card-bgc: #fff;
  --collapse-card-border: #ebeef5;
  --collapse-arrow-icon-color: #4e80f7;
  border-radius: 4px;

  background-color: var(--collapse-card-bgc);
  border: 1px solid var(--collapse-card-border);

  &__title {
    padding: 8px 12px;

    &--default {
      display: flex;
      cursor: pointer;
    }
    &--text {
      color: var(--collapse-arrow-icon-color);
    }
  }

  &__contain {
    overflow: hidden;
    height: 0;
    & > div {
      padding: 12px;
    }
  }
}
.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(59, 130, 255, 0.15);
  border-radius: 2px;
  margin-right: 10px;
  & > span {
    color: var(--collapse-arrow-icon-color);
    transition: transform 0.3s;
  }
}
.card-collapsed {
  .arrow > span {
    transform: rotate(90deg);
  }
  .collapse-card__title {
    border-bottom: 1px solid var(--collapse-card-border);
  }
  .collapse-card__contain {
    overflow: inherit;
    height: inherit;
  }
}

.progress-collapse-transition {
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
</style>
