<style scoped>
.move-btn {
	color: red;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-gesture-tap</v-icon> {{ t('panel.touchoff.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row dense>
				<v-col v-for="axis in axes" :key="axis">
					<code-btn :code="`M98 P${doubleQuote}touchoff_${ axis }.g${doubleQuote}`" no-wait block class="move-btn">
						{{ t('button.touchoff.touchoff', [axis]) }}
					</code-btn>
				</v-col>
			</v-row>
			<v-row dense v-if="cncMode">
				<v-col>
					<code-btn :code="`M4 P${runningSpindleIndex} S700`" no-wait block>
						<v-icon>mdi-rotate-left</v-icon> {{ t('button.touchoff.runSpindleBackwards') }}
					</code-btn>
				</v-col>
				<v-col>
					<code-btn :code="`M5`" no-wait block>
						<v-icon>mdi-stop</v-icon> {{ t('button.touchoff.turnOffTool') }}
					</code-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<img src="./touchplate.png"/>
				</v-col>
			</v-row>
		</v-card-text>

		<v-alert v-if="installed" type="success" class="mb-0">
			{{ t('panel.touchoff.plateInstalled') }}
		</v-alert>
		<v-alert v-else type="warning" class="mb-0">
			{{ t('panel.touchoff.plateMissing') }}
		</v-alert>
		<v-alert v-if="probeReady" type="success" class="mb-0">
			{{ t('panel.touchoff.probeReady') }}
		</v-alert>
	</v-card>
</template>

<script>
'use strict'

import { mapGetters, mapState } from 'vuex'
import { MachineMode } from '../../store/machine/modelEnums.js'
import { localT } from './index.js'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['sensors', 'spindles' , 'state']),
		installed() {
			return this.sensors.probes.length > this.touchplateProbeNumber
				&& this.sensors.probes[this.touchplateProbeNumber].value[0] < this.sensors.probes[this.touchplateProbeNumber].threshold;
		},
		cncMode() {
			return this.state && this.state.machineMode == MachineMode.cnc;
		},
		runningSpindleIndex() {
			for (let i = 0; i < this.spindles.length; ++i) {
				if (this.spindles[i].current > 0) {
					return i;
				}
			}
			return -1;
		},
		probeReady() {
			return this.state && this.state.currentTool == 10
				&& this.sensors.endstops[2].type == "zProbeAsEndstop"
				&& this.sensors.endstops[2].highEnd === false
		},
	},
	data() {
		return {
			axes: [ "X-Y", "Z" ],
			doubleQuote: '"',
			touchplateProbeNumber: 1,
			updateInterval: 5000,
			intervalId: null,
			t: localT,
		}
	},
}
</script>
