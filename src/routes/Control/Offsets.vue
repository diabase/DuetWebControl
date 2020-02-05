<template>
	<v-row>
		<v-col cols="12">
			<tool-offsets-panel class="mb-2"></tool-offsets-panel>
			<v-row>
				<v-col>
					<probe-workpiece-panel class="mb-2"></probe-workpiece-panel>
				</v-col>
				<v-col>
					<touch-off-plate-panel class="mb-2"></touch-off-plate-panel>
				</v-col>
			</v-row>
			<wcs-panel class="mb-2"></wcs-panel>
		</v-col>
	</v-row>
</template>

<script>

import { mapState } from 'vuex'

export default {
	computed: mapState('machine/model', ['state'])
}
</script>
