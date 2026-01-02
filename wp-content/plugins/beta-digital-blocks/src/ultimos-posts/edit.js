import { useBlockProps } from "@wordpress/block-editor";

export default function Edit() {
	return (
		<div {...useBlockProps()}>
			<p>Bloco de Últimos Posts – visualização apenas no site.</p>
		</div>
	);
}
