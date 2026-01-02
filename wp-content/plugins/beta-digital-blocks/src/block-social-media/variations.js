import { __ } from '@wordpress/i18n';
/**
 * Block Config.
 * Set basic params for controlling the editor.
 */
 export const BLOCK_CONFIG = {
	// Set up the block template.
	CTA_TEMPLATE: [

		[
			'core/group',
			{
				level: 2,
				lock: {
					move: true,
					remove: true
				},
			},
			[
				[

					'core/columns', {
						lock: {
							move: true,
							remove: true
						},
					}, [
						['core/column', {
							lock: {
								move: true,
								remove: true
							},
						}, [
							['core/image', {lock: {
								move: true,
								remove: true
							},}],
							[
								'core/paragraph',
								{
									placeholder: 'Optional CTA text',
									align: 'center',
									lock: {
										move: true,
									},
								},
							],
						]],
						['core/column', {
							lock: {
								move: true,
								remove: true
							},
						}, [
							['core/image', {lock: {
								move: true,
								remove: true
							},}]
						]],
						['core/column', {
							lock: {
								move: true,
								remove: true
							},
						}, [
							['core/image', {lock: {
								move: true,
								remove: true
							},}]
						]]
					]
				]
			]
		],
	],
	// Set up the allowed blocks.
	ALLOWED_BLOCKS: ['core/paragraph', 'core/heading', 'core/buttons', 'core/columns', 'core/column', 'core/group'],
};
