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
			<v-icon small class="mr-1">mdi-stethoscope</v-icon> {{ $t('plugins.offsets.panel.probeworkpiece.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<p class="mb-1">{{ $t('plugins.offsets.panel.probeworkpiece.description') }}</p>
					<v-simple-table>
						<tbody>
							<tr>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Ymin.g${doubleQuote}`" no-wait block class="move-btn">
										Y <v-icon>{{ getIcon("Y", "max") }}</v-icon>
									</code-btn>
								</td>
								<td colspan="2"></td>
							</tr>
							<tr>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Xmax.g${doubleQuote}`" no-wait block class="move-btn">
										-X <v-icon>{{ getIcon("X", "min") }}</v-icon>
									</code-btn>
								</td>
								<td class="text-center">
									<v-icon>mdi-cube-scan</v-icon>
								</td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Xmin.g${doubleQuote}`" no-wait block class="move-btn">
										<v-icon>{{ getIcon("X", "max") }}</v-icon> X
									</code-btn>
								</td>
								<td></td>
							</tr>
							<tr>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Ymax.g${doubleQuote}`" no-wait block class="move-btn">
										-Y <v-icon>{{ getIcon("Y", "min") }}</v-icon>
									</code-btn>
								</td>
								<td></td>
								<td class="text-center">
									<code-btn :code="`M98 P${doubleQuote}${macroBaseName}Zmin.g${doubleQuote}`" no-wait block class="move-btn">
										Z <v-icon>{{ getIcon("Z") }}</v-icon>
									</code-btn>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
					<v-row dense class="pt-8">
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}tcalibrate.g${doubleQuote}`" no-wait block class="move-btn">
								<v-icon>mdi-image-filter-center-focus</v-icon> {{ $t('plugins.offsets.button.probeWorkpiece.findCenterOfCavity') }}
							</code-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}measurez.g${doubleQuote}`" no-wait block class="move-btn">
								<v-icon>mdi-ruler</v-icon> {{ $t('plugins.offsets.button.probeWorkpiece.measureZ') }}
							</code-btn>
						</v-col>
					</v-row>
				</v-col>
				<v-col class="flex-shrink-1">
					<img src="../../assets/probe.png"/>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import {mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
	},
	data() {
		return {
			doubleQuote: '"',
			macroBaseName: 'workpieceprobe_',
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
		}
	},
}
</script>
