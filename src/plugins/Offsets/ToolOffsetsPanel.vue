<style>
.tooloffset-value {
	cursor: pointer;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon class="mr-1" small>mdi-tools</v-icon>
			{{ t('panel.tooloffsets.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col :cols="9">
					<v-simple-table fixed-header>
						<thead>
							<tr>
								<th class="text-center">{{ t('panel.tooloffsets.tableHeaders.name') }}</th>
								<th :key="axis.name" class="text-center" v-for="axis in relevantAxes">{{ axis.name }}</th>
							</tr>
						</thead>
						<tbody>
							<tr :key="tool.number" v-for="tool in toolsWithoutProbe">
								<td class="text-center">{{ tool.name || "Tool " + tool.number }}</td>
								<td :key="index" class="text-center" v-for="(axis, index) in relevantAxes">
									<v-btn :disabled="uiFrozen || tool.number != currentTool" :title="`${ t('button.tooloffsets.setToCurrent') }`" @click="toolOffsetSet(axis.name, index, tool)" class="mr-1" lock no-wait small>
										<v-icon small>mdi-home-import-outline</v-icon>
									</v-btn>
									<div style="display: inline-block; white-space:nowrap;">
										<span @click="showSetToolOffsetDialog(axis.name, index, tool)" class="mx-2 tooloffset-value text-right">{{ $display((tool.offsets[index] && tool.offsets[index] || 0), axis.name === 'Z' ? 3 : 2, 'mm') }}</span>
									</div>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
				</v-col>
				<v-col :cols="3">
					<img src="./tooloffset.png" />
				</v-col>
			</v-row>
		</v-card-text>

		<input-dialog :preset="setToolOffsetDialog.preset" :prompt="setToolOffsetDialog.prompt" :shown.sync="setToolOffsetDialog.shown" :title="setToolOffsetDialog.title" @confirmed="setToolOffsetDialogConfirmed" is-numeric-value></input-dialog>
		<input-dialog :preset="editAmountDialog.preset" :prompt="t('dialog.editToolOffsetAmount.prompt')" :shown.sync="editAmountDialog.shown" :title="t('dialog.editToolOffsetAmount.title')" @confirmed="setAmount" is-numeric-value></input-dialog>
	</v-card>
</template>

<script>
'use strict';

import {mapState, mapGetters, mapActions} from 'vuex';
import {setPluginData, PluginDataType} from '../../store';
import {localT} from './index.js';
import {combine} from '../../utils/path';

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['tools', 'move', 'state', 'directories']),
		...mapState('machine/settings', {
			pluginSettings: (state) => state.plugins.Offsets,
		}),
		toolOffsetAmounts: {
			get() {
				return this.pluginSettings.toolOffsetAmounts;
			},
			set({index, value}) {
				let toolOffsetAmounts = this.pluginSettings.toolOffsetAmounts;
				toolOffsetAmounts[index] = value;
				setPluginData('Offsets', PluginDataType.machineSetting, 'toolOffsetAmounts', toolOffsetAmounts);
			},
		},
		toolsWithoutProbe() {
			return this.tools.filter((t) => t != null && t.number != 10);
		},
		currentTool() {
			return this.state.currentTool;
		},
	},
	data() {
		return {
			amount: 0.01,
			editAmountDialog: {
				shown: false,
				index: 0,
				preset: 0,
			},
			relevantAxes: [
				{
					name: 'X',
					iconMinus: 'mdi-arrow-left-bold',
					iconPlus: 'mdi-arrow-right-bold',
					textMinus: 'Left',
					textPlus: 'Right',
				},
				{
					name: 'Y',
					iconMinus: 'mdi-arrow-down-bold',
					iconPlus: 'mdi-arrow-up-bold',
					textMinus: 'Front',
					textPlus: 'Back',
				},
				{
					name: 'Z',
					iconMinus: 'mdi-arrow-down-bold',
					iconPlus: 'mdi-arrow-up-bold',
					textMinus: 'Down',
					textPlus: 'Up',
				},
			],
			setToolOffsetDialog: {
				shown: false,
				title: '',
				prompt: '',
				axisLetter: 'X',
				toolNumber: -1,
				preset: 0,
			},
			t: localT,
		};
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async toolOffsetAdjust(axisLetter, axisIndex, tool, multiplier = 1) {
			if (axisLetter == 'Z') {
				multiplier *= -1;
			}
			let amount = this.amount * multiplier;
			const newAmount = Math.round((tool.offsets[axisIndex] + amount) * 100) / 100;
			this.busy = true;
			try {
				await this.sendCode(`G10 L1 P${tool.number} ${axisLetter}${newAmount}\nM500 P10`);
				await this.runMaxOffset();
			} catch (e) {
				// handled before we get here
			}
			this.busy = false;
		},
		async toolOffsetSet(axisLetter, axisIndex, tool) {
			let axes = this.move.axes.filter((axis) => axis.letter == axisLetter);
			if (axes.length > 0) {
				let axis = axes[0];
				let userPosition = -1 * axis.userPosition;
				this.busy = true;
				try {
					await this.sendCode(`G10 L1 P${tool.number} ${axisLetter}${userPosition}\nM500 P10`);
					await this.runMaxOffset();
				} catch (e) {
					// handled before we get here
				}
				this.busy = false;
			}
		},
		editAmount(index) {
			this.editAmountDialog.index = index;
			this.editAmountDialog.preset = this.toolOffsetAmounts[index];
			this.editAmountDialog.shown = true;
		},
		setAmount(value) {
			this.toolOffsetAmounts = {index: this.editAmountDialog.index, value};
			this.amount = value;
		},
		showSetToolOffsetDialog(axisLetter, axisIndex, tool) {
			if (this.uiFrozen || tool.number != this.currentTool) {
				return;
			}
			const toolName = tool.name || 'Tool ' + tool.number;
			this.setToolOffsetDialog.title = this.t('dialog.setToolOffset.title', [toolName]);
			this.setToolOffsetDialog.prompt = this.t('dialog.setToolOffset.prompt', [axisLetter, toolName]);
			this.setToolOffsetDialog.axisLetter = axisLetter;
			this.setToolOffsetDialog.toolNumber = tool.number;
			this.setToolOffsetDialog.preset = tool.offsets[axisIndex];
			this.setToolOffsetDialog.shown = true;
		},
		async setToolOffsetDialogConfirmed(value) {
			this.busy = true;
			try {
				await this.sendCode({code: `G10 L1 P${this.setToolOffsetDialog.toolNumber} ${this.setToolOffsetDialog.axisLetter}${value}\nM500 P10`, log: false});
				await this.runMaxOffset();
			} catch (e) {
				// already handled
			}
			this.busy = false;
		},
		async runMaxOffset() {
			var tc_max_path = combine(this.directories.system, 'maxoffset.g');
			await this.sendCode({code: `M98 P"${tc_max_path}"`, log: true, showSuccess: false});
		},
	},
	mounted() {
		this.amount = this.toolOffsetAmounts[this.toolOffsetAmounts.length - 1];
	},
	watch: {
		toolOffsetAmounts() {
			this.amount = this.toolOffsetAmounts[this.toolOffsetAmounts.length - 1];
		},
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.setToolOffsetDialog.shown = false;
		},
	},
};
</script>
