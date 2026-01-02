import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	PanelColorSettings,
	AlignmentToolbar,
	BlockControls,
} from "@wordpress/block-editor";
import { PanelBody, Button, Flex } from "@wordpress/components";
import { useState } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
	const { slides } = attributes;
	const [activeSlide, setActiveSlide] = useState(0);

	const blockProps = useBlockProps();

	const updateSlide = (index, field, value) => {
		const updatedSlides = [...slides];
		updatedSlides[index] = {
			...updatedSlides[index],
			[field]: value,
		};
		setAttributes({ slides: updatedSlides });
	};

	const updateImage = (index, media) => {
		updateSlide(index, "image", {
			url: media.url,
			alt: media.alt,
			id: media.id,
		});
	};

	const addSlide = () => {
		const newSlide = {
			id: Date.now(),
			title: "Digite um título",
			linkText: "",
			linkUrl: "",
			image: { url: "", alt: "", id: 0 },
			backgroundColor: "var(--wp--preset--color--primary-color)",
		};
		setAttributes({ slides: [...slides, newSlide] });
		setActiveSlide(slides.length);
	};

	const removeSlide = (index) => {
		if (slides.length > 1) {
			const updated = slides.filter((_, i) => i !== index);
			setAttributes({ slides: updated });
			setActiveSlide(Math.max(0, index - 1));
		}
	};

	const moveSlide = (fromIndex, toIndex) => {
		if (toIndex < 0 || toIndex >= slides.length) return;
		const newSlides = [...slides];
		const [moved] = newSlides.splice(fromIndex, 1);
		newSlides.splice(toIndex, 0, moved);
		setAttributes({ slides: newSlides });
		setActiveSlide(toIndex);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Gerenciar Slides", "beta-digital-blocks")}>
					{slides.map((slide, index) => (
						<Button
							key={slide.id}
							variant={index === activeSlide ? "primary" : "tertiary"}
							onClick={() => setActiveSlide(index)}
							style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
						>
							{__("Slide", "beta-digital-blocks")} {index + 1}
						</Button>
					))}

					<Flex gap="8px" justify="flex-start">
						<Button
							icon="arrow-left-alt2"
							label={__("Mover slide", "beta-digital-blocks")}
							disabled={activeSlide === 0}
							onClick={() => moveSlide(activeSlide, activeSlide - 1)}
						/>
						<Button
							icon="arrow-right-alt2"
							label={__("Mover slide", "beta-digital-blocks")}
							disabled={activeSlide === slides.length - 1}
							onClick={() => moveSlide(activeSlide, activeSlide + 1)}
						/>
					</Flex>

					<Button variant="secondary" onClick={addSlide}>
						{__("Adicionar Slide", "beta-digital-blocks")}
					</Button>
					<br />

					<Button
						variant="tertiary"
						isDestructive
						onClick={() => removeSlide(activeSlide)}
						style={{ marginTop: "1rem" }}
					>
						{__("Remover Slide", "beta-digital-blocks")}
					</Button>
				</PanelBody>

				{slides[activeSlide] && (
					<>
						<PanelColorSettings
							title={__("Cor de Fundo do Slide", "beta-digital-blocks")}
							initialOpen={false}
							colorSettings={[
								{
									value: slides[activeSlide].backgroundColor,
									onChange: (color) =>
										updateSlide(activeSlide, "backgroundColor", color),
									label: __("Cor de Fundo", "beta-digital-blocks"),
								},
							]}
						/>

						<PanelBody
							title={__("Imagem do Slide", "beta-digital-blocks")}
							initialOpen={false}
						>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => updateImage(activeSlide, media)}
									allowedTypes={["image"]}
									value={slides[activeSlide].image.id}
									render={({ open }) => (
										<Button onClick={open} variant="secondary">
											{slides[activeSlide].image.url
												? __("Alterar Imagem", "beta-digital-blocks")
												: __("Selecionar Imagem", "beta-digital-blocks")}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							{slides[activeSlide].image.url && (
								<Button
									variant="tertiary"
									isDestructive
									onClick={() =>
										updateSlide(activeSlide, "image", {
											url: "",
											alt: "",
											id: 0,
										})
									}
								>
									{__("Remover Imagem", "beta-digital-blocks")}
								</Button>
							)}
						</PanelBody>

						<PanelBody
							title={__("Título e Link", "beta-digital-blocks")}
							initialOpen={true}
						>
							<RichText
								tagName="h2"
								value={slides[activeSlide].title}
								onChange={(value) => updateSlide(activeSlide, "title", value)}
								placeholder={__("Digite o título...", "beta-digital-blocks")}
							/>
						</PanelBody>
					</>
				)}
			</InspectorControls>

			<BlockControls>
				<AlignmentToolbar
					value={slides[activeSlide].imageAlignment}
					onChange={(value) =>
						updateSlide(activeSlide, "imageAlignment", value || "center")
					}
				/>
			</BlockControls>

			<div {...blockProps}>
				{slides[activeSlide] && (
					<div
						className="hero-slide-inner"
						style={{ backgroundColor: slides[activeSlide].backgroundColor }}
					>
						<div
							className={`hero-slide-image align-${slides[activeSlide].imageAlignment}`}
						>
							{slides[activeSlide].image.url ? (
								<img
									src={slides[activeSlide].image.url}
									alt={slides[activeSlide].image.alt || ""}
								/>
							) : (
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => updateSlideImage(activeSlide, media)}
										allowedTypes={["image"]}
										value={slides[activeSlide].image?.id}
										render={({ open }) => (
											<div className="hero-image-placeholder" onClick={open}>
												<Button variant="primary" icon="format-image">
													{__("Adicionar Imagem", "beta-digital-blocks")}
												</Button>
											</div>
										)}
									/>
								</MediaUploadCheck>
							)}
						</div>
						<div className="hero-slide-content">
							<RichText
								tagName="h2"
								value={slides[activeSlide].title}
								onChange={(value) => updateSlide(activeSlide, "title", value)}
								placeholder={__("Digite o título...", "beta-digital-blocks")}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
