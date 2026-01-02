import {
	useBlockProps,
	MediaUpload,
	InnerBlocks,
	RichText,
	InspectorControls,
} from "@wordpress/block-editor";

import {
	Button,
	ToggleControl,
	PanelBody,
	TextControl,
} from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import ButtonSettings from "../components/button";

const ALLOWED_BLOCKS = ["core/image"];

export default function Edit({ attributes, setAttributes }) {
	const {
		imageDesktop,
		imageMobile,
		tagline,
		title,
		items,
		button,
		invertLayout,
	} = attributes;

	const onChangeItem = (index, key, value) => {
		const newItems = [...items];
		newItems[index][key] = value;
		setAttributes({ items: newItems });
	};

	const setButtonAttribute = (newButton) => {
		setAttributes({ button: newButton });
	};

	return (
		<div {...useBlockProps()}>
			<div>
				<div className="hero-content__content">
					<RichText
						tagName="p"
						className="tagline"
						value={attributes.tagline}
						onChange={(value) => setAttributes({ tagline: value })}
						placeholder="Digite a tagline..."
					/>

					<RichText
						tagName="h2"
						value={attributes.title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder="Título"
					/>

					<div className="list-items">
						{items.map((item, index) => (
							<Fragment key={index}>
								<div className="hero-content__edit-item-container">
									<div className="hero-content__edit-icon">
										{item.icon && (
											<img
												src={item.icon}
												alt={item.iconAlt || ""}
												title={item.iconTitle || ""}
											/>
										)}

										<MediaUpload
											onSelect={(media) => {
												const newItems = [...attributes.items];
												newItems[index] = {
													...newItems[index],
													icon: media.url,
													iconAlt: media.alt,
													iconTitle: media.title,
												};
												setAttributes({ items: newItems });
											}}
											allowedTypes={["image"]}
											render={({ open }) => (
												<Button onClick={open} className="button">
													{item.icon ? "Trocar ícone" : "Selecionar ícone"}
												</Button>
											)}
										/>
									</div>

									<RichText
										tagName="p"
										value={item.text}
										onChange={(value) => onChangeItem(index, "text", value)}
										placeholder="Texto do item"
									/>
								</div>
							</Fragment>
						))}
						<Button
							className="button"
							onClick={() =>
								setAttributes({
									items: [...items, { icon: "", text: "" }],
								})
							}
						>
							Adicionar item
						</Button>
					</div>
				</div>
				<br />
				<br />

				<a href={button.url || "#"} className="cta-button editor-cta-preview">
					<RichText
						tagName="span"
						value={button.text}
						onChange={(value) => setAttributes({ ...button, text: value })}
						placeholder="Texto do botão"
						allowedFormats={[]}
					/>
				</a>
			</div>
			<InnerBlocks
				template={[["custom/hero-image-desktop"], ["custom/hero-image-mobile"]]}
				templateLock="all"
			/>

			<InspectorControls>
				<PanelBody title="Layout" initialOpen={true}>
					<ToggleControl
						label="Inverter Layout no Desktop"
						checked={invertLayout}
						onChange={(value) => setAttributes({ invertLayout: value })}
					/>
				</PanelBody>
				<ButtonSettings button={button} setButton={setButtonAttribute} />
				{/* <PanelBody title="Configurações do botão" initialOpen={true}>
					<TextControl
						label="URL do botão"
						type="url"
						value={attributes.ctaUrl}
						onChange={(value) => setAttributes({ ctaUrl: value })}
						placeholder="https://exemplo.com"
					/>
				</PanelBody> */}
			</InspectorControls>
		</div>
	);
}
