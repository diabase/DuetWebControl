'use strict'

import Vue from 'vue'
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

import { registerRoute } from '../../routes'

import ToolPriming from './ToolPriming.vue'
import ToolPrimingControl from './ToolPrimingControl.vue'
import ToolCleaningPanel from './ToolCleaningPanel.vue'

Vue.component('tool-priming-control', ToolPrimingControl);
Vue.component('tool-cleaning-panel', ToolCleaningPanel);

// Register a route via Control -> Height Map
registerRoute(ToolPriming, {
	Control: {
		Offsets: {
			icon: 'mdi-needle',
			caption: localT('menuCaption'),
			path: '/ToolPriming',
		},
	}
});

