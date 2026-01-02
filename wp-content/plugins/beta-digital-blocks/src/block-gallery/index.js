import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

// /**
//  * Block Name.
//  * Create an example Call to Action Block
//  * Uses InnerBlocks for editable content within.
//  */
// import metadata from './block.json';
// import { BLOCK_CONFIG } from './variations';
// export const blockName = 'block-call-to-action';

// wp.blocks.registerBlockVariation('core/cover', {
//     name: 'cover-variation',
//     title: 'Cover Variation',
// 	category: 'beta-digital-category',
//     icon: 'star-filled',
//     attributes: {
//         className: 'is-awesome',
//         align: 'full'
//     }
// });
// // Register the block via WP func. Change 'myplugin' to your plugin or theme.
// registerBlockType(`beta-digital/${blockName}`, {
// 	title: __('Call to Action', 'locale'), // Change 'locale' to your locale for internationalization.
// 	description: __(
// 		'Call to action block with headline and buttons',
// 		'locale'
// 	),

// 	category: 'beta-digital-category',
// 	supports: {
// 		anchor: true,
// 		defaultStylePicker: false,
// 		html: false,
// 		align: false,
// 	},
// 	attributes: {
// 		anchor: {
// 			type: 'string',
// 			default: '',
// 		},
// 	},
// 	transforms: {},
// 	variations: [],
// 	edit: (props) => {
// 		const blockProps = useBlockProps({
// 			className: `wp-block-myplugin-${blockName}`,
// 		});

// 		return (
// 			<div {...blockProps}>
// 				<div className="cta__inner">
// 					<div className="cta__inner-blocks-wrapper">
// 						<InnerBlocks
// 							template={BLOCK_CONFIG.CTA_TEMPLATE}
// 							allowedBlocks={BLOCK_CONFIG.ALLOWED_BLOCKS}
// 							renderAppender={false}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	},
// 	save: () => {
// 		return (
// 			<div>
// 				<div className="cta__inner">
// 					<InnerBlocks.Content />
// 				</div>
// 			</div>
// 		);
// 	},
// });

// import { registerBlockType } from '@wordpress/blocks';
// import './style.scss';


/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

// wp.blocks.registerBlockVariation(
// 	'core/gallery',
// 	{
// 		name: 'beta-digital-gallery-variation',
// 		title: 'Frame Style Gallery',
// 		icon: 'star-filled',
// 		isDefault: true,
// 		category: 'beta-digital-category'
// 	}
// );

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save: () => <InnerBlocks.Content />,
} );

