<style scoped>
.move-btn {
	color: red;
}
</style>

<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-magnify</v-icon> {{ t.tc('panel.rotaryaxes.status.caption') }}
		</v-card-title>

		<v-card-text>
			<v-simple-table>
				<thead>
					<tr>
						<th class="text-center">{{ t.tc('panel.rotaryaxes.status.tableHeaders.xMin') }}</th>
						<th class="text-center">{{ t.tc('panel.rotaryaxes.status.tableHeaders.xMax') }}</th>
						<th class="text-center">{{ t.tc('panel.rotaryaxes.status.tableHeaders.yMin') }}</th>
						<th class="text-center">{{ t.tc('panel.rotaryaxes.status.tableHeaders.yMax') }}</th>
						<th class="text-center">{{ t.tc('panel.rotaryaxes.status.tableHeaders.thickness') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="text-center">{{ this.xAxis.min.toFixed(2) }}</td>
						<td class="text-center">{{ this.xAxis.max.toFixed(2) }}</td>
						<td class="text-center">{{ this.yAxis.min.toFixed(2) }}</td>
						<td class="text-center">{{ this.yAxis.max.toFixed(2) }}</td>
						<td class="text-center">Needs variables</td>
					</tr>
				</tbody>
			</v-simple-table>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState } from 'vuex'
import { localT } from './index.js'

export default {
	computed: {
		...mapState('machine/model', ['move']),
		xAxis() {
			return this.move.axes.filter(axis => axis.letter == 'X')[0] || {min: 0, max: 0};
		},
		yAxis() {
			return this.move.axes.filter(axis => axis.letter == 'Y')[0] || {min: 0, max: 0};
		},
	},
	data() {
		return {
			t: localT,
		}
	},
}
</script>
