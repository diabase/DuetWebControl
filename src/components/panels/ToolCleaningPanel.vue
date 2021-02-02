<template>
	<v-card>
		<v-card-title>
			<v-icon small>mdi-broom</v-icon> {{ $t('panel.toolCleaning.caption') }}
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col v-for="tool in toolsWithExtruder" :key="tool.number">
					<v-btn @click="cleaningClicked(tool.number)" no-wait lock small :disabled="uiFrozen">
						<v-icon small>mdi-broom</v-icon> {{ $t('button.toolCleaning.clean', [tool.number]) }}
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<confirm-dialog :shown.sync="cleanConfirmDialog.shown" :title="cleanConfirmDialog.title" :prompt="cleanConfirmDialog.prompt" @confirmed="clean(cleanConfirmDialog.toolNumber)"></confirm-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['tools']),
		toolsWithExtruder() {
			return this.tools.filter(tool => tool !== null && tool.extruders.length > 0)
		},
	},
	data() {
		return {
			cleanConfirmDialog: {
				title: '',
				prompt: '',
				toolNumber: -1,
				shown: false
			},
			doubleQuote: '"',
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async clean(toolNumber) {
			this.busy = true;
			try {
				await this.sendCode({ code: `M98 P${this.doubleQuote}tprime${toolNumber}.g${this.doubleQuote}`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
		},
		cleaningClicked(toolNumber) {
			this.cleanConfirmDialog.title = this.$t('dialog.confirmCleaning.title', [toolNumber]);
			this.cleanConfirmDialog.prompt = this.$t('dialog.confirmCleaning.prompt', [toolNumber]);
			this.cleanConfirmDialog.toolNumber = toolNumber;
			this.cleanConfirmDialog.shown = true;
		},
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.cleanConfirmDialog.shown = false;
		}
	}
}
</script>

