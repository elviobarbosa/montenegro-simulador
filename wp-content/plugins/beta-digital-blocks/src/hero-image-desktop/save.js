import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save() {
	return (
		<div {...useBlockProps.save()} className="hero-image-desktop-wrapper">
			<InnerBlocks.Content />
		</div>
	);
}
