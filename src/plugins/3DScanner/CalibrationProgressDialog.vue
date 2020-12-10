<template>
	<v-dialog v-model="internalShown" @keydown.escape="dismissed" persistent width="480">
		<v-card>
			<v-card-title>
				<span class="headline">
					{{ t.tc('dialog.calibrationprogress.title') }}
				</span>
			</v-card-title>

			<v-card-text>
				<v-row>
					<v-col>
						<v-progress-linear rounded height="25" :value="progress * 100" class="my-1" reactive>
							<template v-slot="{ value }">
								<strong>{{ Math.ceil(value) }}%</strong>
							</template>
						</v-progress-linear>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						{{ t.tc('dialog.calibrationprogress.prompt') }}
					</v-col>
				</v-row>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<code-btn :code="`M753`" color="red darken-1" text>
					<v-icon>mdi-close</v-icon> {{ t.tc('generic.cancel') }}
				</code-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
'use strict'

import { mapState } from 'vuex'
import { localT } from './index.js'

export default {
	props: {
		shown: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		...mapState('machine/model', ['scanner']),
		progress() {
			return this.scanner.progress;
		},
		internalShown: {
			get() { return this.shown; },
		}
	},
	data() {
		return {
			t: localT,
		}
	},
}
</script>
