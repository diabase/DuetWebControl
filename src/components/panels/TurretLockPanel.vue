<style scoped>
.v-btn-toggle {
	display: flex;
}
.v-btn-toggle > button {
	display: flex;
	flex: 1 1 auto;
}
</style>

<template>
	<v-card>
		<v-card-title>
			<v-icon small class="mr-1">{{ icon }}</v-icon> {{ $t('panel.turretLock.caption') }}
		</v-card-title>

		<v-card-text class="pt-0">
			<v-btn-toggle :value="locked" mandatory>
				<v-btn text :value="true" :disabled="uiFrozen" :loading="sendingCode" @click="toggleLock(true)">
					{{ $t('panel.turretLock.on') }}
				</v-btn>
				<v-btn text :value="false" :disabled="uiFrozen" :loading="sendingCode" @click="toggleLock(false)">
					{{ $t('panel.turretLock.off') }}
				</v-btn>
			</v-btn-toggle>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['sensors']),
		locked() {
			return this.sensors
				&& this.sensors.endstops
				&& this.sensors.endstops.length > 4
				&& !this.sensors.endstops[4].triggered;
		},
		icon() {
			return this.locked ? 'mdi-lock' : 'mdi-lock-open-variant';
		}
	},
	data() {
		return {
			sendingCode: false,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async toggleLock(state) {
			if (!this.sendingCode) {
				this.sendingCode = true;
				try {
					const cmd = `M98 P"${state ? 'lock' : 'unlock'}_turret.g"`
					await this.sendCode(cmd);
				} catch (e) {
					// handled before we get here
				}
				this.sendingCode = false;
			}
		}
	}
}
</script>
