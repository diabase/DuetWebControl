<style scoped>
table tbody td {
	border-bottom: none !important;
}
table tbody tr:hover {
	background: transparent !important;
}
.move-btn {
	color: red;
}
</style>
<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-stethoscope</v-icon> {{ t('panel.probeworkpiece.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<p class="mb-1">{{ t('panel.probeworkpiece.description') }}</p>
					<v-simple-table>
						<tbody>
							<tr>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Ymin.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
										Y <v-icon>{{ getIcon("Y", "max") }}</v-icon>
									</code-btn>
								</td>
								<td colspan="2"></td>
							</tr>
							<tr>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Xmax.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
										-X <v-icon>{{ getIcon("X", "min") }}</v-icon>
									</code-btn>
								</td>
								<td class="text-center">
									<v-icon>mdi-cube-scan</v-icon>
								</td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Xmin.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
										<v-icon>{{ getIcon("X", "max") }}</v-icon> X
									</code-btn>
								</td>
								<td></td>
							</tr>
							<tr>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Ymax.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
										-Y <v-icon>{{ getIcon("Y", "min") }}</v-icon>
									</code-btn>
								</td>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Zmin.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
										Z <v-icon>{{ getIcon("Z") }}</v-icon>
									</code-btn>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
					<v-row dense class="pt-8">
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}tcalibrate.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
								<v-icon>mdi-image-filter-center-focus</v-icon> {{ t('button.probeWorkpiece.findCenterOfCavity') }}
							</code-btn>
						</v-col>
						<v-col>
							<v-text-field :value="diameterProbeHole" type="number" suffix="mm" @change="setDiameter($event)" min="0" max="300" :disabled="disable"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}measurez.g${doubleQuote}`" no-wait block class="move-btn" :disabled="disable">
								<v-icon>mdi-ruler</v-icon> {{ t('button.probeWorkpiece.measureZ') }}
							</code-btn>
						</v-col>
					</v-row>
				</v-col>
				<v-col class="flex-shrink-1">
					<img src="./probe.png"/>
				</v-col>
			</v-row>
		</v-card-text>
		<v-alert v-if="probeReady" type="success" class="mb-0">
			{{ t('panel.probeworkpiece.probeReady') }}
		</v-alert>
	</v-card>
</template>

<script>
'use strict'

import {mapGetters, mapActions, mapState } from 'vuex'
import { localT } from './index.js'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine', ['vendor']),
		...mapState('machine/model', ['sensors', 'state', 'global']),
		disable() {
			if (this.vendor === 'diabase') {
				return this.state.currentTool != 10;
			}
			return false;
		},
		probeReady() {
			return this.state && this.state.currentTool == 10;
		},
		diameterProbeHole(){
			
			if(this.global.diameterProbeHole){
				return this.global.diameterProbeHole 
			}
			return 0;
		}
	},
	data() {
		return {
			doubleQuote: '"',
			macroBaseName: 'workpieceprobe_',
			t: localT,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		getIcon(axis, from) {
			if (axis == "Z" || (axis == "Y" && from == "max")) {
				return "mdi-arrow-collapse-down"
			}
			if (axis == "Y") {
				return "mdi-arrow-collapse-up"
			}
			if (from == "min") {
				return "mdi-arrow-collapse-right"
			}
			return "mdi-arrow-collapse-left"
		},
		async setDiameter(diameter) {
			const value = parseFloat(diameter);
			if (!this.isNumber(value)) {
				this.$makeNotification('warning', this.$t('error.enterValidNumber'));
				return;
			}
			this.busy = true;
			try {
				if(this.global.diameterProbeHole === null || this.global.diameterProbeHole === undefined){
					await this.sendCode(`global diameterProbeHole = ${value}`);
				}
				else{
					await this.sendCode(`set global.diameterProbeHole = ${value}`);
				}
			} catch (e) {
				// already handled
			}
			this.busy = false;
		},
	},
}
</script>
