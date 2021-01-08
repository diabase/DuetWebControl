'use strict'

import Vue from 'vue'
import { registerRoute } from '../../routes'
import { registerPluginData, PluginDataType } from '../../store'

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

import ThreeDScanner from './ThreeDScanner.vue'
import CalibrateScannerDialog from './CalibrateScannerDialog.vue'
import CalibrationProgressDialog from './CalibrationProgressDialog.vue'
import ScanDialog from './ScanDialog.vue'
import ScanProgressDialog from './ScanProgressDialog.vue'
import ScansFileList from './ScansFileList'
import ThreeDScannerPanel from './ThreeDScannerPanel.vue'

Vue.component('calibrate-scanner-dialog', CalibrateScannerDialog);
Vue.component('calibration-progress-dialog', CalibrationProgressDialog);
Vue.component('scan-dialog', ScanDialog);
Vue.component('scan-progress-dialog', ScanProgressDialog);
Vue.component('scans-file-list', ScansFileList);
Vue.component('threeD-scanner-panel', ThreeDScannerPanel);

// Register a route via Control -> Height Map
registerRoute(ThreeDScanner, {
	Control: {
		ThreeDScanner: {
			icon: 'mdi-cube-scan',
			caption: localT('menuCaption'),
			path: '/3DScanner',
		},
	}
});

registerPluginData('ThreeDScanner', PluginDataType.machineCache, 'column', 'name');
registerPluginData('ThreeDScanner', PluginDataType.machineCache, 'descending', false);
