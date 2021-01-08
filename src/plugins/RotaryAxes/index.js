'use strict'

import Vue from 'vue'
import { registerRoute } from '../../routes'

import VueI18n from 'vue-i18n'
import en from './i18n/en.js'
const messages = {
	en,
}
const localI18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages,
})
export const localT = function (key) {
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    return localI18n._t.apply(localI18n, [ key, localI18n.locale, localI18n._getMessages(), this ].concat( values ))
};

import RotaryAxes from './RotaryAxes.vue'
import Rotary3DPrintingPanel from './Rotary3DPrintingPanel.vue'
import RotaryAxesControlPanel from './RotaryAxesControlPanel.vue'
import RotaryAxesStatusPanel from './RotaryAxesStatusPanel.vue'

Vue.component('rotary-3d-printing-panel', Rotary3DPrintingPanel);
Vue.component('rotary-axes-control-panel', RotaryAxesControlPanel);
Vue.component('rotary-axes-status-panel', RotaryAxesStatusPanel);

// Register a route via Control -> Rotary Axes
registerRoute(RotaryAxes, {
	Control: {
		RotaryAxes: {
			icon: 'mdi-axis-x-rotate-clockwise',
			caption: localT('menuCaption'),
			path: '/RotaryAxes',
		},
	}
});
