<template>
	<v-dialog v-model="internalShown" @keydown.escape="dismissed" persistent width="480">
		<v-card>
			<v-card-title>
				<span class="headline">
					{{ t.tc('dialog.scanprogress.title') }}
				</span>
			</v-card-title>

			<v-card-text>
				<v-row>
					<v-col>
						{{ t.tc('dialog.scanprogress.scanProgress') }}
						<v-progress-linear rounded color="green" height="25" :value="scanProgress" class="my-1" reactive>
							<template v-slot="{ value }">
								<strong>{{ Math.ceil(value) }}%</strong>
							</template>
						</v-progress-linear>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						{{ t.tc('dialog.scanprogress.postProcessingProgress') }}
						<v-progress-linear rounded color="orange" height="25" :value="postProcessingProgress" class="my-1" reactive>
							<template v-slot="{ value }">
								<strong>{{ Math.ceil(value) }}%</strong>
							</template>
						</v-progress-linear>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						{{ t.tc('dialog.scanprogress.uploadProgress') }}
						<v-progress-linear rounded height="25" color="blue" :value="uploadProgress" class="my-1" reactive>
							<template v-slot="{ value }">
								<strong>{{ Math.ceil(value) }}%</strong>
							</template>
						</v-progress-linear>
					</v-col>
				</v-row>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn v-if="scanInProgress" @click="cancelScan" color="red darken-1" text>
					<v-icon>mdi-close</v-icon> {{ t.tc('generic.cancel') }}
				</v-btn>
				<v-btn v-else @click="dismissed" color="blue darken-1" text>
					<v-icon>mdi-close</v-icon> {{ t.tc('generic.close') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
'use strict'

import { mapState, mapActions } from 'vuex'
import { localT } from './index.js'

export default {
	props: {
		shown: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		...mapState('machine/model', {
			status: state => state.scanner.status,
			progress: state => state.scanner.progress,
		}),
		scanInProgress() {
			return this.status == 'S'
				|| this.status == 'P'
				|| this.status == 'U';
		},
		internalShown: {
			get() { return this.shown; },
		}
	},
	data() {
		return {
			scanProgress: 0,
			postProcessingProgress: 0,
			uploadProgress: 0,
			t: localT,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async cancelScan() {
			this.busy = true;
			try {
				await this.sendCode({ code: `M753`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.dismissed();
		},
		dismissed() {
			this.$emit('dismissed');
			this.$emit('update:shown', false);
		}
	},
	watch: {
		progress(to) {
			if (this.status == 'S') {
				this.scanProgress = to * 100;
			} else if (this.status == 'P') {
				this.postProcessingProgress = to * 100;
			} else if (this.status == 'U') {
				this.uploadProgress = to * 100;
			}
		},
		status(to) {
			if (to == 'S') {
				this.scanProgress = 0;
				this.postProcessingProgress = 0;
				this.uploadProgress = 0;
			} else if (to == 'P') {
				this.scanProgress = 100;
				this.postProcessingProgress = 0;
				this.uploadProgress = 0;
			} else if (to == 'U') {
				this.scanProgress = 100;
				this.postProcessingProgress = 100;
				this.uploadProgress = 0;
			} else {
				this.scanProgress = 100;
				this.postProcessingProgress = 100;
				this.uploadProgress = 100;
			}
		}
	}
}
</script>
