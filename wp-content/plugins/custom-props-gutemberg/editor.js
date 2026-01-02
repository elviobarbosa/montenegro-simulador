(function () {
  const { __ } = wp.i18n;
  const { addFilter } = wp.hooks;
  const { Fragment } = wp.element;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, ToggleControl, SelectControl } = wp.components;
  const { createHigherOrderComponent } = wp.compose;

  // Aguarda as customizações serem carregadas
  wp.domReady(() => {
    if (!window.blockCustomizations) {
      console.warn("Block customizations not loaded");
      return;
    }

    const customizations = window.blockCustomizations.customizations;

    /**
     * Adiciona atributos aos blocos baseado nas configurações
     */
    function addCustomAttributes(settings, name) {
      if (!customizations[name]) {
        return settings;
      }

      const blockCustomizations = customizations[name];
      const newAttributes = {};

      Object.keys(blockCustomizations).forEach((key) => {
        const config = blockCustomizations[key];
        newAttributes[key] = {
          type: config.type,
          default: config.default,
        };
      });

      return {
        ...settings,
        attributes: {
          ...settings.attributes,
          ...newAttributes,
        },
      };
    }

    /**
     * Cria controle baseado no tipo
     */
    function createControl(key, config, attributes, setAttributes) {
      const commonProps = {
        label: __(config.label, "block-customization"),
        value: attributes[key],
        onChange: (value) => setAttributes({ [key]: value }),
      };

      switch (config.control) {
        case "toggle":
          return wp.element.createElement(ToggleControl, {
            ...commonProps,
            help: attributes[key]
              ? __(config.help.checked, "block-customization")
              : __(config.help.unchecked, "block-customization"),
            checked: attributes[key],
          });

        case "select":
          return wp.element.createElement(SelectControl, {
            ...commonProps,
            help: __(config.help, "block-customization"),
            options: Object.keys(config.options).map((optionKey) => ({
              label: __(config.options[optionKey], "block-customization"),
              value: optionKey,
            })),
          });

        default:
          return null;
      }
    }

    /**
     * Adiciona controles no painel lateral do editor
     */
    const withCustomizationControls = createHigherOrderComponent(
      (BlockEdit) => {
        return (props) => {
          if (!customizations[props.name]) {
            return wp.element.createElement(BlockEdit, props);
          }

          const { attributes, setAttributes } = props;
          const blockCustomizations = customizations[props.name];

          // Cria os controles
          const controls = Object.keys(blockCustomizations)
            .map((key) => {
              const config = blockCustomizations[key];
              return createControl(key, config, attributes, setAttributes);
            })
            .filter((control) => control !== null);

          if (controls.length === 0) {
            return wp.element.createElement(BlockEdit, props);
          }

          return wp.element.createElement(
            Fragment,
            {},
            wp.element.createElement(BlockEdit, props),
            wp.element.createElement(
              InspectorControls,
              {},
              wp.element.createElement(
                PanelBody,
                {
                  title: __("Customizações Mobile", "block-customization"),
                  initialOpen: false,
                },
                ...controls
              )
            )
          );
        };
      },
      "withCustomizationControls"
    );

    /**
     * Adiciona classes CSS baseado nos atributos
     */
    function addCustomizationClasses(extraProps, blockType, attributes) {
      if (!customizations[blockType.name]) {
        return extraProps;
      }

      const blockCustomizations = customizations[blockType.name];
      let additionalClasses = [];

      Object.keys(blockCustomizations).forEach((key) => {
        const config = blockCustomizations[key];
        const value = attributes[key];

        if (config.css_class && value === true) {
          // Para toggles boolean
          additionalClasses.push(config.css_class);
        } else if (config.css_class_prefix && value && value !== "default") {
          // Para selects com prefixo
          additionalClasses.push(config.css_class_prefix + value);
        }
      });

      if (additionalClasses.length > 0) {
        return {
          ...extraProps,
          className: `${extraProps.className || ""} ${additionalClasses.join(
            " "
          )}`.trim(),
        };
      }

      return extraProps;
    }

    // Registra os filtros
    addFilter(
      "blocks.registerBlockType",
      "block-customization/add-attributes",
      addCustomAttributes
    );

    addFilter(
      "editor.BlockEdit",
      "block-customization/add-controls",
      withCustomizationControls
    );

    addFilter(
      "blocks.getSaveContent.extraProps",
      "block-customization/add-classes",
      addCustomizationClasses
    );
  });
})();
