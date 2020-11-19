'use strict'

import Vue from 'vue'

// import VueI18n from 'vue-i18n'
// import en from './i18n/en.js'
// const messages = {
// 	en,
// }
// const localT = new VueI18n({
// 	locale: 'en',
// 	fallbackLocale: 'en',
// 	messages,
// })
// localT.tc(''); // TODO: Remove if provided to components

import { registerRoute } from '../../routes'
import { registerPluginData, PluginDataType } from '../../store'

import Offsets from './Offsets.vue'
import ProbeWorkpiecePanel from './ProbeWorkpiecePanel.vue'
import ToolOffsetsPanel from './ToolOffsetsPanel.vue'
import TouchOffPlatePanel from './TouchOffPlatePanel.vue'
import WCSPanel from './WCSPanel.vue'

Vue.component('probe-workpiece-panel', ProbeWorkpiecePanel);
Vue.component('tool-offsets-panel', ToolOffsetsPanel);
Vue.component('touch-off-plate-panel', TouchOffPlatePanel);
Vue.component('wcs-panel', WCSPanel);

// Register a route via Control -> Height Map
registerRoute(Offsets, {
	Control: {
		Offsets: {
			icon: 'mdi-arrow-expand-all',
			caption: 'plugins.offsets.menuCaption',
			path: '/Offsets',
		},
	}
});

// TODO: Add WCS names to cache here
registerPluginData('Offsets', PluginDataType.machineSetting, 'toolOffsetAmounts', [10, 5, 2, 1, 0.1, 0.01]);
// registerPluginData('Offsets', PluginDataType.machineCache, 'localT', localT);
