const BasicAAB = {
  primitive: {
    borderRadius: { none: '0', xs: '2px', sm: '4px', md: '6px', lg: '8px', xl: '12px' },
    gray: {
      0: '#FFFFFF', // (White)
      50: '#F3F3F3', // (N-50)
      90: '#E9E9E9', // (N-55)
      130: '#DEDEDE', // (N-65)
      370: '#A1A1A1', //
      490: '#828282', //
      510: '#7D7D7D', // (N-200)
      620: '#616161', // (N-400)
      780: '#383838', // (D-100)
      840: '#292929', // (D-400)
      870: '#222222', // (N-670)
      880: '#1E1E1E', // (D-800)
      930: '#121212', // (D-900)
    },
    teal: {
      DEFAULT: '#004C4C',
      450: '#61B8AB', // (DG-600)
      500: '#4FB0A1', // (DG-670)
      550: '#489F92', // (DG-500)

      850: '#004C4C', // (G-500)
      890: '#003737', // (G-600)
      920: '#002929', // (G-670)
    },
    yellow: {
      DEFAULT: '#FFD200',
      500: '#FFD200', // (Y-300)
      520: '#F3C000', // (Y-400)
      550: '#E5B400', // (Y-500)
      570: '#D9AA00', // (DY-500)
    },
    blue: {
      70: '#E3F0F7', // (I-50)
      350: '#5AB8F2', // (DI-500)
      660: '#005CDE', // (I-500)
      840: '#1B2C36', // (DI-50)
    },
    green: {
      70: '#E4F5EB', // (S-50)
      570: '#75B12B', // (DS-500)
      750: '#007F42', // (S-500)
      840: '#232E23', // (DS-50)
    },
    red: {
      60: '#FAE8E6', // (A-50)
      300: '#DF9186', // (DA-500)
      350: '#E0796B', // (DA-600)
      400: '#E45F4E', // (DA-700)
      620: '#C21700', // (A-500)
      750: '#B51500', // (A-600)
      770: '#A81400', // (A-700)
      840: '#341D1D', // (DA-50)
    },
    brand: {
      default: '{branding.default}',
      hover: '{branding.hover}',
      active: '{branding.active}',
    },
    // color.gray.opacity.0 '#FFFFFF', 75%
    // color.gray.opacity.50 '#F3F3F3', 75%
    // color.black.opacity.880 '#1E1E1E', 75%
    // color.black.opacity.930 '#121212', 75%
    // color.black.opacity.1000 '#000000',70%
  },
  semantic: {
    transitionDuration: '0.2s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: '1rem',
    anchorGutter: '2px',
    primary: {
      500: '{yellow.500}', // (Y-300)
      520: '{yellow.520}', // (Y-400)
      550: '{yellow.550}', // (Y-500)
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
    list: {
      padding: '0.25rem 0.25rem',
      gap: '2px',
      header: { padding: '0.5rem 1rem 0.25rem 1rem' },
      option: { padding: '0.5rem 0.75rem', borderRadius: '{border.radius.sm}' },
      optionGroup: { padding: '0.5rem 0.75rem', fontWeight: '600' },
    },
    content: { borderRadius: '{border.radius.md}' },
    mask: { transitionDuration: '0.15s' },
    navigation: {
      list: { padding: '0.25rem 0.25rem', gap: '2px' },
      item: { padding: '0.5rem 0.75rem', borderRadius: '{border.radius.sm}', gap: '0.5rem' },
      submenuLabel: { padding: '0.5rem 0.75rem', fontWeight: '600' },
      submenuIcon: { size: '0.875rem' },
    },
    overlay: {
      select: {
        borderRadius: '{border.radius.md}',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      popover: {
        borderRadius: '{border.radius.md}',
        padding: '0.75rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      modal: {
        borderRadius: '{border.radius.xl}',
        padding: '1.25rem',
        shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      navigation: {
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
    colorScheme: {
      light: {
        branding: {
          default: '{teal.850}',
          hover: '{teal.890}',
          active: '{teal.920}',
        },
        system: {
          info: '{blue.660}',
          sucess: '{green.750}',
          alert: '{red.620}',
          pending: '{gray.620}',
          warning: '{yellow.570}', // Not emerald
        },
        surface: {
          0: '{gray.0}', // (White)
          50: '{gray.50}', // (N-50)
          90: '{gray.90}', // (N-55)
          130: '{gray.130}', // (N-65)
          370: '{gray.370}', //
          490: '{gray.490}', //
          510: '{gray.510}', // (N-200)
          620: '{gray.620}', // (N-400)
          780: '{gray.780}', // (D-100)
          840: '{gray.840}', // (D-400)
          870: '{gray.870}', // (N-670)
          880: '{gray.880}', // (D-800)
          930: '{gray.930}', // (D-900)
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.520}',
          activeColor: '{primary.550}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        mask: { background: 'rgba(0,0,0,0.4)', color: '{surface.200}' },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{surface.700}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          floatLabelColor: '{surface.500}',
          floatLabelFocusColor: '{surface.500}',
          floatLabelInvalidColor: '{red.400}',
          iconColor: '{surface.400}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
        },
        text: {
          color: '{surface.870}',
          hoverColor: '{surface.620}',
          mutedColor: '{surface.620}',
          hoverMutedColor: '{surface.620}',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}',
          },
        },
        list: {
          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: { color: '{surface.400}', focusColor: '{surface.500}' },
          },
          optionGroup: { background: 'transparent', color: '{text.muted.color}' },
        },
        navigation: {
          item: {
            focusBackground: '{surface.100}',
            activeBackground: '{surface.100}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: { background: 'transparent', color: '{text.muted.color}' },
          submenuIcon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}',
          },
        },
      },
      dark: {
        branding: {
          default: '{teal.550}',
          hover: '{teal.500}',
          active: '{teal.450}',
        },
        system: {
          info: '{blue.350}',
          sucess: '{green.570}',
          alert: '{red.400}',
          pending: '{gray.370}',
          warning: '{yellow.500}', // Not emerald
        },
        surface: {
          0: '{gray.0}', // (White)
          50: '{gray.50}', // (N-50)
          90: '{gray.90}', // (N-55)
          130: '{gray.130}', // (N-65)
          370: '{gray.370}', //
          490: '{gray.490}', //
          510: '{gray.510}', // (N-200)
          620: '{gray.620}', // (N-400)
          780: '{gray.780}', // (D-100)
          840: '{gray.840}', // (D-400)
          870: '{gray.870}', // (N-670)
          880: '{gray.880}', // (D-800)
          930: '{gray.930}', // (D-900)
        },
        primary: {
          color: '{primary.550}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.520}',
          activeColor: '{primary.500}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        mask: { background: 'rgba(0,0,0,0.6)', color: '{surface.200}' },
        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.700}',
          filledBackground: '{surface.800}',
          filledFocusBackground: '{surface.800}',
          borderColor: '{surface.700}',
          hoverBorderColor: '{surface.600}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.300}',
          color: '{surface.0}',
          disabledColor: '{surface.400}',
          placeholderColor: '{surface.400}',
          floatLabelColor: '{surface.400}',
          floatLabelFocusColor: '{surface.400}',
          floatLabelInvalidColor: '{red.300}',
          iconColor: '{surface.400}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
        },
        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.400}',
          hoverMutedColor: '{surface.300}',
        },
        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.800}',
          borderColor: '{surface.700}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
        },
        list: {
          option: {
            focusBackground: '{surface.800}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focus.color}',
            icon: { color: '{surface.500}', focusColor: '{surface.400}' },
          },
          optionGroup: { background: 'transparent', color: '{text.muted.color}' },
        },
        navigation: {
          item: {
            focusBackground: '{surface.800}',
            activeBackground: '{surface.800}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
              activeColor: '{surface.400}',
            },
          },
          submenuLabel: { background: 'transparent', color: '{text.muted.color}' },
          submenuIcon: {
            color: '{surface.500}',
            focusColor: '{surface.400}',
            activeColor: '{surface.400}',
          },
        },
      },
    },
  },
  components: {
    progressbar: {
      height: '0.25rem',
      colorScheme: {
        light: {
          value: '{primary-520}',
          background: '{surface.300}',
        },
        dark: {
          value: '{primary-520}',
          background: '{surface.700}',
        },
      },
    },
    // progressspinner: {
    //     colorScheme: {
    //         light: {},
    //         dark: {
    //             color: {
    //                 1: '{primary.400}',
    //                 2: '{primary.500}',
    //                 3: '{primary.600}',
    //                 4: '{primary.700}'
    //             }
    //         }
    //     }
    // },
    toggleswitch: {
      width: '2rem',
      height: '1rem',
      gap: '0.25rem',
      handle: {
        size: '0.65rem',
      },
      colorScheme: {
        light: {
          disabled: {
            background: '{surface.130}',
          },
          handle: {
            disabled: {
              background: '{surface.130}',
            },
          },
        },
        dark: {
          disabled: {
            background: '{surface.800}',
          },
          handle: {
            disabled: {
              background: '{surface.700}',
            },
          },
        },
      },
    },
    toolbar: {
      colorScheme: {
        light: {
          root: {},
        },
        dark: {
          root: {},
        },
      },
    },
    dialog: {
      colorScheme: {
        light: {
          root: {},
        },
        dark: {
          root: {},
        },
      },
    },
    scrollpanel: {
      colorScheme: {
        light: {},
        dark: {
          bar: {},
        },
      },
    },
    panel: {
      colorScheme: {
        light: {
          root: {},
          header: {
            color: '{surface.700}',
          },
        },
        dark: {
          root: {
            background: '{surface.800}',
            color: '{surface.0}',
            borderColor: 'transparent',
          },
          header: {
            color: '{surface.300}',
          },
        },
      },
    },
    menu: {
      colorScheme: {
        light: {
          root: {},
          item: {
            // color: "{surface.700}",
          },
        },
        dark: {
          root: {
            // background: 'transparent'
            // color: "{surface.0}",
          },
          item: {
            // color: "{surface.400}",
            focus: {
              // background: 'transparent',
              // color: '{primary.500}'
            },
          },
        },
      },
    },
    contextmenu: {
      colorScheme: {
        light: {
          // option: {
          //     color: "{surface.500}",
          //     focus: {
          //        background: "linear-gradient({primary.500}, {primary.600})",
          //        color: "{surface.0}",
          //     },
          // },
        },
        dark: {
          root: {
            // background: '{surface.800}',
            // color: '{surface.200}',
            border: {
              // color: '{surface.900}'
            },
          },
          item: {
            // color: '{surface.400}',
            // padding: '0.1rem 0.75rem',
            focus: {
              // background: 'linear-gradient({primary.500}, {primary.600})',
              // color: '{surface.0}'
            },
          },
          // option: {
          //   color: "{surface.400}",
          //   focus: {
          //     background: "linear-gradient({primary.500}, {primary.600})",
          //     color: "{surface.0}",
          //   },
          // },
          // overlay: {
          //   background: "{surface.900}",
          //   border: {
          //     color: "{surface.800}",
          //   },
          // },
          // color: "{surface.300}",
        },
      },
    },
    fieldset: {
      colorScheme: {
        light: {},
        dark: {
          root: {
            // borderColor: '{surface.700}',
            // background: '{surface.900}',
            // color: '{surface.0}'
          },
          legend: {
            // background: '{surface.900}',
            hover: {
              // background: '{surface.800}',
              // color: '{surface.0}'
            },
          },
          'toggle-icon': {
            hover: {
              // color: '{primary.500}'
            },
          },
        },
      },
    },
    card: {
      colorScheme: {
        light: {
          root: {
            // background: '{surface.0}',
            // color: '{surface.700}',
            // shadow: 'none'
          },
        },
        dark: {
          root: {
            background: '{surface.800}',
            color: '{surface.0}',
          },
          subtitle: {
            // color: '{surface.400}'
          },
        },
      },
    },
    tabs: {
      tablist: {
        colorScheme: {
          light: {
            // background: 'transparent',
            border: {
              // color: '{surface.300}'
            },
          },
          dark: {
            // background: 'transparent',
            border: {
              // color: '{surface.700}'
            },
          },
        },
      },
      tab: {
        colorScheme: {
          light: {
            // background: 'transparent',
            border: {
              // color: '{surface.300}'
            },
            hover: {
              // color: '{primary.600}',
              border: {
                // color: '{primary.600}'
              },
            },
          },
          dark: {
            // background: 'transparent',
            border: {
              // color: '{surface.700}'
            },
            hover: {
              // color: '{primary.600}',
              border: {
                // color: '{primary.600}'
              },
            },
          },
        },
      },
      tabpanel: {
        colorScheme: {
          light: {
            // background: 'transparent'
          },
          dark: {
            // background: 'transparent'
          },
        },
      },
    },
    inputtext: {
      // background: 'transparent',
      shadow: 'none',
      colorScheme: {
        light: {
          color: '{surface.700}',
        },
        dark: {
          color: '{surface.300}',
        },
      },
    },
    select: {
      // background: 'transparent',
      option: {
        // padding: '0 1rem',
        border: {
          // radius: 0
        },
      },
      transition: {
        // duration: 0
      },
      // shadow: 'none',
      colorScheme: {
        light: {
          option: {
            // color: '{surface.500}',
            focus: {
              // background: 'linear-gradient({primary.500}, {primary.600})',
              // color: '{surface.0}'
            },
          },
        },
        dark: {
          option: {
            // color: '{surface.400}',
            focus: {
              // background: 'linear-gradient({primary.500}, {primary.600})',
              // color: '{surface.0}'
            },
          },
          overlay: {
            // background: '{surface.900}',
            border: {
              // color: '{surface.800}'
            },
          },
          // color: '{surface.300}'
        },
      },
    },
    textarea: {
      // background: 'transparent',
      transition: {
        duration: 0,
      },
      // shadow: 'none'
    },
  },
};

export default BasicAAB;
