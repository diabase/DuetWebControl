export default {
	language: 'English',
	menuCaption: 'Rotary Axes',
	button: {
		rotaryaxes: {
			control: {
				configure: 'Configure Rotary Printing',
				levelRotaryPrintBed: 'Level Rotary Print Bed',
				measureZAxis: 'Measure Z axis',
				setToCurrent: 'Set to current',
				setXmin: 'Set X min',
				setXmax: 'Set X max',
				setYmin: 'Set Y min',
				setYmax: 'Set Y max',
				levelAaxis: 'Level A axis',
				setStockThickness: 'Set stock thickness',
				setYoffset: 'Set Y offset',
				autoLevel: 'Auto-level bed for printing',
				unrotary: 'Reset to normal mode',
			},
			home: 'Rotary',
		},
	},
	dialog: {
		setX: {
			minTitle: 'Set X Min',
			minPrompt: 'Set X minimum to',
			maxTitle: 'Set X Max',
			maxPrompt: 'Set X maximum to',
		}
	},
	panel: {
		rotaryaxes: {
			control: {
				caption: 'Setup',
				tableHeaders: {
					steps: 'Steps',
					actions: 'Actions',
				},
				step1: '1',
				step2: '2',
				step3: '3',
				step4: '4',
				step5: '5',
				step6: '6',
				step7: '7',
				step8: '8',
			},
			status: {
				caption: 'Status',
				tableHeaders: {
					xMin: 'X min',
					xMax: 'X max',
					yMin: 'Y min',
					yMax: 'Y max',
					thickness: 'Stock thickness',
				},
			},
			betaWarning: 'Beta version - some functionality missing',
		},
		rotaryprinting: {
			caption: 'Rotary Printing',
		},
	},
	tabs: {
		rotaryaxes: {
			rotaryprinting: 'Rotary Printing',
			rotaryaxescontrol: 'Multi Axes',
		}
	},
}
