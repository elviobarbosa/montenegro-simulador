import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<p>{attributes.content}</p>
			<div>
				<img src={attributes.imageUrl} alt={attributes.imageAlt} />
			</div>
		</div>
	);
}