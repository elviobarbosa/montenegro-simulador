import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";
import { stripTags } from "@wordpress/html-entities";

export default function save({ attributes }) {
	const {
		imageDesktop,
		imageMobile,
		tagline,
		title,
		items,
		button,
		invertLayout,
	} = attributes;

	const layoutClass = invertLayout ? "invert-layout" : "";
	const buttonText = button?.text || "";
	const buttonUrl = button?.url || "";
	const buttonStyle = button?.style || "primary";
	const buttonTarget = button?.target || "_self";
	const cleanTitle = attributes.title?.replace(/<[^>]+>/g, "") || "";

	return (
		<div
			{...useBlockProps.save()}
			className={`hero-content hero-content__block ${layoutClass}`}
		>
			<div className="hero-content__content">
				<RichText.Content
					tagName="p"
					className="hero-content__tagline"
					value={attributes.tagline}
				/>
				<RichText.Content
					tagName="h2"
					className="hero-content__title"
					value={attributes.title}
				/>
				<ul className="hero-content__items">
					{items.map((item, index) => (
						<li key={index} className="hero-content__item">
							{item.icon && (
								<img
									src={item.icon}
									alt={item.iconAlt || ""}
									title={item.iconTitle || ""}
									className="hero-icon"
								/>
							)}
							<RichText.Content tagName="span" value={item.text} />
						</li>
					))}
				</ul>
				{buttonText && buttonUrl && (
					<a
						className={`button button--${buttonStyle}`}
						href={buttonUrl}
						alt={`Veja mais sobre ${cleanTitle}`}
						target={buttonTarget}
						rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
					>
						<RichText.Content tagName="span" value={buttonText} />
					</a>
				)}
			</div>

			<div className="image">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
