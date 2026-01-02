import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, BlockControls, MediaPlaceholder, useBlockProps, RichText, MediaReplaceFlow } from '@wordpress/block-editor';
//import './editor.scss';
import { TextControl, Card, CardBody, CardMedia } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const ALLOWED_BLOCKS = ['core/gallery'];
    const TEMPLATE = [
        ['core/gallery', {
            className: 'bd-block__gallery',
			align: 'full',
        }]];


	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                template={TEMPLATE}
            />

		</div>

	);
}

