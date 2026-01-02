import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	console.log(attributes);
	return (
		<div { ...blockProps }>
			<div className='is-layout-flex wp-container-3 wp-block-columns'>
				<div className="is-layout-flow wp-block-column">

					<h1 className='beta-digital__title'>
						<span className="text-wrapper">
							<span className="letters">{attributes.titleContent}</span>
						</span>
					</h1>

					<div className='subtitle'>
						<RichText.Content tagName="p"  className='beta-digital__subtitle' value={ attributes.subTitleContent } />

					</div>

				</div>
				<div className='is-layout-flow wp-block-column description' >
					<RichText.Content className='beta-digital__description' tagName="p" value={ attributes.descriptionContent } />
				</div>
			</div>
		</div>
	);
}
