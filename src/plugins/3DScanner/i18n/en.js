export default {
	language: 'English',
	menuCaption: '3D Scanner',
	button: {
		calibratescanner: {
			linear: 'Linear',
			rotary: 'Rotary',
		},
		scandialog: {
			linear: 'Linear',
			rotary: 'Rotary',
			activateLaser: 'Activate Laser',
			deactivateLaser: 'Deactivate Laser',
			startScan: 'Start Scan',
		},
		threedscanner: {
			goToScanLocation: 'Move to Scan Location',
			calibrate: 'Calibrate',
			startScan: 'Start Scan',
			shutdownScanner: 'Shutdown Scanner',
		},
	},
	dialog: {
		calibratescanner: {
			title: 'Calibrate Scanner',
			prompt: 'In what mode would you like to run the calibration?',
		},
		calibrationprogress: {
			title: 'Calibrating...',
			progressBarTitle: 'Calibration Progress',
			prompt: 'Please wait while the scanner is being calibtrated. This may take a while...',
		},
		scan: {
			title: 'Start 3D Scan',
			step1: {
				title: '1. Enter a filename for your scan',
				placeholder: 'Choose a filename...',
			},
			step2: {
				title: '2. Specify scan details',
				scanRange: 'Scan range:',
				stepSize: 'Step size:',
				mode: 'Mode:',
			},
			step3: {
				title: "3. Check alignment",
				description: 'In order to align your object you can toggle the right laser before you start:',
			},
			step4: {
				title: '4. Move the object to the center',
			}
		},
		scanprogress: {
			title: 'Scan in Progress',
			scanProgress: 'Scan progress',
			postProcessingProgress: 'Post-processing progress',
			uploadProgress: 'Upload progress',
			complete: 'Your 3D scan is now complete! You may download it from the file list next.'
		},
	},
	panel: {
		threedscanner: {
			caption: '3D Scanner Control',
		},
	},
}
