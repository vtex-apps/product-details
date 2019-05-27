import thumbnailsPosition, {
  getThumbnailsPositionNames,
  getThumbnailsPositionValues,
} from './thumbnailPositionEnum'

export const schema = {
  title: 'admin/editor.product-details.title',
  description: 'admin/editor.product-details.description',
  type: 'object',
  widget: {
    'ui:options': {
      inline: false,
    },
    'ui:widget': 'radio',
  },
  definitions: {
    highlightsDefault: {
      title: 'highlightsDefault',
      type: 'object',
      properties: {
        showHighlights: {
          title: 'Show highlights',
          type: 'boolean',
          enum: [true, false],
          default: true,
        },
      },
      required: ['showHighlights'],
      dependencies: {
        showHighlights: {
          oneOf: [
            {
              properties: {
                showHighlights: {
                  enum: [true],
                },
                highlightGroupDefault: {
                  title: 'Person',
                  type: 'object',
                  properties: {
                    highlight: {
                      title: 'admin/editor.product-details.highlights.default',
                      type: 'string',
                      enum: [
                        'admin/editor.product-details.highlights.allSpecifications',
                        'admin/editor.product-details.highlights.chooseDefault',
                        'admin/editor.product-details.highlights.chooseDefaultSpecification',
                      ],
                      default:
                        'admin/editor.product-details.highlights.allSpecifications',
                    },
                  },
                  required: ['highlight'],
                  dependencies: {
                    highlight: {
                      oneOf: [
                        {
                          properties: {
                            highlight: {
                              enum: [
                                'admin/editor.product-details.highlights.allSpecifications',
                              ],
                            },
                          },
                        },
                        {
                          properties: {
                            highlight: {
                              enum: [
                                'admin/editor.product-details.highlights.chooseDefault',
                              ],
                            },
                            typeHighlight: {
                              type: 'string',
                              title:
                                'admin/editor.product-details.highlights.title',
                              description:
                                'admin/editor.product-details.product-specifications.typeHelper',
                            },
                          },
                          required: [''],
                        },
                        {
                          properties: {
                            highlight: {
                              enum: [
                                'admin/editor.product-details.highlights.chooseDefaultSpecification',
                              ],
                            },
                            typeSpecifications: {
                              type: 'string',
                              title:
                                'admin/editor.product-details.highlights.typeSpecifications.title',
                              description:
                                'admin/editor.product-details.product-specifications.typeHelper',
                            },
                          },
                          required: [''],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },

    specificationsDefault: {
      title: 'specificationsDefault',
      type: 'object',
      properties: {
        showSpecifications: {
          title: 'Show specifications',
          type: 'boolean',
          enum: [true, false],
          default: true,
        },
      },
      required: ['showSpecifications'],
      dependencies: {
        showSpecifications: {
          oneOf: [
            {
              properties: {
                showSpecifications: {
                  enum: [true],
                },
                specificationGroups: {
                  title: 'specificationGroups',
                  type: 'object',
                  properties: {
                    specification: {
                      title:
                        'admin/editor.product-details.product-specifications.default',
                      type: 'string',
                      enum: [
                        'admin/editor.product-details.product-specifications.allSpecifications',
                        'admin/editor.product-details.product-specifications.chooseDefaultSpecification',
                      ],
                      default:
                        'admin/editor.product-details.product-specifications.allSpecifications',
                    },
                  },
                  required: ['specification'],
                  dependencies: {
                    specification: {
                      oneOf: [
                        {
                          properties: {
                            specification: {
                              enum: [
                                'admin/editor.product-details.product-specifications.allSpecifications',
                              ],
                            },
                          },
                        },
                        {
                          properties: {
                            specification: {
                              enum: [
                                'admin/editor.product-details.product-specifications.chooseDefaultSpecification',
                              ],
                            },
                            typeSpecifications: {
                              type: 'string',
                              title:
                                'admin/editor.product-details.product-specifications.typeSpecifications.title',
                              description:
                                'admin/editor.product-details.product-specifications.typeHelper',
                            },
                          },
                          required: [''],
                        },
                      ],
                    },
                  },
                },
                viewMode: {
                  type: 'string',
                  title:
                    'admin/editor.product-specifications.displaySpecification.title',
                  enum: ['tab', 'table'],
                  enumNames: [
                    'admin/editor.product-specifications.displaySpecification.tabMode',
                    'admin/editor.product-specifications.displaySpecification.tableMode',
                  ],
                  default:
                    'admin/editor.product-specifications.displaySpecification.tabMode',
                  widget: {
                    'ui:options': {
                      inline: false,
                    },
                    'ui:widget': 'radio',
                  },
                },
              },
              required: [''],
            },
          ],
        },
      },
    },
  },

  properties: {
    highlightGroupDefault: {
      title: 'Conditional',
      $ref: '#/definitions/highlightsDefault',
    },
    specificationsDefault: {
      title: 'specification',
      $ref: '#/definitions/specificationsDefault',
    },
    thumbnailPosition: {
      title: 'admin/editor.product-details.thumbnailsPosition.title',
      type: 'string',
      enum: getThumbnailsPositionValues(),
      enumNames: getThumbnailsPositionNames(),
      default: thumbnailsPosition.DISPLAY_LEFT.value,
      isLayout: false,
    },
  },
}
