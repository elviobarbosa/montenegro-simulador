// save.js
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {
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

	const blockProps = useBlockProps.save({
		className: "custom-container-block",
		style: {
			"--max-width": maxWidth || "100%",
			"--height": height || "",
			"--padding-desktop": paddingDesktop || "0",
			"--padding-mobile": paddingMobile || "0",
			"--display-desktop": displayDesktop || "block",
			"--display-mobile": displayMobile || "block",
			"--flex-direction-desktop": flexDirectionDesktop || "row",
			"--flex-direction-mobile": flexDirectionMobile || "column",
			"--justify-content-desktop": justifyContentDesktop || "flex-start",
			"--justify-content-mobile": justifyContentMobile || "flex-start",
			"--align-items-desktop": alignItemsDesktop || "stretch",
			"--align-items-mobile": alignItemsMobile || "stretch",
		},
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}
