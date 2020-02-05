<template>
	<v-card>
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-stethoscope</v-icon> {{ $t('panel.probeworkpiece.caption') }}
		</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<v-row>
						<p class="mb-1">{{ $t('panel.probeworkpiece.description') }}</p>
					</v-row>
					<v-row>
						<v-spacer/>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}workpiece_Ymax.g${doubleQuote}`" no-wait block tile class="move-btn">
								Y <v-icon>{{ getIcon("Y", "max") }}</v-icon>
							</code-btn>
						</v-col>
						<v-spacer/>
						<v-spacer/>
					</v-row>
					<v-row>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}workpiece_Xmin.g${doubleQuote}`" no-wait block tile class="move-btn">
								-X <v-icon>{{ getIcon("X", "min") }}</v-icon>
							</code-btn>
						</v-col>
						<v-col style="text-align:center;">
							<v-icon>mdi-cube-scan</v-icon>
						</v-col>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}workpiece_Xmax.g${doubleQuote}`" no-wait block tile class="move-btn">
								<v-icon>{{ getIcon("X", "max") }}</v-icon> X
							</code-btn>
						</v-col>
						<v-spacer/>
					</v-row>
					<v-row>
						<v-spacer/>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}workpiece_Ymin.g${doubleQuote}`" no-wait block tile class="move-btn">
								-Y <v-icon>{{ getIcon("Y", "min") }}</v-icon>
							</code-btn>
						</v-col>
						<v-spacer/>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}workpiece_Zmax.g${doubleQuote}`" no-wait block tile class="move-btn">
								Z <v-icon>{{ getIcon("Z", "max") }}</v-icon>
							</code-btn>
						</v-col>
					</v-row>
					<!-- <v-row v-for="axis in probingAxes" :key="axis.letter"> -->
					<!-- 	<v-col v-for="fr in axis.from" :key="fr" :cols="4"> -->
					<!-- 		<code-btn :code="`M98 P${doubleQuote}workpiece_${ axis.letter }${ fr }.g${doubleQuote}`" no-wait block tile class="move-btn"> -->
					<!-- 			{{ (fr == "min" ? "-" : "+") + axis.letter }} (<v-icon>{{ getIcon(axis.letter, fr) }}</v-icon>) -->
					<!-- 		</code-btn> -->
					<!-- 	</v-col> -->
					<!-- </v-row> -->
				</v-col>
				<v-col>
					<v-row dense>
						<v-col>
							<code-btn :code="`M98 P${doubleQuote}tcalibrate.g${doubleQuote}`" no-wait block tile class="move-btn">
								<v-icon>mdi-image-filter-center-focus</v-icon> {{ $t('button.probeWorkpiece.findCenterOfCavity') }}
							</code-btn>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import {mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
	},
	data() {
		return {
			//probingAxes: [
				//{
					//letter: "X",
					//from: ["min", "max"]
				//},
				//{
					//letter: "Y",
					//from: ["min", "max"]
				//},
				//{
					//letter: "Z",
					//from: ["max"]
				//}
			//],
			doubleQuote: '"',
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		getIcon(axis, from) {
			if (axis == "Z" || (axis == "Y" && from == "max")) {
				return "mdi-arrow-collapse-down"
			}
			if (axis == "Y") {
				return "mdi-arrow-collapse-up"
			}
			if (from == "min") {
				return "mdi-arrow-collapse-right"
			}
			return "mdi-arrow-collapse-left"
		}
	},
}
</script>
