'use strict'

import Vue from 'vue'
import { registerRoute } from '../../routes'

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
