<style>
.tooloffset-value {
	cursor: pointer;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-tools</v-icon> {{ $t('panel.tooloffsets.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col :cols="9">
					<v-simple-table fixed-header>
						<thead>
							<tr>
								<th class="text-center">{{ $t('panel.tooloffsets.tableHeaders.name') }}</th>
								<th class="text-center" v-for="axis in relevantAxes" :key="axis.name">{{ axis.name }}</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="t in toolsWithoutProbe" :key="t.number">
								<td class="text-center">{{ t.name || "Tool " + t.number }}</td>
								<td class="text-center" v-for="(axis, index) in relevantAxes" :key="index">
									<v-btn class="mr-1" @click="toolOffsetSet(axis.name, index, t)" :title="`${ $t('button.tooloffsets.setToCurrent') }`" no-wait lock small :disabled="uiFrozen">
										<v-icon small>mdi-home-import-outline</v-icon>
									</v-btn>
									<div style="display: inline-block; white-space:nowrap;">
									<v-btn @click="toolOffsetAdjust(axis.name, index, t, -1)" no-wait lock small :disabled="uiFrozen">
										<v-icon small>{{ axis.iconMinus }}</v-icon> {{ axis.textMinus }}
									</v-btn>
									<span class="mx-2 tooloffset-value text-right" @click="showSetToolOffsetDialog(axis.name, index, t)">{{ $display((t.offsets[index] && t.offsets[index] || 0), axis.name === 'Z' ? 3 : 2, 'mm') }}</span>
									<v-btn @click="toolOffsetAdjust(axis.name, index, t)" no-wait lock small :disabled="uiFrozen">
										<v-icon small>{{ axis.iconPlus }}</v-icon> {{ axis.textPlus }}
									</v-btn>
									</div>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
				</v-col>
				<v-col :cols="3">
					<img src="../../assets/tooloffset.png"/>
				</v-col>
			</v-row>
			<v-row align="center" class="pb-1">
				<v-col cols="4">
					<p class="mb-1">
					{{ $t('panel.tooloffsets.amount', ['mm']) }}
					</p>
					<v-btn-toggle v-model="amount" mandatory class="d-flex">
						<v-btn v-for="(savedAmount, index) in toolOffsetAmounts" :key="index" :value="savedAmount" :disabled="uiFrozen" @contextmenu.prevent="editAmount(index)" class="flex-grow-1">
							{{ savedAmount }}
						</v-btn>
					</v-btn-toggle>
				</v-col>
			</v-row>
		</v-card-text>

		<input-dialog :shown.sync="setToolOffsetDialog.shown" :title="setToolOffsetDialog.title" :prompt="setToolOffsetDialog.prompt" :preset="setToolOffsetDialog.preset" is-numeric-value @confirmed="setToolOffsetDialogConfirmed"></input-dialog>
		<input-dialog :shown.sync="editAmountDialog.shown" :title="$t('dialog.editToolOffsetAmount.title')" :prompt="$t('dialog.editToolOffsetAmount.prompt')" :preset="editAmountDialog.preset" is-numeric-value @confirmed="setAmount"></input-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['tools', 'move']),
		...mapState('machine/settings', ['toolOffsetAmounts']),
		toolsWithoutProbe() {
			return this.tools.filter(t => t != null && t.number != 10);
		}
	},
	data() {
		return {
			amount: 0.01,
			editAmountDialog: {
				shown: false,
				index: 0,
				preset: 0
			},
			relevantAxes: [
				{
					name: "X",
					iconMinus: "mdi-arrow-left-bold",
					iconPlus: "mdi-arrow-right-bold",
					textMinus: "Left",
					textPlus: "Right",
				},
				{
					name: "Y",
					iconMinus: "mdi-arrow-down-bold",
					iconPlus: "mdi-arrow-up-bold",
					textMinus: "Front",
					textPlus: "Back",
				},
				{
					name: "Z",
					iconMinus: "mdi-arrow-down-bold",
					iconPlus: "mdi-arrow-up-bold",
					textMinus: "Down",
					textPlus: "Up",
				},
			],
			setToolOffsetDialog: {
				shown: false,
				title: '',
				prompt: '',
				axisLetter: 'X',
				toolNumber: -1,
				preset: 0,
			}
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		...mapMutations('machine/settings', ['setToolOffsetAmount']),
		async toolOffsetAdjust(axisLetter, axisIndex, tool, multiplier = 1) {
			if (axisLetter == 'Z') {
				multiplier *= -1;
			}
			let amount = this.amount * multiplier;
			const newAmount = Math.round((tool.offsets[axisIndex] + amount) * 100) / 100;
			this.busy = true;
			try {
				await this.sendCode(`G10 L1 P${tool.number} ${axisLetter}${newAmount}\nM500 P10`);
			} catch (e) {
				// handled before we get here
			}
			this.busy = false;
		},
		async toolOffsetSet(axisLetter, axisIndex, tool) {
			let axes = this.move.axes.filter(axis => axis.letter == axisLetter);
			if (axes.length > 0) {
				let axis = axes[0];
				let userPosition = -1 * axis.userPosition;
				this.busy = true;
				try {
					await this.sendCode(`G10 L1 P${tool.number} ${axisLetter}${userPosition}\nM500 P10`);
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
			this.setExtrusionAmount({ index: this.editAmountDialog.index, value });
			this.amount = value;
		},
		showSetToolOffsetDialog(axisLetter, axisIndex, tool) {
			if (this.uiFrozen) {
				return;
			}
			const toolName = tool.name || "Tool " + tool.number;
			this.setToolOffsetDialog.title = this.$t('dialog.setToolOffset.title', [ toolName ]);
			this.setToolOffsetDialog.prompt = this.$t('dialog.setToolOffset.prompt', [ axisLetter, toolName ]);
			this.setToolOffsetDialog.axisLetter = axisLetter;
			this.setToolOffsetDialog.toolNumber = tool.number;
			this.setToolOffsetDialog.preset = tool.offsets[axisIndex];
			this.setToolOffsetDialog.shown = true;
		},
		async setToolOffsetDialogConfirmed(value) {
			this.busy = true;
			try {
				await this.sendCode({ code: `G10 L1 P${this.setToolOffsetDialog.toolNumber} ${this.setToolOffsetDialog.axisLetter}${value}\nM500 P10`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
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
	}
}
</script>
