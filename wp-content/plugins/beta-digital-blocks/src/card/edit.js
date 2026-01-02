import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	URLInput,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { TextControl, PanelBody } from "@wordpress/components";

const TEMPLATE = [
	["core/heading", { placeholder: "Título do bloco" }],
	["core/paragraph", { placeholder: "Subtítulo ou descrição" }],
	["core/image"],
];

export default function Edit({ attributes, setAttributes }) {
	const { ctaText, ctaUrl, backgroundColor } = attributes;

	const updateBackground = (key, value) => {
		setAttributes({ [key]: value });
	};

	return (
		<div {...useBlockProps()} style={{ backgroundColor }}>
			<InnerBlocks
				template={TEMPLATE}
				templateLock={false}
				allowedBlocks={["core/heading", "core/paragraph", "core/image"]}
			/>

			{ctaText && (
				<p>
					<a className="card-block-button" href={ctaUrl}>
						<span>{ctaText}</span>
					</a>
				</p>
			)}
			<InspectorControls>
				<PanelColorSettings
					title={__("Cor de Fundo do card", "beta-digital-blocks")}
					initialOpen={false}
					colorSettings={[
						{
							value: backgroundColor,
							onChange: (color) => updateBackground("backgroundColor", color),
							label: __("Cor de Fundo", "beta-digital-blocks"),
						},
					]}
				/>
				<PanelBody title="Call to Action">
					<TextControl
						label="Texto do botão"
						value={ctaText}
						onChange={(val) => setAttributes({ ctaText: val })}
					/>
					<URLInput
						label="URL"
						value={ctaUrl}
						onChange={(url) => setAttributes({ ctaUrl: url })}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
