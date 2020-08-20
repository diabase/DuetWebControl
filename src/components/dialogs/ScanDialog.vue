<style scoped>
.move-warn {
	color: red !important;
}
.step-title {
	font-size: 20px;
}
.step-description {
	margin-left: 22px;
}
</style>
<template>
	<v-dialog v-model="internalShown" @keydown.escape="dismissed" persistent>
		<v-card>
			<v-card-title>
				{{ $t('dialog.scan.title') }}
			</v-card-title>

			<v-card-text>
				<!-- Filename -->
				<v-row>
					<v-col cols="6">
						<v-row dense>
							<v-col class="step-title">
								{{ $t('dialog.scan.step1.title') }}
							</v-col>
						</v-row>
						<v-row dense>
							<v-col class="step-description">
								<v-text-field v-model="filename" prepend-icon="mdi-file-outline" :placeholder="$t('dialog.scan.step1.placeholder')"></v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<!-- Scan details -->
				<v-row>
					<v-col cols="6">
						<v-row dense>
							<v-col class="step-title">
								{{ $t('dialog.scan.step2.title') }}
							</v-col>
						</v-row>
						<v-row>
							<v-col class="step-description">
								<v-row dense>
									<v-col>
										{{ $t('dialog.scan.step2.scanRange') }}
									</v-col>
								</v-row>
								<v-row dense>
									<v-col>
										<v-text-field type="number" min="0" suffix="mm" v-model="scanRange"></v-text-field>
									</v-col>
								</v-row>
							</v-col>
							<v-col>
								<v-row dense>
									<v-col>
										{{ $t('dialog.scan.step2.stepSize') }}
									</v-col>
								</v-row>
								<v-row dense>
									<v-col>
										<v-text-field type="number" min="0" suffix="mm" v-model="stepSize"></v-text-field>
									</v-col>
								</v-row>
							</v-col>
							<v-col>
								<v-row dense>
									<v-col>
										{{ $t('dialog.scan.step2.mode') }}
									</v-col>
								</v-row>
								<v-row dense>
									<v-col>
										<v-btn-toggle v-model="scanMode" mandatory>
											<v-btn :value="0">
												{{ $t('button.scandialog.linear') }}
											</v-btn>
											<v-btn :value="1">
												{{ $t('button.scandialog.rotary') }}
											</v-btn>
										</v-btn-toggle>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<!-- Check alignment -->
				<v-row>
					<v-col cols="6">
						<v-row dense>
							<v-col class="step-title">
								{{ $t('dialog.scan.step3.title') }}
							</v-col>
						</v-row>
						<v-row>
							<v-col class="step-description">
								{{ $t('dialog.scan.step3.description') }}
								<v-btn v-if="!laserActive" color="blue darken-1" @click="toggleLaser" block>
									<v-icon>mdi-flare</v-icon> {{ $t('button.scandialog.activateLaser') }}
								</v-btn>
								<v-btn v-else @click="toggleLaser" block>
									<v-icon>mdi-flare</v-icon> {{ $t('button.scandialog.deactivateLaser') }}
								</v-btn>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<!-- Jog control -->
				<v-row>
					<v-col>
						<v-row dense>
							<v-col class="step-title">
								{{ $t('dialog.scan.step4.title') }}
							</v-col>
						</v-row>
						<v-row dense>
							<v-col class="step-description">
								<!-- TODO Replace the following and the content in MovementPanel with an own component -->
								<v-row v-for="axis in displayedAxes" :key="axis.letter" dense align="center">
									<!-- Decreasing movements -->
									<v-col>
										<v-row no-gutters>
											<v-col v-for="index in numMoveSteps" :key="-index"  :class="getMoveCellClass(index - 1)">
												<code-btn :code="`M120\nG91\nG1 ${axis.letter}${-moveSteps(axis.letter)[index - 1]} F${moveFeedrate}\nG90\nM121`" no-wait @contextmenu.prevent="showMoveStepDialog(axis.letter, index - 1)" block tile class="move-btn move-warn">
													<v-icon>mdi-chevron-left</v-icon> {{ axis.letter + showSign(-moveSteps(axis.letter)[index - 1]) }}
												</code-btn>
											</v-col>
										</v-row>
									</v-col>

									<!-- Current position -->
									<v-col cols="auto" class="px-3">
										<strong>
											{{ axis.letter + ' = ' + displayAxisPosition(axis) }}
										</strong>
									</v-col>

									<!-- Increasing movements -->
									<v-col>
										<v-row no-gutters>
											<v-col v-for="index in numMoveSteps" :key="index" :class="getMoveCellClass(numMoveSteps - index)">
												<code-btn :code="`M120\nG91\nG1 ${axis.letter}${moveSteps(axis.letter)[numMoveSteps - index]} F${moveFeedrate}\nG90\nM121`" no-wait @contextmenu.prevent="showMoveStepDialog(axis.letter, numMoveSteps - index)" block tile class="move-btn move-warn">
													{{ axis.letter + showSign(moveSteps(axis.letter)[numMoveSteps - index]) }} <v-icon>mdi-chevron-right</v-icon>
												</code-btn>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="red darken-1" text @click="dismissed">
					{{ $t('generic.cancel') }}
				</v-btn>
				<v-btn color="blue darken-1" text @click="startScan" :disabled="filename == ''">
					{{ $t('button.scandialog.startScan') }}
				</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	props: {
		shown: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		...mapState('machine', ['isReconnecting']),
		...mapState('machine/model', ['move']),
		...mapState('machine/settings', ['moveFeedrate']),
		...mapGetters('machine/settings', ['moveSteps', 'numMoveSteps']),
		displayedAxes() {
			return this.move.axes.filter((axis) => axis.visible && ['X', 'Y', 'Z', 'A'].includes(axis.letter));
		},
		internalShown: {
			get() { return this.shown; },
			set(value) {
				if (value) {
					this.confirmed();
				} else {
					this.dismissed();
				}
			}
		},
	},
	data() {
		return {
			filename: '',
			scanRange: 360,
			stepSize: 1,
			scanMode: 0,
			laserActive: false,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		displayAxisPosition(axis) {
			let position = NaN;
			if (this.displayToolPosition) {
				if (axis.drives.length > 0) {
					position = this.move.drives[axis.drives[0]].position;
				}
			} else {
				position = axis.machinePosition;
			}
			return (axis.letter === 'Z') ? this.$displayZ(position, false) : this.$display(position, 1);
		},
		getMoveCellClass(index) {
			let classes = '';
			if (index === 0 || index === this.numAxsSteps - 1) {
				classes += 'hidden-md-and-down';
			}
			if (index > 1 && index < 5 && index % 2 === 1) {
				classes += 'hidden-sm-and-down';
			}
			return classes;
		},
		showSign: (value) => (value > 0) ? `+${value}` : value,
		async toggleLaser() {
			this.busy = true;
			try {
				await this.sendCode({ code: `M755 P${this.laserActive ? 0 : 1}`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.laserActive = !this.laserActive;
		},
		async startScan() {
			this.busy = true;
			try{
				if (this.laserActive) {
					await this.toggleLaser();
				}
				await this.sendCode({ code: `M752 S${this.scanRange} R${this.stepSize} N${this.scanMode} P"${this.filename}"`, log: false });
			} catch (e) {
				// already handled
			}
			this.busy = false;
			this.dismissed();
		},
		dismissed() {
			this.$emit('dismissed');
			this.$emit('update:shown', false);
		},
	},
}
</script>
