<template>
	<v-row>
		<v-col xs="12" sm="8" md="8" lg="9" xl="9">
			<movement-panel class="mb-3"></movement-panel>

			<v-row v-if="isFFForUnset" class="my-3">
				<v-col sm="12" :md="(atxPower !== null) ? 9 : 12" :lg="(atxPower !== null) ? 9 : 12" :xl="(atxPower !== null) ? 10 : 12">
					<extrude-panel></extrude-panel>
				</v-col>
			</v-row>

			<v-row>
				<v-col md="3" lg="3" xl="2" align-self="center">
					<atx-panel v-if="atxPower !== null"></atx-panel>
					<turret-lock-panel></turret-lock-panel>
				</v-col>
			</v-row>

			<v-row class="my-3">
				<v-col v-if="!isFFForUnset && atxPower !== null" md="3" lg="3" xl="2" align-self="center">
					<atx-panel></atx-panel>
					<turret-lock-panel></turret-lock-panel>
				</v-col>
			</v-row>
		</v-col>

		<v-col class="hidden-xs-only" sm="4" md="4" lg="3" xl="3">
			<v-col cols="12">
				<macro-list></macro-list>
			</v-col>
			<v-col cols="12">
				<fans-panel></fans-panel>
			</v-col>
		</v-col>
	</v-row>
</template>

<script>
'use strict';

import { mapState } from 'vuex';

import { registerRoute } from '..'
import { DashboardMode } from '../../store/settings.js'
import { MachineMode } from '../../store/machine/modelEnums.js'

export default {
    install() {
        // Register a route via Control -> Dashboard
        registerRoute(this, {
            Control: {
                Dashboard: {
                    icon: 'mdi-view-dashboard',
                    caption: 'menu.control.dashboard',
                    path: '/'
                }
            }
        });
    },

	computed: {
		...mapState('machine/model', {
			atxPower: state => state.state.atxPower,
			machineMode: state => state.state.machineMode
		}),
		...mapState('settings', ['dashboardMode']),
		isFFForUnset() {
			if (this.dashboardMode === DashboardMode.default) {
				return !this.machineMode || this.machineMode === MachineMode.fff;
			}
			return this.dashboardMode === DashboardMode.fff;
		},
	},
};
</script>
