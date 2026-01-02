import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Hero Slider", "beta-digital-blocks"),
	description: __(
		"Slider de múltiplos slides hero com imagem e texto",
		"beta-digital-blocks"
	),
	edit: Edit,
	save: Save,
});
