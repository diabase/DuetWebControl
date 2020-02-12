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
			<v-icon small class="mr-1">{{ locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}</v-icon> {{ $t('panel.turretLock.caption') }}
		</v-card-title>

		<v-card-text class="pt-0">
			<v-btn-toggle :value="locked" @change="toggleLock" mandatory>
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

import { mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['uiFrozen']),
	},
	data() {
		return {
			sendingCode: false,
			locked: true,
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
				this.locked = state;
				this.sendingCode = false;
			}
		}
	}
}
</script>
