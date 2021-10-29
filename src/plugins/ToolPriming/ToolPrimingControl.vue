<template>
	<v-row>
		<v-col cols="12">
			<v-card>
				<v-card-title class="pb-0">
					<v-icon class="mr-1" small>mdi-needle</v-icon>
					{{ t('panel.toolPriming.caption') }}
				</v-card-title>
				<v-card-text>
					<v-simple-table>
						<thead>
							<tr>
								<th>{{ t('panel.toolPriming.tableHeaders.tool') }}</th>
								<th>{{ t('panel.toolPriming.tableHeaders.primeExtrusionAmount') }}</th>
								<th>{{ t('panel.toolPriming.tableHeaders.extrusionFeedrate') }}</th>
								<th>{{ t('panel.toolPriming.tableHeaders.afterPrimeRetractionAmount') }}</th>
								<th>{{ t('panel.toolPriming.tableHeaders.retractionFeedrate') }}</th>
								<th>{{ t('panel.toolPriming.tableHeaders.additionalRetractionAmount')}}</th>
							</tr>
						</thead>
						<tbody>
							<tr :key="index" v-for="(tool, index) in fffTools">
								<td>{{ tool.name || t('panel.toolPriming.table.toolNumber', [tool.number]) }}</td>
								<td>
									<v-text-field :disabled="uiFrozen" @change="save" suffix="mm" type="number" v-model.number="tool.retraction.primeExtrusionAmount"></v-text-field>
								</td>
								<td>
									<v-text-field :disabled="uiFrozen" @change="save" suffix="mm/s" type="number" v-model.number="tool.retraction.unretractSpeed"></v-text-field>
								</td>
								<td>
									<v-text-field :disabled="uiFrozen" @change="save" suffix="mm" type="number" v-model.number="tool.retraction.length"></v-text-field>
								</td>
								<td>
									<v-text-field :disabled="uiFrozen" @change="save" suffix="mm/s" type="number" v-model.number="tool.retraction.speed"></v-text-field>
								</td>
								<td>
									<v-text-field @change="save" suffix="mm" type="number" v-model.number="tool.retraction.additionalRetractionAmount"></v-text-field>
								</td>
							</tr>
						</tbody>
					</v-simple-table>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
'use strict';

import {mapGetters, mapActions, mapState} from 'vuex';
import _ from 'lodash';
import Path from '../../utils/path.js';
import {localT} from './index.js';

export default {
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['directories', 'tools', 'global']),
		fffTools() {
			let filtered = _.cloneDeep(this.tools.filter((tool) => tool && tool.extruders && tool.extruders.length >= 1));
			filtered.forEach((tool) => {
				tool.retraction.primeExtrusionAmount = tool.retraction.length + tool.retraction.extraRestart;
				let toolAdditionalRetraction = this.global[`t${tool.number}AdditionalRetraction`] ?? 0;
				tool.retraction.additionalRetractionAmount = toolAdditionalRetraction;
			});

			return filtered;
		},
	},
	data() {
		return {
			doubleQuote: '"',
			filename: 'toolpriming.g',
			toolData: [],
			t: localT,
		};
	},
	methods: {
		...mapActions('machine', ['sendCode', 'upload']),
		async save() {
			this.busy = true;
			try {
				const content = new Blob([this.getSettings()]);
				let path = Path.combine(this.directories.system, this.filename);
				await this.upload({filename: path, content: content, showSuccess: false});
				this.$makeNotification('success', this.t('notification.toolPriming.successTitle'), this.t('notification.toolPriming.successMessage', [Path.extractFileName(path)]));
				await this.sendCode({code: `M98 P${this.doubleQuote}${path}${this.doubleQuote}`, log: false});
			} catch (e) {
				console.warn(e);
				this.$makeNotification('error', this.t('notification.toolPriming.errorTitle'), e.message);
			}
			this.busy = false;
		},
		getSettings() {
			let m207Commands = '';
			this.fffTools.map((tool) => {
				m207Commands += `if !{exists(global.t${tool.number}AdditionalRetraction)}\n`;
				m207Commands += `\tglobal t${tool.number}AdditionalRetraction = ${tool.retraction.additionalRetractionAmount};\n`;
				m207Commands += 'else\n';
				m207Commands += `\tset global.t${tool.number}AdditionalRetraction = ${tool.retraction.additionalRetractionAmount};\n`;
				m207Commands += `M207 P${tool.number} S${tool.retraction.length} F${tool.retraction.speed * 60} T${tool.retraction.unretractSpeed * 60} R${tool.retraction.primeExtrusionAmount - tool.retraction.length}\n`;
			});
			return m207Commands;
		},
	},
};
</script>
