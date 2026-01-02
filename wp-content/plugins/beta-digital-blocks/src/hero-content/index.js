import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Hero Content", "beta-digital-blocks"),
	description: __(
		"Bloco com imagem (desktop/mobile), texto e lista com ícones.",
		"beta-digital-blocks"
	),
	edit: Edit,
	save: Save,
});
