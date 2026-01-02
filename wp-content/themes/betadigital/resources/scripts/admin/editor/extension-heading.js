import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";
import { createElement } from "@wordpress/element";

wp.hooks.addFilter(
  "editor.BlockEdit",
  "beta-digital-blocks/heading-custom-controls",
  wp.compose.createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      if (props.name !== "core/heading") {
        return wp.element.createElement(BlockEdit, props);
      }

      const { attributes, setAttributes } = props;
      const { textAlignMobile, textAlignDesktop } = attributes;

      return wp.element.createElement(
        wp.element.Fragment,
        null,
        wp.element.createElement(BlockEdit, props),
        wp.element.createElement(
          wp.blockEditor.InspectorControls,
          null,
          wp.element.createElement(
            wp.components.PanelBody,
            { title: "Mobile", initialOpen: false },
            wp.element.createElement(wp.components.SelectControl, {
              label: "Alinhamento",
              value: textAlignMobile,
              options: [
                { label: "Esquerda", value: "left" },
                { label: "Centro", value: "center" },
                { label: "Direita", value: "right" },
              ],
              onChange: (value) => setAttributes({ textAlignMobile: value }),
            })
          )
        )
      );
    };
  }, "withCustomControls")
);

wp.hooks.addFilter(
  "blocks.getSaveElement",
  "beta-digital-blocks/heading-save-element",
  (element, blockType, attributes) => {
    if (blockType.name !== "core/heading") {
      return element;
    }

    const { textAlignMobile, textAlignDesktop } = attributes;

    if (textAlignMobile || textAlignDesktop) {
      const customClasses = [];

      if (textAlignMobile && textAlignMobile !== "left") {
        customClasses.push(`mobile-align-${textAlignMobile}`);
      }

      if (customClasses.length > 0) {
        const existingClasses = element.props.className || "";
        const newClasses = customClasses.filter(
          (cls) => !existingClasses.includes(cls)
        );

        if (newClasses.length > 0) {
          return wp.element.cloneElement(element, {
            className: `${existingClasses} ${newClasses.join(" ")}`.trim(),
          });
        }
      }
    }

    return element;
  }
);

wp.hooks.addFilter(
  "editor.BlockListBlock",
  "beta-digital-blocks/heading-editor-classes",
  wp.compose.createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
      if (props.name !== "core/heading") {
        return wp.element.createElement(BlockListBlock, props);
      }

      const { textAlignMobile, textAlignDesktop } = props.attributes;

      if (textAlignMobile || textAlignDesktop) {
        const customClasses = [];

        if (textAlignMobile && textAlignMobile !== "left") {
          customClasses.push(`mobile-align-${textAlignMobile}`);
        }

        if (customClasses.length > 0) {
          const existingClasses = props.className || "";
          const newClasses = customClasses.filter(
            (cls) => !existingClasses.includes(cls)
          );

          if (newClasses.length > 0) {
            props = {
              ...props,
              className: `${existingClasses} ${newClasses.join(" ")}`.trim(),
            };
          }
        }
      }

      return wp.element.createElement(BlockListBlock, props);
    };
  }, "withResponsiveAlignment")
);
