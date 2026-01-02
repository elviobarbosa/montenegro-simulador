import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	URLInput,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";

const TEMPLATE = [
	["core/paragraph", { placeholder: "Nome" }],
	["core/paragraph", { placeholder: "Depoimento" }],
	["core/image"],
];

export default function Edit({ attributes, setAttributes }) {
	const { videoUrl, backgroundColor } = attributes;

	const updateBackground = (key, value) => {
		setAttributes({ [key]: value });
	};

	return (
		<div {...useBlockProps()} style={{ backgroundColor }}>
			<InnerBlocks
				template={TEMPLATE}
				templateLock={false}
				allowedBlocks={["core/paragraph", "core/paragraph", "core/image"]}
			/>

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
				<PanelBody title="URL do vídeo">
					<URLInput
						label="URL"
						value={videoUrl}
						onChange={(url) => setAttributes({ videoUrl: url })}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
