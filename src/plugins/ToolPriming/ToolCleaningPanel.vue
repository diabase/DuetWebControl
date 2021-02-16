<template>
	<v-card>
		<v-card-title>
			<v-icon small>mdi-broom</v-icon> {{ t('panel.toolCleaning.caption') }}
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col v-for="tool in toolsWithExtruder" :key="tool.number">
					<code-btn :code="`M98 P${doubleQuote}tprime${tool.number}.g${doubleQuote}`" no-wait block :disabled="uiFrozen">
						<v-icon small>mdi-broom</v-icon> {{ t('button.toolCleaning.clean', [tool.number]) }}
					</code-btn>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters } from 'vuex'
import { localT } from './index.js'

export default {
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['tools']),
		toolsWithExtruder() {
			return this.tools.filter(tool => tool !== null && tool.extruders.length > 0)
		},
	},
	data() {
		return {
			doubleQuote: '"',
			t: localT,
		}
	},
}
</script>

