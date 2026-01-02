import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Perguntas frequentes", "beta-digital-blocks"),
	description: __("Exibe perguntas frequentes", "beta-digital-blocks"),
	edit: Edit,
});
