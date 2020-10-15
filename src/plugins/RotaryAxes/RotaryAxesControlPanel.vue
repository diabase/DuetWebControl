<style scoped>
.move-btn {
	color: red;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-tools</v-icon> {{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<code-btn :color="uAxis.homed ? 'primary' : 'warning'" :disabled="uiFrozen" :code="`M98 P${doubleQuote}homerotary-y.g${doubleQuote}`" class="ml-0">
						{{ $t('button.home.caption', [$t('plugins.rotaryAxes.button.rotaryaxes.home')]) }}
					</code-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-simple-table>
						<thead>
							<tr>
								<th class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.tableHeaders.steps') }}</th>
								<th colspan="2" class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.tableHeaders.actions') }}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step1') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}measurez.g${doubleQuote}`" no-wait block class="move-btn">
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.measureZAxis') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step2') }}</td>
								<td>
									<code-btn :code="`M208 X${ocb}move.axes[0].userPosition${ccb} S1`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setXmin') }}
									</code-btn>
								</td>
								<td>
									<code-btn :code="`M208 X${ocb}move.axes[0].userPosition${ccb} S0`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setXmax') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step3') }}</td>
								<td>
									<code-btn :code="`M208 Y${ocb}move.axes[1].userPosition${ccb} S1`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setYmin') }}
									</code-btn>
								</td>
								<td>
									<code-btn :code="`M208 Y${ocb}move.axes[1].userPosition${ccb} S0`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setYmax') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step4') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}levelA.g${doubleQuote}`" no-wait block class="move-btn">
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.levelAaxis') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step5') }}</td>
								<td colspan="2">
									<code-btn :code="`M117 Not yet implemented`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setStockThickness') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step6') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}centerY.g${doubleQuote}`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.setYoffset') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step7') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}4thbed.g${doubleQuote}`" no-wait block class="move-btn">
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.autoLevel') }}
									</code-btn>
								</td>
							</tr><tr>
								<td class="text-center">{{ $t('plugins.rotaryAxes.panel.rotaryaxes.control.step8') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}unrotary.g${doubleQuote}`" no-wait block>
										{{ $t('plugins.rotaryAxes.button.rotaryaxes.control.unrotary') }}
									</code-btn>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapGetters, mapState } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move']),
		uAxis() {
			return this.move.axes.filter(axis => axis.letter == 'U')[0];
		},
	},
	data() {
		return {
			doubleQuote: '"',
			ocb: '{',
			ccb: '}'
		}
	},
}
</script>
