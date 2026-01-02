import { useBlockProps } from "@wordpress/block-editor";

export default function Edit() {
	return (
		<div {...useBlockProps()}>
			<p>Bloco de FAQ – visualização apenas no front.</p>
		</div>
	);
}
