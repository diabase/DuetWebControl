<template>
	<v-row>
		<v-col cols="12">
			<v-card>
				<v-card-title class="pb-0">
					<v-icon small class="mr-1">mdi-needle</v-icon> {{ t('panel.toolPriming.caption') }}
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
							</tr>
						</thead>
						<tbody>
							<tr v-for="(tool, index) in fffTools" :key="index">
								<td>{{ tool.name || t('panel.toolPriming.table.toolNumber', [tool.number]) }}</td>
								<td>
									<v-text-field type="number" suffix="mm" v-model.number="tool.retraction.primeExtrusionAmount" @change="save" :disabled="disabled"></v-text-field>
								</td>
								<td>
									<v-text-field type="number" suffix="mm/s" v-model.number="tool.retraction.unretractSpeed" @change="save" :disabled="disabled"></v-text-field>
								</td>
								<td>
									<v-text-field type="number" suffix="mm" v-model.number="tool.retraction.length" @change="save" :disabled="disabled"></v-text-field>
								</td>
								<td>
									<v-text-field type="number" suffix="mm/s" v-model.number="tool.retraction.speed" @change="save" :disabled="disabled"></v-text-field>
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
'use strict'

import {mapGetters, mapActions, mapState } from 'vuex'
import _ from 'lodash'
import Path from '../../utils/path.js'
import { localT } from './index.js'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['directories', 'tools']),
	},
	data() {
		return {
			doubleQuote: '"',
			filename: 'toolpriming.g',
			fffTools: [],
			t: localT,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode', 'upload']),
		updateFFFTools() {
			let filtered = _.cloneDeep(this.tools.filter(tool => tool && tool.extruders && tool.extruders.length >= 1));
			filtered.forEach(tool => tool.retraction.primeExtrusionAmount = tool.retraction.length + tool.retraction.extraRestart);
			this.fffTools = filtered;
		},
		async save() {
			this.busy = true;
			try {
				const content = new Blob([this.getSettings()]);
				let path = Path.combine(this.directories.system, this.filename);
				await this.upload({ filename: path, content: content, showSuccess: false });
				this.$makeNotification('success', this.t('notification.toolPriming.successTitle'), this.t('notification.toolPriming.successMessage', [Path.extractFileName(path)]));
				await this.sendCode({ code: `M98 P${this.doubleQuote}${path}${this.doubleQuote}`, log: false });
			} catch (e) {
				console.warn(e);
				this.$makeNotification('error', this.t('notification.toolPriming.errorTitle'), e.message);
			}
			this.busy = false;
		},
		getSettings() {
			let m207Commands = '';
			this.fffTools.map(tool => {
				m207Commands +=
					`M207 P${tool.number} S${tool.retraction.length} F${tool.retraction.speed} T${tool.retraction.unretractSpeed} R${tool.retraction.primeExtrusionAmount - tool.retraction.length}\n`
			});
			return m207Commands;
		}
	},
	mounted() {
		this.updateFFFTools()
	},
	watch: {
		tools() {
			this.updateFFFTools()
		}
	}
}
</script>
