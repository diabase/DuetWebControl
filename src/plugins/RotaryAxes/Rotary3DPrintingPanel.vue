<style scoped>
.move-btn {
	color: red;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-tools</v-icon> {{ t('panel.rotaryprinting.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<v-simple-table>
						<thead>
							<tr>
								<th class="text-center">{{ t('panel.rotaryaxes.control.tableHeaders.steps') }}</th>
								<th colspan="2" class="text-center">{{ t('panel.rotaryaxes.control.tableHeaders.actions') }}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step1') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}rotaryprint.g${doubleQuote}`" no-wait block class="move-btn">
										{{ t('button.rotaryaxes.control.configure') }}
									</code-btn>
								</td>
							</tr><tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step2') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}measurez.g${doubleQuote}`" no-wait block class="move-btn">
										{{ t('button.rotaryaxes.control.measureZAxis') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step3') }}</td>
								<td>
									<span>{{ t('button.rotaryaxes.control.setXmin') }}:&nbsp;</span>
									<code-btn class="mr-1" :code="`M208 X${ocb}move.axes[0].userPosition${ccb} S1`" :title="`${ t('button.rotaryaxes.control.setToCurrent') }`" no-wait lock small>
										<v-icon small>mdi-home-import-outline</v-icon>
									</code-btn>
									<span class="wcs-value" @click="showSetXDialog(true)">{{ $display(move.axes[0].min, 3, 'mm') }}</span>
								</td>
								<td>
									<span>{{ t('button.rotaryaxes.control.setXmax') }}:&nbsp;</span>
									<code-btn class="mr-1" :code="`M208 X${ocb}move.axes[0].userPosition${ccb} S0`" :title="`${ t('button.rotaryaxes.control.setToCurrent') }`" no-wait lock small>
										<v-icon small>mdi-home-import-outline</v-icon>
									</code-btn>
									<span class="wcs-value" @click="showSetXDialog(false)">{{ $display(move.axes[0].max, 3, 'mm') }}</span>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step4') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}homea.g${doubleQuote}`" no-wait block class="move-btn">
										{{ $t('button.home.caption', [t('button.rotaryaxes.home')]) }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step5') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}bed_rotary.g${doubleQuote}`" no-wait block>
										{{ t('button.rotaryaxes.control.levelRotaryPrintBed') }}
									</code-btn>
								</td>
							</tr>
							<tr>
								<td class="text-center">{{ t('panel.rotaryaxes.control.step6') }}</td>
								<td colspan="2">
									<code-btn :code="`M98 P${doubleQuote}unrotary.g${doubleQuote}`" no-wait block>
										{{ t('button.rotaryaxes.control.unrotary') }}
									</code-btn>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
				</v-col>
			</v-row>
		</v-card-text>
		<input-dialog :shown.sync="setXDialog.shown" :title="setXDialog.title" :prompt="setXDialog.prompt" :preset="setXDialog.preset" is-numeric-value @confirmed="setXDialogConfirmed"></input-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapGetters, mapState, mapActions } from 'vuex'
import { localT } from './index.js'

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
			ccb: '}',
			t: localT,
			setXDialog: {
				shown: false,
				title: '',
				prompt: '',
				preset: 0,
				min: false,
			},
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		showSetXDialog(min) {
			if (this.uiFrozen) {
				return;
			}
			this.setXDialog.title = this.t('dialog.setX.' + (min ? 'min' : 'max') + 'Title');
			this.setXDialog.prompt = this.t('dialog.setX.' + (min ? 'min' : 'max') + 'Prompt');
			this.setXDialog.preset = this.move.axes[0][min === true ? 'min' : 'max']
			this.setXDialog.min = min;
			this.setXDialog.shown = true;
		},
		async setXDialogConfirmed(value) {
			this.busy = true;
			try {
				await this.sendCode({ code: `M208 X${value} S${this.setXDialog.min ? '1' : '0'}`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
		},
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.setXDialog.shown = false;
		}
	}
}
</script>
