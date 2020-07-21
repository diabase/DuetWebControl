<template>
	<v-row>
		<v-col cols="12">
			<v-row>
				<v-col>
					<h2>{{ $t('panel.rotaryaxes.betaWarning') }}</h2>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols="12">
			<rotary-axes-status-panel class="mb-2"></rotary-axes-status-panel>
			<rotary-axes-control-panel class="mb-2"></rotary-axes-control-panel>
		</v-col>
	</v-row>
</template>
