import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const ALLOWED_BLOCKS = ["core/image"];

export default function Edit() {
	return (
		<div {...useBlockProps()}>
			<strong>Imagem Mobile</strong>
			<InnerBlocks
				allowedBlocks={["core/image"]}
				template={[["core/image"]]}
				templateLock={false}
			/>
		</div>
	);
}
