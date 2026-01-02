import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, MediaPlaceholder, useBlockProps, RichText, MediaReplaceFlow } from '@wordpress/block-editor';
import './editor.scss';
import { TextControl, Card, CardBody, CardMedia } from '@wordpress/components';


export default function Edit( { attributes, setAttributes } ) {
	const { withSelect } = wp.data;
	const GetTitle = props => <h1 className='beta-digital__title'>{props.title}</h1>;

	const selectTitle = withSelect(
		(select) => {
			attributes.titleContent = typeof select("core/editor").getPostEdits().title !== 'undefined' ? select("core/editor").getPostEdits().title : select("core/editor").getCurrentPost().title
			return {
				title: typeof select("core/editor").getPostEdits().title !== 'undefined' ? select("core/editor").getPostEdits().title : select("core/editor").getCurrentPost().title
			}
		}
	);

	let PostTitle = selectTitle(GetTitle);

	const onChangeSubTitle = ( newContent ) => {
		setAttributes( { subTitleContent: newContent } )
	}

	const onChangeContent = ( newContent ) => {
		setAttributes( { descriptionContent: newContent } )
	}
	return (
		<div { ...useBlockProps() }>
			<div className="is-layout-flex wp-container-11 wp-block-columns">
				<div className="is-layout-flow wp-block-column">
					<PostTitle/>
					<div className='subtittle'>
						<RichText
							{ ...useBlockProps }
							tagName="p"
							className='beta-digital__subtitle'
							onChange={ onChangeSubTitle }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
							value={ attributes.subTitleContent }
							placeholder={ __( 'Digite o subtítulo aqui...' ) }
						/>
					</div>
				</div>

				<div className='is-layout-flow wp-block-column description'>
					<RichText
						{ ...useBlockProps }
						tagName="p"
						className='beta-digital__description'
						onChange={ onChangeContent }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						value={ attributes.descriptionContent }
						placeholder={ __( 'Digite o texto aqui...' ) }
					/>
				</div>
			</div>

		</div>

	);
}
