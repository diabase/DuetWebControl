export default {
	language: 'English',
	menuCaption: 'Offsets',
	button: {
		probeWorkpiece: {
			findCenterOfCavity: 'Find center of cavity',
			measureZ: 'Measure Z',
		},
		touchoff: {
			runSpindleBackwards: 'Run Spindle backwards',
			touchoff: 'Touch-off {0}',
			turnOffTool: 'Turn off tool',
		},
		tooloffsets: {
			setToCurrent: 'Set to current value',
		},
		wcs: {
			setToCurrent: 'Set to current value',
		},
	},
	dialog: {
		editToolOffsetAmount: {
			title: 'Edit tool offset movement amount',
			prompt: 'Please enter a new amount for the clicked button:'
		},
		resetWCS: {
			title: 'Reset {0}',
			prompt: 'Do you want to reset {0} to all 0?',
		},
		setToolOffset: {
			title: 'Set {0} offset',
			prompt: 'Please enter a new {0} offset for {1}:'
		},
		setWCSOffset: {
			title: 'Set {0} offset',
			prompt: 'Please enter a new {0} offset for {1}:'
		},
	},
	panel: {
		probeworkpiece: {
			caption: 'Probe Workpiece',
			description: 'Start probing from (and move)',
		},
		tooloffsets: {
			caption: 'Tool Offsets',
			tableHeaders: {
				name: 'Name',
			},
			amount: 'Offset amount in {0}:',
		},
		touchoff: {
			caption: 'Touch-off Plate',
			plateInstalled: 'Touch-off Plate installed',
			plateMissing: 'Touch-off Plate not installed',
			probeReady: 'Probe ready',
		},
		wcs: {
			caption: 'Workpiece Coordinate Offsets',
			tableHeaders: {
				wcs: 'Workpiece',
				changeTo: 'Change to',
				reset: 'Reset',
			},
		},
	},
}
