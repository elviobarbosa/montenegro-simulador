import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import { TextControl, Card, CardBody, CardMedia } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const ALLOWED_BLOCKS = ['core/columns', 'core/column', 'core/image', 'core/group'];
    const TEMPLATE = [
		[
			'core/group',
			{
				level: 2,
				className: 'block-social-media',
				lock: {
					move: true,
					remove: true
				},
			},
			[
				[
					'core/columns', {
						className: 'block-social-media__column',
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
	];


	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
            />

		</div>

	);
}

