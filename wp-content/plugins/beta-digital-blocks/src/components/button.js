import { __ } from "@wordpress/i18n";
import {
	TextControl,
	SelectControl,
	ToggleControl,
	PanelBody,
} from "@wordpress/components";
import { URLInput } from "@wordpress/block-editor";

export default function ButtonSettings({ button, setButton }) {
	const safeButton = {
		text: "Comece já",
		url: "",
		style: "primary",
		target: "_self",
		icon: "",
		...button,
	};

	return (
		<PanelBody title="Configurações do botão" initialOpen={true}>
			<TextControl
				label="Texto"
				value={safeButton.text}
				onChange={(value) => setButton({ ...safeButton, text: value })}
			/>
			<URLInput
				label="URL"
				value={safeButton.url}
				onChange={(value) => setButton({ ...safeButton, url: value })}
			/>
			<SelectControl
				label="Estilo"
				value={safeButton.style}
				options={[
					{ label: "Primário", value: "primary" },
					{ label: "Secundário", value: "secondary" },
					{ label: "Terciário", value: "tertiary" },
				]}
				onChange={(value) => setButton({ ...safeButton, style: value })}
			/>
			<SelectControl
				label="Target"
				value={safeButton.target}
				options={[
					{ label: "Mesma janela", value: "_self" },
					{ label: "Nova janela", value: "_blank" },
				]}
				onChange={(value) => setButton({ ...safeButton, target: value })}
			/>
		</PanelBody>
	);
}
