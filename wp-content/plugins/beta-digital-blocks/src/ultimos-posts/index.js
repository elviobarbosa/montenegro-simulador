import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Últimos posts", "beta-digital-blocks"),
	description: __("Exibe os últimos posts do usuário", "beta-digital-blocks"),
	edit: Edit,
});
