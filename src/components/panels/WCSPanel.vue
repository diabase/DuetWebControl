<style>
.wcs-value {
	cursor: pointer;
}
.align-center {
	text-align: center;
}
.header {
	font-weight: bold;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-axis-arrow</v-icon> {{ $t('panel.wcs.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col class="align-center header">{{ $t('panel.wcs.tableHeaders.wcs') }}</v-col>
				<v-col class="align-center header">{{ $t('panel.wcs.tableHeaders.changeTo') }}</v-col>
				<v-col class="align-center header" v-for="axis in relevantAxes" :key="axis">{{ axis }}</v-col>
				<v-col class="align-center header">{{ $t('panel.wcs.tableHeaders.reset') }}</v-col>
			</v-row>
			<v-row v-for="w in wcs" :key="w.number">
				<v-col class="header">{{ w.number + ' (' + w.name + ')' }}<v-icon v-if="move.currentWorkplace == w.number" small class="mr-1">mdi-checkbox-marked-outline</v-icon></v-col>
				<v-col class="align-center">
					<code-btn :code="`${w.name}`" no-wait lock small v-if="move.currentWorkplace != w.number">
						<v-icon small>mdi-marker-check</v-icon>
					</code-btn>
				</v-col>
				<v-col v-for="axis in relevantAxes" :key="axis">
					<code-btn :code="`G10 L20 P${w.number} ${axis}`" :title="`${ $t('button.wcs.setToCurrent') }`" no-wait lock small>
						<v-icon small>mdi-home-import-outline</v-icon>
					</code-btn>
					<span class="wcs-value" @click="showSetWCSOffsetDialog(axis, w.number)"> {{ workplaceOffsets[axis][w.number-1].toFixed(2) }}mm</span>
				</v-col>
				<v-col class="align-center">
					<v-btn @click="resetClicked(w)" no-wait lock small :disabled="uiFrozen">
						<v-icon small>mdi-home-floor-0</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<input-dialog :shown.sync="setWCSOffsetDialog.shown" :title="setWCSOffsetDialog.title" :prompt="setWCSOffsetDialog.prompt" :preset="setWCSOffsetDialog.preset" is-numeric-value @confirmed="setWCSOffsetDialogConfirmed"></input-dialog>
		<confirm-dialog :shown.sync="resetDialog.shown" :question="resetDialog.question" :prompt="resetDialog.prompt" @confirmed="reset"></confirm-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move']),
		workplaceOffsets() {
			const zeroOffsets = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.relevantAxes.filter(a => a == "X");
			let xAxis = this.move.axes.filter(axis => axis.letter == "X"),
				yAxis = this.move.axes.filter(axis => axis.letter == "Y"),
				zAxis = this.move.axes.filter(axis => axis.letter == "Z"),
				aAxis = this.move.axes.filter(axis => axis.letter == "A"),
				cAxis = this.move.axes.filter(axis => axis.letter == "C");

			let xOffsets = xAxis.length > 0 && xAxis[0].workplaceOffsets || zeroOffsets,
				yOffsets = yAxis.length > 0 && yAxis[0].workplaceOffsets || zeroOffsets,
				zOffsets = zAxis.length > 0 && zAxis[0].workplaceOffsets || zeroOffsets,
				aOffsets = aAxis.length > 0 && aAxis[0].workplaceOffsets || zeroOffsets,
				cOffsets = cAxis.length > 0 && cAxis[0].workplaceOffsets || zeroOffsets;
			return {
				"X": xOffsets,
				"Y": yOffsets,
				"Z": zOffsets,
				"A": aOffsets,
				"C": cOffsets,
			}
		},
	},
	data() {
		return {
			wcs: [
				{
					number: 1,
					name: 'G54',
				},
				{
					number: 2,
					name: 'G55',
				},
				{
					number: 3,
					name: 'G56',
				},
				{
					number: 4,
					name: 'G57',
				},
				{
					number: 5,
					name: 'G58',
				},
				{
					number: 6,
					name: 'G59',
				},
				{
					number: 7,
					name: 'G59.1',
				},
				{
					number: 8,
					name: 'G59.2',
				},
				{
					number: 9,
					name: 'G59.3',
				},
			],
			relevantAxes: ["X", "Y", "Z", "A", "C"],
			setWCSOffsetDialog: {
				shown: false,
				title: '',
				prompt: '',
				axis: 'X',
				wcsNumber: 0,
				preset: 0,
			},
			resetDialog: {
				question: '',
				prompt: '',
				wcsNumber: -1,
				shown: false
			},
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		showSetWCSOffsetDialog(axis, wcsNumber) {
			if (this.uiFrozen) {
				return;
			}
			let wcsName = this.wcs[wcsNumber-1].name;
			this.setWCSOffsetDialog.title = this.$t('dialog.setWCSOffset.title', [ wcsName ]);
			this.setWCSOffsetDialog.prompt = this.$t('dialog.setWCSOffset.prompt', [ axis, wcsName ]);
			this.setWCSOffsetDialog.axis = axis;
			this.setWCSOffsetDialog.wcsNumber = wcsNumber;
			this.setWCSOffsetDialog.preset = this.workplaceOffsets[axis][wcsNumber];
			this.setWCSOffsetDialog.shown = true;
		},
		async setWCSOffsetDialogConfirmed(value) {
			this.busy = true;
			try {
				await this.sendCode({ code: `G10 L2 P${this.setWCSOffsetDialog.wcsNumber} ${this.setWCSOffsetDialog.axis}${value}\nM500`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
		},
		resetClicked(wcs) {
			this.resetDialog.question = this.$t('dialog.resetWCS.title', [wcs.name]);
			this.resetDialog.prompt = this.$t('dialog.resetWCS.prompt', [wcs.name]);
			this.resetDialog.wcsNumber = wcs.number;
			this.resetDialog.shown = true;
		},
		async reset() {
			let wcsNumber = this.resetDialog.wcsNumber;
			if (wcsNumber == -1) {
				return;
			}
			this.busy = true;
			try {
				await this.sendCode({ code: `G10 L2 P${wcsNumber} X0 Y0 Z0 A0 C0\nM500`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.resetDialog.wcsNumber = -1;
		}
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.setWCSOffsetDialog.shown = false;
			this.resetDialog.shown = false;
		}
	}
}
</script>
