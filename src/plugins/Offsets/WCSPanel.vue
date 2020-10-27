<style scoped>
.wcs-value {
	cursor: pointer;
}
.current-wcs {
	color: lightgreen;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-axis-arrow</v-icon> {{ $t('plugins.offsets.panel.wcs.caption') }}
		</v-card-title>

		<v-card-text>
			<v-simple-table fixed-header>
				<thead>
					<tr>
						<th class="text-center">{{ $t('plugins.offsets.panel.wcs.tableHeaders.wcs') }}</th>
						<th class="text-center">{{ $t('plugins.offsets.panel.wcs.tableHeaders.changeTo') }}</th>
						<th class="text-center" v-for="axis in relevantAxes" :key="axis">{{ axis }}</th>
						<th class="text-center">{{ $t('plugins.offsets.panel.wcs.tableHeaders.reset') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="w in wcs" :key="w" :class="{'current-wcs': move.workplaceNumber == w-1}">
						<td class="text-left">{{ w + ' (' + wcsNames[w-1] + ')' }} <v-icon v-if="move.workplaceNumber == w-1" small class="mr-1">mdi-checkbox-marked-outline</v-icon></td>
						<td class="text-center">
							<code-btn :code="`${wcsNames[w]}`" no-wait lock small v-if="move.currentWorkplace != w">
								<v-icon small>mdi-marker-check</v-icon>
							</code-btn>
						</td>
						<td class="text-right" v-for="axis in relevantAxes" :key="axis">
							<code-btn class="mr-1" :code="`G10 L20 P${w} ${axis}`" :title="`${ $t('plugins.offsets.button.wcs.setToCurrent') }`" no-wait lock small>
								<v-icon small>mdi-home-import-outline</v-icon>
							</code-btn>
							<span class="wcs-value" @click="showSetWCSOffsetDialog(axis, w)">{{ $display(workplaceOffsets[axis][w-1], (axis === "Z" ? 3 : 2), 'mm') }}</span>
						</td>
						<td class="text-center">
							<v-btn @click="resetClicked(w)" no-wait lock small :disabled="uiFrozen">
								<v-icon small>mdi-home-floor-0</v-icon>
							</v-btn>
						</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card-text>
		<input-dialog :shown.sync="setWCSOffsetDialog.shown" :title="setWCSOffsetDialog.title" :prompt="setWCSOffsetDialog.prompt" :preset="setWCSOffsetDialog.preset" is-numeric-value @confirmed="setWCSOffsetDialogConfirmed"></input-dialog>
		<confirm-dialog :shown.sync="resetDialog.shown" :title="resetDialog.title" :prompt="resetDialog.prompt" @confirmed="reset"></confirm-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move']),
		...mapState('machine', ['wcsNames']),
		workplaceOffsets() {
			const zeroOffsets = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			let xAxis = this.move.axes.filter(axis => axis.letter == "X"),
				yAxis = this.move.axes.filter(axis => axis.letter == "Y"),
				zAxis = this.move.axes.filter(axis => axis.letter == "Z"),
				aAxis = this.move.axes.filter(axis => axis.letter == "A"),
				cAxis = this.move.axes.filter(axis => axis.letter == "C");

			let xOffsets = (xAxis[0] && xAxis[0].workplaceOffsets.length > 0 && xAxis[0].workplaceOffsets) || zeroOffsets,
				yOffsets = (yAxis[0] && yAxis[0].workplaceOffsets.length > 0 && yAxis[0].workplaceOffsets) || zeroOffsets,
				zOffsets = (zAxis[0] && zAxis[0].workplaceOffsets.length > 0 && zAxis[0].workplaceOffsets) || zeroOffsets,
				aOffsets = (aAxis[0] && aAxis[0].workplaceOffsets.length > 0 && aAxis[0].workplaceOffsets) || zeroOffsets,
				cOffsets = (cAxis[0] && cAxis[0].workplaceOffsets.length > 0 && cAxis[0].workplaceOffsets) || zeroOffsets;
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
			wcs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
				title: '',
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
			const wcsName = this.wcsNames[wcsNumber];
			this.setWCSOffsetDialog.title = this.$t('dialog.setWCSOffset.title', [ wcsName ]);
			this.setWCSOffsetDialog.prompt = this.$t('dialog.setWCSOffset.prompt', [ axis, wcsName ]);
			this.setWCSOffsetDialog.axis = axis;
			this.setWCSOffsetDialog.wcsNumber = wcsNumber;
			this.setWCSOffsetDialog.preset = this.workplaceOffsets[axis][wcsNumber-1];
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
		resetClicked(wcsNumber) {
			const wcsName = this.wcsNames[wcsNumber]
			this.resetDialog.title = this.$t('plugins.offsets.dialog.resetWCS.title', [wcsName]);
			this.resetDialog.prompt = this.$t('plugins.offsets.dialog.resetWCS.prompt', [wcsName]);
			this.resetDialog.wcsNumber = wcsNumber;
			this.resetDialog.shown = true;
		},
		async reset() {
			const wcsNumber = this.resetDialog.wcsNumber;
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
