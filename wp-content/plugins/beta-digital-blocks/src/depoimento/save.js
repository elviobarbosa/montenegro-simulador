import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import playButton from "./images/play-button.png";
import star from "./images/star.svg";

export default function Save({ attributes }) {
	const { videoUrl, textAlign, backgroundColor } = attributes;
	const defaultClass = "card-depoimento";
	const styles = videoUrl
		? `card-depoimento-video ${defaultClass}`
		: `card-depoimento-text ${defaultClass}`;

	return (
		<div {...useBlockProps.save()} style={{ backgroundColor }}>
			<div className={styles}>
				<div>
					<InnerBlocks.Content />
				</div>
				{videoUrl ? (
					<div className="card-depoimento-button">
						<a
							href={videoUrl}
							style={{ textAlign }}
							target="_blank"
							rel="nofollow"
							title="Assistir depoimento"
						>
							<img src={playButton} title="Assistir depoimento" />
						</a>
					</div>
				) : (
					<div className="star">
						{[...Array(5)].map((_, index) => (
							<img
								key={index}
								rel="shortcut icon"
								type="image/svg"
								src={star}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
