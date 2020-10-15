<template>
	<v-row>
		<v-col cols="12">
			<v-tabs v-model="tab">
				<v-tab :key="rotaryprinting">{{ $t('plugins.rotaryAxes.tabs.rotaryaxes.rotaryprinting') }}</v-tab>
				<v-tab :key="rotaryaxescontrol">{{ $t('plugins.rotaryAxes.tabs.rotaryaxes.rotaryaxescontrol') }}</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item :key="rotaryprinting">
					<v-row>
						<v-col cols="12">
							<rotary-3d-printing-panel class="mb-2"></rotary-3d-printing-panel>
						</v-col>
					</v-row>
				</v-tab-item>
				<v-tab-item :key="rotaryaxescontrol">
					<v-row>
						<v-col cols="12">
							<v-row>
								<v-col>
									<h2>{{ $t('plugins.rotaryAxes.panel.rotaryaxes.betaWarning') }}</h2>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="12">
							<rotary-axes-status-panel class="mb-2"></rotary-axes-status-panel>
							<rotary-axes-control-panel class="mb-2"></rotary-axes-control-panel>
						</v-col>
					</v-row>
				</v-tab-item>
			</v-tabs-items>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

export default {
	data() {
		return {
			tab: null,
		}
	},
}
</script>
