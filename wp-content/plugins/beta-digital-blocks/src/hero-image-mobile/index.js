import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Hero Content Image Mobile", "beta-digital-blocks"),
	description: __("Bloco com imagem (desktop/mobile)", "beta-digital-blocks"),
	edit: Edit,
	save: Save,
});
