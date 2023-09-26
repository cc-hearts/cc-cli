/**
 * @description add element class attribute
 * @param { Element } el
 * @param { String } className
 */
export function addClassName(el, className) {
  el.classList.add(className);
}

/**
 * @description remove element class attribute
 * @param { Element } el
 * @param { String } className
 * */
export function removeClassName(el, className) {
  el.classList.remove(className);
}

export default {
  name: 'CollapseTransition',
  functional: true,
  render(h, { children }) {
    return h(
      'transition',
      {
        on: {
          beforeEnter(el) {
            addClassName(el, 'collapse-transition');
            if (!el.dataset) el.dataset = {};
            // 保存内联元素的值
            el.dataset.oldPaddingTop = el.style.oldPaddingTop || '';
            el.dataset.oldPaddingBottom = el.style.paddingBottom || '';

            el.style.height = '0';
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
          },

          enter(el) {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.scrollHeight !== 0) {
              el.style.height = `${el.scrollHeight}px`;
            } else {
              el.style.height = '';
            }

            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
            el.style.overflow = 'hidden';
          },

          afterEnter(el) {
            removeClassName(el, 'collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
          },

          beforeLeave(el) {
            if (!el.dataset) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldOverflow = el.style.overflow;
            el.style.height = `${el.scrollHeight}px`;
            el.style.overflow = 'hidden';
          },

          leave(el) {
            // 触发浏览器重绘
            if (el.scrollHeight !== 0) {
              addClassName(el, 'collapse-transition');
              el.style.height = 0;
              el.style.paddingTop = 0;
              el.style.paddingBottom = 0;
            }
          },

          afterLeave(el) {
            removeClassName(el, 'collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
          },
        },
      },
      children,
    );
  },
};
