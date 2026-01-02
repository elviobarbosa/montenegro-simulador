import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, MediaPlaceholder, useBlockProps, RichText, MediaReplaceFlow } from '@wordpress/block-editor';
import './editor.scss';
import { TextControl, Card, CardBody, CardMedia } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const setImageAttributes = (media) => {
		if (!media || !media.url) {
			setAttributes({
				imageUrl: null,
				imageId: null,
				imageAlt: null,
			});
			return;
		}
		setAttributes({
			imageUrl: media.url,
			imageId: media.id,
			imageAlt: media?.alt,
		});
	};
	const onChangeContent = ( newContent ) => {
		setAttributes( { content: newContent } )
	}
	return (
		<div { ...useBlockProps() }>
			<RichText 
				{ ...useBlockProps }
				tagName="p"
				onChange={ onChangeContent }
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
				value={ attributes.content }
				placeholder={ __( 'Write your text...' ) }
			/>
			{ attributes.imageUrl ?
				<img src={attributes.imageUrl} alt={attributes.imageAlt} />
			:
				<MediaPlaceholder
					accept="image/*"
					allowedTypes={['image']}
					onSelect={setImageAttributes}
					multiple={false}
					handleUpload={true}
				/>
			}
			<BlockControls>
				<MediaReplaceFlow
					mediaId={attributes.imageId}
					mediaUrl={attributes.imageUrl}
					allowedTypes={['image']}
					accept="image/*"
					onSelect={setImageAttributes}
					name={!attributes.imageUrl ? __('Add Image') : __('Replace Image')}
				/>
			</BlockControls>
			
		</div>
		
	);
}
