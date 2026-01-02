import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {
	const { ctaText, ctaUrl, textAlign, backgroundColor } = attributes;

	return (
		<div {...useBlockProps.save()} style={{ backgroundColor }}>
			<InnerBlocks.Content />
			{ctaText && ctaUrl && (
				<div className="card-block-button">
					<a href={ctaUrl} style={{ textAlign }}>
						{ctaText}
					</a>
				</div>
			)}
		</div>
	);
}
