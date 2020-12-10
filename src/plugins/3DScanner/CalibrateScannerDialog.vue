<template>
	<v-dialog v-model="internalShown" @keydown.escape="dismissed" persistent width="480">
		<v-card v-bind="{ light: darkTheme, dark: !darkTheme }">
			<v-card-title>
				<span class="headline">
					{{ t.tc('dialog.calibratescanner.title') }}
				</span>
			</v-card-title>

			<v-card-text>
				{{ t.tc('dialog.calibratescanner.prompt') }}
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="red darken-1" text @click="dismissed">
					<v-icon>mdi-close</v-icon> {{ t.tc('generic.cancel') }}
				</v-btn>
				<v-btn color="blue darken-1" text @click="calibrateLinear">
					<v-icon>mdi-arrow-expand</v-icon> {{ t.tc('button.calibratescanner.linear') }}
				</v-btn>
				<v-btn color="blue darken-1" text @click="calibrateRotary">
					<v-icon>mdi-sync</v-icon> {{ t.tc('button.calibratescanner.rotary') }}
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
		...mapState('settings', ['darkTheme']),
		internalShown: {
			get() { return this.shown; },
			set(value) {
				if (value) {
					this.confirmed();
				} else {
					this.dismissed();
				}
			}
		}
	},
	data() {
		return {
			t: localT,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async calibrateLinear() {
			this.busy = true;
			try {
				await this.sendCode({ code: `M754 N0`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.confirmed();
		},
		async calibrateRotary() {
			this.busy = true;
			try {
				await this.sendCode({ code: `M754 N1`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.confirmed();
		},
		confirmed() {
			this.$emit('confirmed');
			this.$emit('update:shown', false);
		},
		dismissed() {
			this.$emit('dismissed');
			this.$emit('update:shown', false);
		}
	}
}
</script>
