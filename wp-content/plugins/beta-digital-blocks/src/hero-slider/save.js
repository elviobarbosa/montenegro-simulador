// save.js
import { useBlockProps, RichText } from "@wordpress/block-editor";

const swiperParams = {
	slidesPerView: "auto",
	spaceBetween: 30,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
};

export default function save({ attributes }) {
	const { slides } = attributes;

	const blockProps = useBlockProps.save({
		className: "hero-slider-block swiper",
		"data-params": JSON.stringify(swiperParams),
	});

	return (
		<div {...blockProps}>
			<div className="swiper-wrapper">
				{slides.map((slide, index) => (
					<div
						key={index}
						className="swiper-slide hero-slide has-background"
						style={{ backgroundColor: slide.backgroundColor }}
					>
						<div className="hero-slide-inner">
							<div className={`hero-slide-image align-${slide.imageAlignment}`}>
								{slide.image?.url && (
									<img src={slide.image.url} alt={slide.image.alt || ""} />
								)}
							</div>
							<div className="hero-slide-content">
								{<RichText.Content tagName="h2" value={slide.title} />}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="swiper-button-prev"></div>
			<div className="swiper-button-next"></div>
			<div className="swiper-pagination"></div>
		</div>
	);
}
