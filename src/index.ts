import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const artboardsAllowedSizes: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const allowExceedingHeight: boolean = utils.getOption('allowExceedingHeight')
    const rawSizes: string[] = utils.getOption('sizes')
    const sizes = rawSizes.map((val): { width: number; height: number } => {
      const raw = val.split('x').map((str: string) => parseFloat(str))
      if (raw.length !== 2) throw new Error(`Invalid size '${raw}''`)
      return { width: raw[0], height: raw[1] }
    })

    for (const artboard of utils.objects.artboard) {
      const { width, height } = artboard.frame
      const sizesMatchingWidth = sizes.filter((s) => s.width === width)
      const matchesHeight = sizesMatchingWidth.findIndex((s) =>
        allowExceedingHeight ? height >= s.height : height === s.height,
      )

      if (matchesHeight !== -1) continue

      utils.report(`${width}×${height} is not an allowed size`, artboard)
    }
  },
  name: 'appibilities/artboards-allowed-sizes',
  title: 'Artboards should use one of the allowed sizes',
  description:
    'For more realistic user interface designs it can be helpful to use a predefined list of view sizes',
  getOptions: (helpers) => [
    helpers.stringArrayOption({
      name: 'sizes',
      title: 'Allowed sizes',
      description: `Artboard sizes that are allowed, for example 375x812. Portrait and landscape formats must be defined separately`,
      minLength: 1,
    }),
    helpers.booleanOption({
      name: 'allowExceedingHeight',
      title: 'Allow exceeding height',
      description:
        'Artboards exceeding the allowed artboard height may be allowed for scrollable content',
      defaultValue: false,
    }),
  ],
}

const interactiveElementMinSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const minSize: number = utils.getOption('minSize')

    for (const element of utils.objects.anyLayer) {
      if (!element.flow) continue
      const { width, height } = element.frame
      if (width >= minSize && height >= minSize) continue

      utils.report(
        `Interactive element has a size of ${width}×${height} (minimum should be ${minSize}×${minSize})`,
        element,
      )
    }
  },
  name: 'appibilities/interactive-element-min-size',
  title: (config) =>
    `Interactive elements should have a minimum size of ${config.minSize}×${config.minSize}`,
  description: 'Small tap areas can cause frustration for people using your app',
  getOptions: (helpers) => [
    helpers.numberOption({
      name: 'minSize',
      title: 'Minimum size',
      description: `An interactive element's width and height must both be at least the minimum size`,
      minimum: 1,
    }),
  ],
}

const symbolsMinSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const minSize: number = utils.getOption('minSize')
    const namePattern: string = utils.getOption('namePattern')

    for (const instance of utils.objects.symbolInstance) {
      if (!instance.name.toLowerCase().match(namePattern)) continue

      const { width, height } = instance.frame
      if (width >= minSize && height >= minSize) continue

      utils.report(
        `Symbol instance has a size of ${width}x${height} (minimum should be ${minSize}×${minSize})`,
        instance,
      )
    }
  },
  name: 'appibilities/symbols-min-size',
  title: (config) =>
    `Symbol instances should have a minimum size of ${config.minSize}×${config.minSize}`,
  description: 'Small tap areas can cause frustration for people using your app',
  getOptions: (helpers) => [
    helpers.numberOption({
      name: 'minSize',
      title: 'Minimum size',
      description: `A tappable area's width and height must both be at least the minimum size`,
      minimum: 1,
    }),
    helpers.stringOption({
      name: 'namePattern',
      title: 'Layer name pattern',
      description: 'Name pattern to match symbol instance layers',
    }),
  ],
}

const includesEllipsis: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    for (const layer of utils.objects.text) {
      var value = layer.attributedString.string
      if (value.includes('…') || value.includes('. . .') || value.includes('...')) {
        utils.report(
          `Text Layer is using ellipsis (…). Make sure users can access a detail view to see the rest of the content`,
          layer,
        )
      }
    }
  },
  name: 'ios-accessibility-assistant/includes-ellipsis',
  title: () => `Possible incorrect use of ellipsis (…)`,
  description: () => `Reports a violation when text layer might be using ellipsis incorrectly`,
}

const fontWeightsAllowed: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    const fontWeights: string[] = utils.getOption('pattern')
    for (const layer of utils.objects.text) {
      var fontname =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringFontAttribute.attributes.name ||
        'fontname'
      var fontweight = fontname.split('-')[1]
      if (!(fontWeights.indexOf(fontweight) > -1)) {
        utils.report(
          `Text Layer is using “${fontweight}”. The only allowed weights are ”${fontWeights.join(
            ', ',
          )}”`,
          layer,
        )
      }
    }
  },
  name: 'ios-accessibility-assistant/font-weights-allowed',
  title: () => `Incorrect use of font weights`,
  description: (config) =>
    `Reports a violation when text layer is using a non-acceptable weight (”${config.pattern
      ?.toString()
      .trim()}”)`,
}

const sfDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const pattern = utils.getOption('pattern')
    if (typeof pattern !== 'string') throw Error()

    for (const layer of utils.objects.text) {
      const SFFontFamily = 'San Francisco'
      const SFFontFamilyShorthand = 'SF'
      var fontsize =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringFontAttribute.attributes.size ||
        0
      var fontname =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringFontAttribute.attributes.name ||
        'fontname'

      if (fontname.includes(SFFontFamilyShorthand)) {
        // Check Font size - Font family for SF
        if (fontsize < 20) {
          if (!fontname.includes('Text')) {
            utils.report(
              `Text Layers using “${SFFontFamily}” should be set as "Text" at size ${fontsize} (or when smaller than 20 points). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }
        if (fontsize >= 20) {
          if (!fontname.includes('Display')) {
            utils.report(
              `Text Layers using “${SFFontFamily}” should be set as "Display" at size ${fontsize} (or when 20 points or larger). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }
      }
    }
  },
  name: 'ios-accessibility-assistant/sf-disallow',
  title: (config) => `Incorrect use of ${config.pattern} font`,
  description: (config) =>
    `Reports a violation when text layers contain an incorrect use of ${config.pattern} font`,
}

const nyDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const pattern = utils.getOption('pattern')
    if (typeof pattern !== 'string') throw Error()

    for (const layer of utils.objects.text) {
      // New York(NY) - Small for text that’s smaller than 20 points, Medium for text between 20 and 35 points, large for text between 36 and 53 points, and Extra Large for text that’s 54 points or larger
      const NYFontFamily = 'New York'

      var fontsize =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringFontAttribute.attributes.size ||
        0
      var fontname =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringFontAttribute.attributes.name ||
        'fontname'

      if (fontname.includes('NewYork')) {
        if (fontsize < 20) {
          if (!fontname.includes('Small')) {
            utils.report(
              `Text Layers using ${fontname} “${NYFontFamily}” should be set as "Regular" at size ${fontsize} (or when smaller than 20 points). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }

        if (fontsize >= 20 && fontsize <= 35) {
          // Technically, this should be 'Medium', but macOS reports it as 'Regular'
          // if (!fontname.includes('Medium')) {
          if (!fontname.includes('Regular')) {
            utils.report(
              `Text Layers using “${NYFontFamily}” should be set as "Medium" at size ${fontsize} (or when between 20 and 35 points). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }

        if (fontsize >= 36 && fontsize <= 53) {
          if (!fontname.includes('Large')) {
            utils.report(
              `Text Layers using “${NYFontFamily}” should be set as "Large" at size ${fontsize} (or when between 36 and 53 points). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }

        if (fontsize >= 54) {
          if (!fontname.includes('ExtraLarge')) {
            utils.report(
              `Text Layers using “${NYFontFamily}” should be set as "Extra Large" at size ${fontsize} (or when between 36 and 53 points). Currently using “${
                fontname.split('-')[0]
              }”`,
              layer,
            )
          }
        }
      }
    }
  },
  name: 'ios-accessibility-assistant/ny-disallow',
  title: (config) => `Incorrect use of ${config.pattern} font`,
  description: (config) =>
    `Reports a violation when text layers contain an incorrect use of ${config.pattern} font`,
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'appibilities',
    rules: [
      artboardsAllowedSizes,
      symbolsMinSize,
      interactiveElementMinSize,
      sfDisallow,
      nyDisallow,
      fontWeightsAllowed,
      includesEllipsis,
    ],
    config: {
      rules: {
        [artboardsAllowedSizes.name]: {
          active: true,
          ruleTitle: 'Artboards should match any iPhone or iPad display or be taller',
          sizes: [
            // Apple Watch
            '136x170',
            '170x136',
            '156x195',
            '195x156',
            '162x197',
            '197x162',
            '184x224',
            '224x184',
            '176x215',
            '215x176',
            '198x242',
            '242x198',
            // Apple TV
            '1920x1080',
            '1080x1920',
            // Apple Touch Bar
            '1085x30',
            // iPhone
            '375x667',
            '667x375',
            '375x812',
            '812x375',
            '414x896',
            '896x414',
            '390x844',
            '844x390',
            '428x926',
            '926x428',
            // iPad
            '768x1024',
            '1024x768',
            '744x1133',
            '1133x744',
            '810x1080',
            '1080x810',
            '834x1112',
            '1112x834',
            '820x1180',
            '1180x820',
            '1024x1366',
            '1366x1024',
          ],
          allowExceedingHeight: true,
        },
        [interactiveElementMinSize.name]: {
          active: true,
          minSize: 44,
        },
        [symbolsMinSize.name]: {
          active: true,
          ruleTitle: 'Buttons should have a minimum size of 44x44',
          minSize: 44,
          namePattern: '.*(action|button|btn|cta|icon|link).*',
        },
        [fontWeightsAllowed.name]: {
          active: true,
          pattern: ['Regular', 'Medium', 'Semibold', 'Bold'],
        },
        [includesEllipsis.name]: {
          active: true,
        },
        [sfDisallow.name]: {
          active: true,
          pattern: 'San Francisco',
        },
        [nyDisallow.name]: {
          active: true,
          pattern: 'New York',
        },
      },
    },
  }
}

export default assistant
