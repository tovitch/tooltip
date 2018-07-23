import './scss/_tooltip.scss'
import Vue from 'vue';

class Tooltip {
    constructor(classes = null, idsPrefix = '') {
        this.classes = classes;
        this.idsPrefix = idsPrefix;

        this.makeContainer()
            .makeContentContainer()
            .makeArrow();
    }

    makeContainer() {
        this.tooltip = document.createElement('div');
        this.tooltip.setAttribute('id', `${this.idsPrefix}tooltip`);
        this.setCss();
        document.body.append(this.tooltip);

        return this;
    }

    makeContentContainer() {
        this.content = document.createElement('p');
        this.content.setAttribute('id', `${this.idsPrefix}tooltip-content`);
        this.tooltip.append(this.content);

        return this;
    }

    makeArrow() {
        this.arrow = document.createElement('span');
        this.arrow.setAttribute('id', `${this.idsPrefix}tooltip-arrow`);
        this.arrow.classList.add('arrow-top');
        this.tooltip.append(this.arrow);

        return this;
    }

    setCss() {
        let defaultClasses = [
            'is-tooltip',
            'absolute',
            'bg-grey-darkest',
            'border',
            'border-black',
            'text-white',
            'p-2',
            'rounded',
            'pointer-events-none',
            'opacity-0'
        ];

        if (!this.classes) {
            this.classes = defaultClasses;
        }

        this.tooltip.classList.add(...this.classes);
    }

    show() {
        this.tooltip.classList.remove('opacity-0');

        return this;
    }

    hide() {
        this.tooltip.classList.add('opacity-0');

        return this;
    }

    setPosition(el) {
        this.setTop(el)
            .setLeft(el);

        return this;
    }

    setTop(el) {
        let elDimensions = el.getBoundingClientRect();
        let tooltipDimensions = this.tooltip.getBoundingClientRect();
        let isOnBottom = el.offsetTop + elDimensions.height + tooltipDimensions.height > window.innerHeight + window.scrollY;

        if (isOnBottom) {
            this.setAboveElement(el);
        } else {
            this.setBelowElement(el);
        }

        return this;
    }

    setLeft(el) {
        let elDimensions = el.getBoundingClientRect();
        let tooltipDimensions = this.tooltip.getBoundingClientRect();
        let left = elDimensions.left + (elDimensions.width / 2 - tooltipDimensions.width / 2);

        if (left < 0) {
            left = 0;
            this.arrow.style.right = 'auto';
            this.arrow.style.left = `${(elDimensions.width / 2) - this.getPropertyValue('padding-right')}px`;
        } else if (left + tooltipDimensions.width >= window.innerWidth) {
            left = window.innerWidth - tooltipDimensions.width;
            this.arrow.style.left = 'auto';
            this.arrow.style.right = `${(elDimensions.width / 2) - this.getPropertyValue('padding-left')}px`;
        } else {
            this.arrow.style.right = 'auto';
            this.arrow.style.left = `calc(50% - ${this.getPropertyValue('padding')}px)`;
        }

        this.tooltip.style.left = `${left}px`;
    }

    setAboveElement(el) {
        let elDimensions = el.getBoundingClientRect();
        let tooltipDimensions = this.tooltip.getBoundingClientRect();

        this.arrow.classList.remove('arrow-top');
        this.arrow.classList.add('arrow-bottom');

        this.tooltip.style.top = `${(el.offsetTop - elDimensions.height - (tooltipDimensions.height / 2) - 5)}px`;
    }

    setBelowElement(el) {
        let elDimensions = el.getBoundingClientRect();

        this.arrow.classList.remove('arrow-bottom');
        this.arrow.classList.add('arrow-top');

        this.tooltip.style.top = `${(elDimensions.top + elDimensions.height + window.scrollY + 5)}px`;
    }

    setContent(content) {
        if (content) {
            this.content.textContent = content;
        }

        return this;
    }

    getPropertyValue(key) {
        return Number.parseFloat(window.getComputedStyle(this.tooltip, null).getPropertyValue(key))
    }
}

Vue.directive('tooltip', {
    bind(el, binding) {
        if (!window._tooltip) {
            window._tooltip = new Tooltip();
        }

        el.classList.add('has-tooltip');

        el.addEventListener('mouseover', () => window._tooltip.setContent(binding.value).setPosition(el).show());
        el.addEventListener('mouseout', () => window._tooltip.hide())
    },

    update(el, binding) {
        console.log('update', {el, binding});
    }
});
