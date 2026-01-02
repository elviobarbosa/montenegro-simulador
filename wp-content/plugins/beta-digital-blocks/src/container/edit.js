// edit.js
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
} from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const {
		maxWidth,
		height,
		paddingDesktop,
		paddingMobile,
		displayDesktop,
		displayMobile,
		flexDirectionDesktop,
		flexDirectionMobile,
		justifyContentDesktop,
		justifyContentMobile,
		alignItemsDesktop,
		alignItemsMobile,
	} = attributes;

	const blockProps = useBlockProps({
		className: "custom-container-block",
	});

	const style = {
		"--max-width": maxWidth || "1420px",
		"--height": height || "inherit",
		"--padding-desktop": paddingDesktop || "0 120x",
		"--padding-mobile": paddingMobile || "0 20px",
		"--display-desktop": displayDesktop || "block",
		"--display-mobile": displayMobile || "block",
		"--flex-direction-desktop": flexDirectionDesktop || "row",
		"--flex-direction-mobile": flexDirectionMobile || "column",
		"--justify-content-desktop": justifyContentDesktop || "flex-start",
		"--justify-content-mobile": justifyContentMobile || "flex-start",
		"--align-items-desktop": alignItemsDesktop || "stretch",
		"--align-items-mobile": alignItemsMobile || "stretch",
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Layout do Container" initialOpen>
					<TextControl
						label="Largura máxima"
						value={maxWidth}
						onChange={(value) => setAttributes({ maxWidth: value })}
						help="Ex: 1200px, 100%, 80rem"
					/>
					<TextControl
						label="Altura"
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						help="Ex: 1200px, 100%, 80rem"
					/>
					<TextControl
						label="Padding (Desktop)"
						value={paddingDesktop}
						onChange={(value) => setAttributes({ paddingDesktop: value })}
						help="Ex: 40px 20px"
					/>
					<TextControl
						label="Padding (Mobile)"
						value={paddingMobile}
						onChange={(value) => setAttributes({ paddingMobile: value })}
						help="Ex: 20px 10px"
					/>
				</PanelBody>

				<PanelBody title="Flexbox (Desktop)" initialOpen={false}>
					<SelectControl
						label="Display"
						value={displayDesktop}
						onChange={(value) => setAttributes({ displayDesktop: value })}
						options={[
							{ label: "Block", value: "block" },
							{ label: "Flex", value: "flex" },
						]}
					/>
					<SelectControl
						label="Flex Direction"
						value={flexDirectionDesktop}
						onChange={(value) => setAttributes({ flexDirectionDesktop: value })}
						options={[
							{ label: "Row", value: "row" },
							{ label: "Column", value: "column" },
						]}
					/>
					<SelectControl
						label="Justify Content"
						value={justifyContentDesktop}
						onChange={(value) =>
							setAttributes({ justifyContentDesktop: value })
						}
						options={[
							{ label: "Flex Start", value: "flex-start" },
							{ label: "Center", value: "center" },
							{ label: "Flex End", value: "flex-end" },
							{ label: "Space Between", value: "space-between" },
							{ label: "Space Around", value: "space-around" },
						]}
					/>
					<SelectControl
						label="Align Items"
						value={alignItemsDesktop}
						onChange={(value) => setAttributes({ alignItemsDesktop: value })}
						options={[
							{ label: "Stretch", value: "stretch" },
							{ label: "Center", value: "center" },
							{ label: "Flex Start", value: "flex-start" },
							{ label: "Flex End", value: "flex-end" },
							{ label: "Baseline", value: "baseline" },
						]}
					/>
				</PanelBody>

				<PanelBody title="Flexbox (Mobile)" initialOpen={false}>
					<SelectControl
						label="Display"
						value={displayMobile}
						onChange={(value) => setAttributes({ displayMobile: value })}
						options={[
							{ label: "Block", value: "block" },
							{ label: "Flex", value: "flex" },
						]}
					/>
					<SelectControl
						label="Flex Direction"
						value={flexDirectionMobile}
						onChange={(value) => setAttributes({ flexDirectionMobile: value })}
						options={[
							{ label: "Row", value: "row" },
							{ label: "Column", value: "column" },
						]}
					/>
					<SelectControl
						label="Justify Content"
						value={justifyContentMobile}
						onChange={(value) => setAttributes({ justifyContentMobile: value })}
						options={[
							{ label: "Flex Start", value: "flex-start" },
							{ label: "Center", value: "center" },
							{ label: "Flex End", value: "flex-end" },
							{ label: "Space Between", value: "space-between" },
							{ label: "Space Around", value: "space-around" },
						]}
					/>
					<SelectControl
						label="Align Items"
						value={alignItemsMobile}
						onChange={(value) => setAttributes({ alignItemsMobile: value })}
						options={[
							{ label: "Stretch", value: "stretch" },
							{ label: "Center", value: "center" },
							{ label: "Flex Start", value: "flex-start" },
							{ label: "Flex End", value: "flex-end" },
							{ label: "Baseline", value: "baseline" },
						]}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps} style={style}>
				<InnerBlocks />
			</div>
		</>
	);
}
