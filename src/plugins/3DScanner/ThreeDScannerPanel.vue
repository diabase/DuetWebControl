<style scoped>
.move-btn {
	color: red;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-cube-scan</v-icon> {{ $t('plugins.threeDScanner.panel.threedscanner.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row dense>
				<v-col>
					<code-btn :code="`M98 P${doubleQuote}scanner_go.g${doubleQuote}`" no-wait block class="move-btn">
						<v-icon>mdi-home</v-icon> {{ $t('plugins.threeDScanner.button.threedscanner.goToScanLocation') }}
					</code-btn>
				</v-col>
				<v-col>
					<v-btn no-wait block @click="showCalibrateDialog = true" :disabled="uiFrozen || !allVisibleAxesHomed || scannerDisonnected">
						<v-icon>mdi-crosshairs-gps</v-icon> {{ $t('plugins.threeDScanner.button.threedscanner.calibrate') }}
					</v-btn>
				</v-col>
				<v-col>
					<v-btn no-wait block @click="showScanDialog = true" :disabled="uiFrozen || !allVisibleAxesHomed || scannerDisonnected">
						<v-icon>mdi-eye</v-icon> {{ $t('plugins.threeDScanner.button.threedscanner.startScan') }}
					</v-btn>
				</v-col>
				<v-col>
					<code-btn :code="`M756`" no-wait block :disabled="uiFrozen || !allVisibleAxesHomed || scannerDisonnected" style="color: red;">
						<v-icon>mdi-power-standby</v-icon> {{ $t('plugins.threeDScanner.button.threedscanner.shutdownScanner') }}
					</code-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<calibrate-scanner-dialog :shown.sync="showCalibrateDialog"></calibrate-scanner-dialog>
		<calibration-progress-dialog :shown.sync="calibrationProgressVisible"></calibration-progress-dialog>
		<scan-dialog :shown.sync="showScanDialog"></scan-dialog>
		<scan-progress-dialog :shown.sync="showScanProgressDialog"></scan-progress-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapGetters, mapState } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move', 'scanner']),
		...mapState('machine/model', {
			scannerStatus: state => state.scanner.status
		}),
		visibleAxes() {
			return this.move.axes.filter(
				axis => axis.visible &&
				!(axis.letter == 'V' || axis.letter == 'W'));
		},
		allVisibleAxesHomed() {
			return this.visibleAxes.every(axis => axis.homed);
		},
		scannerDisonnected() {
			return this.scanner.status == 'D';
		},
		calibrationProgressVisible() {
			return this.scanner.status == 'C';
		},
		scanProgressVisible() {
			// TODO: Keep alive
			return this.scanner.status == 'S'
					|| this.scanner.status == 'P'
					|| this.scanner.status == 'U';
		}
	},
	data() {
		return {
			doubleQuote: '"',
			showCalibrateDialog: false,
			showScanDialog: false,
			showScanProgressDialog: false,
		}
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.showCalibrateDialog = false;
			this.showScanDialog = false;
		},
		scannerStatus(to) {
			if (to == 'S' || to == 'P' || to == 'U') {
				this.showScanProgressDialog = true;
			}
		},
	}
}
</script>
