<style scoped>
.move-btn {
	color: red;
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
					<code-btn :code="`M98 P${doubleQuote}touchoff_${ axis.letter }.g${doubleQuote}`" no-wait block class="move-btn">
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

import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapGetters('machine', ['connector']),
	},
	data() {
		return {
			axes: [ "X-Y", "Z" ],
			doubleQuote: '"',
			touchplateProbeNumber: 1,
			installed: false,
			updateInterval: 5000,
			intervalId: null,
		}
	},
	methods: {
		async updateInstalled() {
			if (this.isConnected) {
				const response = await this.connector.request('GET', 'rr_model', { "key": `sensors.probes[${this.touchplateProbeNumber}]` });
				this.installed = response.result != null && response.result.value < response.result.threshold;
			}
		},
	},
	watch: {
		isConnected() {
			if (this.isConnected) {
				this.updateInstalled();
				this.intervalId = setInterval(this.updateInstalled, this.updateInterval);
			} else {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
		},
	}
}
</script>
