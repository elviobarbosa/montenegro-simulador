import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Slider } from './slider';
import metadata from './block.json';
import './editor.scss';
const { Placeholder, PanelBody, RangeControl } = wp.components;

export default function Edit( { attributes, setAttributes } ) {

	Slider( useBlockProps );

	return (
		<div { ...useBlockProps() }>
			<div className={useBlockProps.className}>
				<InspectorControls>
					<PanelBody
						title={__('Slider Settings', metadata.textdomain)}
						initialOpen={true}
					>
						<RangeControl
							label={__('Number of slides', metadata.textdomain)}
							value={attributes.numSlides}
							onChange={(val) => setAttributes({ numSlides: val })}
							min={1}
							max={10}
						/>
					</PanelBody>
				</InspectorControls>
			</div>
		</div>

	);
}
