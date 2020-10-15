'use strict'

import Vue from 'vue'
import { registerRoute } from '../../routes'

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
			caption: 'plugins.threeDScanner.menuCaption',
			path: '/3DScanner',
		},
	}
});
