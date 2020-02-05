<style>
.move-btn {
	padding-left: 0 !important;
	padding-right: 0 !important;
	min-width: 0;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-gesture-tap</v-icon> {{ $t('panel.touchoff.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row dense>
				<v-col v-for="axis in axes" :key="axis">
					<code-btn :code="`M98 P${doubleQuote}touchoff_${ axis.letter }.g${doubleQuote}`" no-wait block tile class="move-btn">
						{{ $t('button.touchoff.touchoff', [axis]) }}
					</code-btn>
				</v-col>
			</v-row>
		</v-card-text>

		<v-alert v-if="installed" type="success" class="mb-0">
			{{ $t('panel.touchoff.plateInstalled') }}
		</v-alert>
		<v-alert v-else type="warning" class="mb-0">
			{{ $t('panel.touchoff.plateMissing') }}
		</v-alert>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState(['selectedMachine']),
		...mapState('machine/model', ['sensors']),
		installed() {
			return this.sensors
				&& this.sensors.probes
				&& this.sensors.probes.length > this.touchplateProbeNumber
				&& this.sensors.probes[this.touchplateProbeNumber].value < this.sensors.probes[this.touchplateProbeNumber].threshold;
		},
	},
	data() {
		return {
			axes: [ "X-Y", "Z" ],
			doubleQuote: '"',
			touchplateProbeNumber: 1,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
	},
}
</script>
