<style scoped>
.slider {
	margin-top: 40px;
}
</style>

<template>
	<v-row dense align="center">
		<v-col cols="auto">
			<v-icon @click="doShowSliderEditDialog">mdi-pencil</v-icon>
		</v-col>
		<v-col cols="auto">
			<v-btn large icon :disabled="disabled || innerValue <= min" @click="change(-step)" @mousedown="mouseDown(false)" @mouseup="mouseUp(false)" @mouseleave="mouseUp(false)" @touchstart="mouseDown(false)" @touchend="mouseUp(false)" class="ml-0">
				<v-icon>mdi-minus</v-icon>
			</v-btn>
		</v-col>

		<v-col>
			<v-slider :value="innerValue" @change="$emit('input', $event)" :min="min" :max="max" :disabled="disabled" hide-details thumb-label="always" class="slider"></v-slider>
			<input-dialog :shown.sync="showSliderEditDialog" :title="$t('dialog.sliderEdit.title')" :prompt="$t('dialog.sliderEdit.prompt')" :preset="innerValue" is-numeric-value @confirmed="setSliderValue"></input-dialog>
		</v-col>

		<v-col cols="auto">
			<v-btn large icon :disabled="disabled || innerValue >= max" @click="change(step)" @mousedown="mouseDown(true)" @mouseup="mouseUp(true)" @mouseleave="mouseUp(true)" @touchstart="mouseDown(true)" @touchend="mouseUp(true)" class="mr-0">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
'use strict'

import { mapGetters } from 'vuex'

const debounceTime = 500
const changeTime = 300, changeInterval = 150

export default {
	props: {
		value: {
			type: Number,
			required: true
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 5
		},
		disabled: Boolean
	},
	computed: {
		...mapGetters(['isConnected']),
	},
	data() {
		return {
			innerValue: this.value,
			debounceTimer: undefined,
			time: undefined,
			increaseTimer: undefined,
			decreaseTimer: undefined,
			showSliderEditDialog: false,
		}
	},
	methods: {
		change(diff) {
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}
			this.innerValue = Math.round(Math.min(this.max, Math.max(this.min, this.innerValue + diff)));
			this.debounceTimer = setTimeout(this.debounce, debounceTime);
		},
		debounce() {
			this.$emit('input', this.innerValue);
			this.debounceTimer = undefined;
		},
		mouseDown(increment) {
			if (increment) {
				this.increaseTimer = setTimeout(this.increase, changeTime);
			} else {
				this.decreaseTimer = setTimeout(this.decrease, changeTime);
			}
		},
		mouseUp(increment) {
			if (increment && this.increaseTimer) {
				clearTimeout(this.increaseTimer);
				this.increaseTimer = undefined;
			} else if (this.decreaseTimer) {
				clearTimeout(this.decreaseTimer);
				this.decreaseTimer = undefined;
			}
		},
		increase() {
			this.change(this.step);
			this.increaseTimer = setTimeout(this.increase, changeInterval);
		},
		decrease() {
			this.change(-this.step);
			this.decreaseTimer = setTimeout(this.decrease, changeInterval);
		},
		doShowSliderEditDialog() {
			this.showSliderEditDialog = true;
		},
		setSliderValue(val) {
			this.innerValue = Math.round(Math.min(this.max, Math.max(this.min, val)));
			this.$emit('input', this.innerValue);
		},
	},
	watch: {
		value(to) {
			const newValue = Math.round(to);
			if (this.innerValue !== newValue) {
				this.innerValue = newValue;
			}
		},
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.showSliderEditDialog = false;
		}
	}
}
</script>
