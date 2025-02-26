import type { Preset } from "@primeuix/themes/types";

const BasicAAB: Preset = {
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
      450: '#61B8AB', // (DG-600)
      500: '#4FB0A1', // (DG-670)
      550: '#489F92', // (DG-500)

      850: '#004C4C', // (G-500)
      890: '#003737', // (G-600)
      920: '#002929', // (G-670)
    },
    yellow: {
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
      70: '#FAE8E6', // (A-50)
      300: '#DF9186', // (DA-500)
      350: '#E0796B', // (DA-600)
      400: '#E45F4E', // (DA-700)
      620: '#C21700', // (A-500)
      750: '#B51500', // (A-600)
      770: '#A81400', // (A-700)
      840: '#341D1D', // (DA-50)
    },
    grayOpacity: {
      0: '#FFFFFFBF',
      50: '#F3F3F3BF',
      880: '#1E1E1EBF',
      930: '#121212BF',
      1000: '#000000B3',
    },
    brand: {
      default: '{branding.default}',
      hover: '{branding.hover}',
      active: '{branding.active}',
    },
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
      450: '{teal.450}', // (DG-600)
      500: '{teal.500}', // (DG-670)
      550: '{teal.550}', // (DG-500)

      850: '{teal.850}', // (G-500)
      890: '{teal.890}', // (G-600)
      920: '{teal.920}', // (G-670)
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
    // list: {
    //   padding: '0.25rem 0.25rem',
    //   gap: '2px',
    //   header: { padding: '0.5rem 1rem 0.25rem 1rem' },
    //   option: { padding: '0.5rem 0.75rem', borderRadius: '{border.radius.sm}' },
    //   optionGroup: { padding: '0.5rem 0.75rem', fontWeight: '600' },
    // },
    // content: { borderRadius: '{border.radius.md}' },
    // mask: { transitionDuration: '0.15s' },
    // navigation: {
    //   list: { padding: '0.25rem 0.25rem', gap: '2px' },
    //   item: { padding: '0.5rem 0.75rem', borderRadius: '{border.radius.sm}', gap: '0.5rem' },
    //   submenuLabel: { padding: '0.5rem 0.75rem', fontWeight: '600' },
    //   submenuIcon: { size: '0.875rem' },
    // },
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
          warning: '{yellow.550}',
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
          color: '{primary.850}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.890}',
          activeColor: '{primary.950}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.850}',
          focusColor: '{primary.950}',
        },
        // mask: { background: 'rgba(0,0,0,0.4)', color: '{surface.200}' },
        formField: {
          //   background: '{surface.0}',
          disabledBackground: '{surface.370}',
          filledBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          //   borderColor: '{surface.300}',
          hoverBorderColor: '{surface.490}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.620}',
          color: '{surface.780}',
          disabledColor: '{surface.510}',
          placeholderColor: '{surface.510}',
          floatLabelColor: '{surface.510}',
          floatLabelFocusColor: '{surface.510}',
          floatLabelInvalidColor: '{red.620}',
          iconColor: '{surface.490}',
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
        // list: {
        //   option: {
        //     focusBackground: '{surface.100}',
        //     selectedBackground: '{highlight.background}',
        //     selectedFocusBackground: '{highlight.focus.background}',
        //     color: '{text.color}',
        //     focusColor: '{text.hover.color}',
        //     selectedColor: '{highlight.color}',
        //     selectedFocusColor: '{highlight.focus.color}',
        //     icon: { color: '{surface.400}', focusColor: '{surface.500}' },
        //   },
        //   optionGroup: { background: 'transparent', color: '{text.muted.color}' },
        // },
        // navigation: {
        //   item: {
        //     focusBackground: '{surface.100}',
        //     activeBackground: '{surface.100}',
        //     color: '{text.color}',
        //     focusColor: '{text.hover.color}',
        //     activeColor: '{text.hover.color}',
        //     icon: {
        //       color: '{surface.400}',
        //       focusColor: '{surface.500}',
        //       activeColor: '{surface.500}',
        //     },
        //   },
        //   submenuLabel: { background: 'transparent', color: '{text.muted.color}' },
        //   submenuIcon: {
        //     color: '{surface.400}',
        //     focusColor: '{surface.500}',
        //     activeColor: '{surface.500}',
        //   },
        // },
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
          warning: '{yellow.500}',
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
          contrastColor: '{surface.930}',
          hoverColor: '{primary.500}',
          activeColor: '{primary.450}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 20%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 10%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        // mask: { background: 'rgba(0,0,0,0.6)', color: '{surface.200}' },
        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.780}',
          filledBackground: '{surface.870}',
          filledFocusBackground: '{surface.870}',
          borderColor: '{surface.780}',
          hoverBorderColor: '{surface.620}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.300}',
          color: '{surface.0}',
          disabledColor: '{surface.490}',
          placeholderColor: '{surface.490}',
          floatLabelColor: '{surface.490}',
          floatLabelFocusColor: '{surface.490}',
          floatLabelInvalidColor: '{red.300}',
          iconColor: '{surface.490}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
        },
        text: {
          color: '{surface.130}',
          hoverColor: '{surface.0}',
          mutedColor: '{surface.370}',
          hoverMutedColor: '{surface.130}',
        },
        content: {
          background: '{surface.880}',
          hoverBackground: '{surface.870}',
          borderColor: '{surface.780}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            background: '{surface.880}',
            borderColor: '{surface.780}',
            color: '{text.color}',
          },
          popover: {
            background: '{surface.880}',
            borderColor: '{surface.780}',
            color: '{text.color}',
          },
          modal: {
            background: '{surface.880}',
            borderColor: '{surface.780}',
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
        // navigation: {
        //   item: {
        //     focusBackground: '{surface.800}',
        //     activeBackground: '{surface.800}',
        //     color: '{text.color}',
        //     focusColor: '{text.hover.color}',
        //     activeColor: '{text.hover.color}',
        //     icon: {
        //       color: '{surface.500}',
        //       focusColor: '{surface.400}',
        //       activeColor: '{surface.400}',
        //     },
        //   },
        //   submenuLabel: { background: 'transparent', color: '{text.muted.color}' },
        //   submenuIcon: {
        //     color: '{surface.500}',
        //     focusColor: '{surface.400}',
        //     activeColor: '{surface.400}',
        //   },
        // },
      },
    },
  },
  components: {
    avatar: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.130}',
            color: '{primary.850}',
          }
        },
        dark: {
          root: {
            background: '{surface.780}',
            color: '{primary.500}',
          }
        },
      },
    },
    progressbar: {
      root: {
        height: '0.25rem',
      },
      colorScheme: {
        light: {
          root: {
            background: '{surface.300}',
          },
          value: {
            background: '{yellow.520}',
          },
        },
        dark: {
          root: {
            background: '{surface.700}',
          },
          value: {
            background: '{yellow.570}',
          },
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

    button: {
      root: {
        borderRadius: '{form.field.border.radius}',
        roundedBorderRadius: '2rem',
        gap: '0.5rem',
        paddingX: '{form.field.padding.x}',
        paddingY: '{form.field.padding.y}',
        iconOnlyWidth: '2.5rem',
        sm: { fontSize: '0.875rem', paddingX: '0.625rem', paddingY: '0.375rem' },
        lg: { fontSize: '1.125rem', paddingX: '0.875rem', paddingY: '0.625rem' },
        label: { fontWeight: '500' },
        raisedShadow:
          '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
        focusRing: {
          width: '{focus.ring.width}',
          style: '{focus.ring.style}',
          offset: '{focus.ring.offset}',
        },
        badgeSize: '1rem',
        transitionDuration: '{form.field.transition.duration}',
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{primary.color}',
              hoverBackground: '{primary.hover.color}',
              activeBackground: '{primary.active.color}',
              borderColor: '{primary.color}',
              hoverBorderColor: '{primary.hover.color}',
              activeBorderColor: '{primary.active.color}',
              color: '{primary.contrast.color}',
              hoverColor: '{primary.contrast.color}',
              activeColor: '{primary.contrast.color}',
              focusRing: { color: '{primary.color}', shadow: 'none' },
            },
            secondary: {
              background: '{surface.100}',
              hoverBackground: '{surface.200}',
              activeBackground: '{surface.300}',
              borderColor: '{surface.100}',
              hoverBorderColor: '{surface.200}',
              activeBorderColor: '{surface.300}',
              color: '{surface.600}',
              hoverColor: '{surface.700}',
              activeColor: '{surface.800}',
              focusRing: { color: '{surface.600}', shadow: 'none' },
            },
            info: {
              background: '{sky.500}',
              hoverBackground: '{sky.600}',
              activeBackground: '{sky.700}',
              borderColor: '{sky.500}',
              hoverBorderColor: '{sky.600}',
              activeBorderColor: '{sky.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{sky.500}', shadow: 'none' },
            },
            success: {
              background: '{green.500}',
              hoverBackground: '{green.600}',
              activeBackground: '{green.700}',
              borderColor: '{green.500}',
              hoverBorderColor: '{green.600}',
              activeBorderColor: '{green.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{green.500}', shadow: 'none' },
            },
            warn: {
              background: '{yellow.500}',
              hoverBackground: '{yellow.520}',
              activeBackground: '{yellow.550}',
              borderColor: '{yellow.500}',
              hoverBorderColor: '{yellow.520}',
              activeBorderColor: '{yellow.550}',
              color: '#000000',
              hoverColor: '#000000',
              activeColor: '#000000',
              focusRing: { color: '{yellow.520}', shadow: 'none' },
            },
            help: {
              background: '{purple.500}',
              hoverBackground: '{purple.600}',
              activeBackground: '{purple.700}',
              borderColor: '{purple.500}',
              hoverBorderColor: '{purple.600}',
              activeBorderColor: '{purple.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{purple.500}', shadow: 'none' },
            },
            danger: {
              background: '{red.500}',
              hoverBackground: '{red.600}',
              activeBackground: '{red.700}',
              borderColor: '{red.500}',
              hoverBorderColor: '{red.600}',
              activeBorderColor: '{red.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{red.500}', shadow: 'none' },
            },
            contrast: {
              background: '{surface.950}',
              hoverBackground: '{surface.900}',
              activeBackground: '{surface.800}',
              borderColor: '{surface.950}',
              hoverBorderColor: '{surface.900}',
              activeBorderColor: '{surface.800}',
              color: '{surface.0}',
              hoverColor: '{surface.0}',
              activeColor: '{surface.0}',
              focusRing: { color: '{surface.950}', shadow: 'none' },
            },
          },
          // outlined: {
          // 	primary: {
          // 		hoverBackground: "{primary.50}",
          // 		activeBackground: "{primary.100}",
          // 		borderColor: "{primary.200}",
          // 		color: "{primary.color}",
          // 	},
          // 	secondary: {
          // 		hoverBackground: "{surface.50}",
          // 		activeBackground: "{surface.100}",
          // 		borderColor: "{surface.200}",
          // 		color: "{surface.500}",
          // 	},
          // 	success: { hoverBackground: "{green.50}", activeBackground: "{green.100}", borderColor: "{green.200}", color: "{green.500}" },
          // 	info: { hoverBackground: "{sky.50}", activeBackground: "{sky.100}", borderColor: "{sky.200}", color: "{sky.500}" },
          // 	warn: {
          // 		hoverBackground: "{orange.50}",
          // 		activeBackground: "{orange.100}",
          // 		borderColor: "{orange.200}",
          // 		color: "{orange.500}",
          // 	},
          // 	help: {
          // 		hoverBackground: "{purple.50}",
          // 		activeBackground: "{purple.100}",
          // 		borderColor: "{purple.200}",
          // 		color: "{purple.500}",
          // 	},
          // 	danger: { hoverBackground: "{red.50}", activeBackground: "{red.100}", borderColor: "{red.200}", color: "{red.500}" },
          // 	contrast: {
          // 		hoverBackground: "{surface.50}",
          // 		activeBackground: "{surface.100}",
          // 		borderColor: "{surface.700}",
          // 		color: "{surface.950}",
          // 	},
          // 	plain: {
          // 		hoverBackground: "{surface.50}",
          // 		activeBackground: "{surface.100}",
          // 		borderColor: "{surface.200}",
          // 		color: "{surface.700}",
          // 	},
          // },
          text: {
            primary: {
              hoverBackground: '{primary.50}',
              activeBackground: '{primary.100}',
              color: '{primary.color}',
            },
            secondary: {
              hoverBackground: '{surface.50}',
              activeBackground: '{surface.100}',
              color: '{surface.500}',
            },
            success: {
              hoverBackground: '{green.50}',
              activeBackground: '{green.100}',
              color: '{green.500}',
            },
            info: {
              hoverBackground: '{sky.50}',
              activeBackground: '{sky.100}',
              color: '{sky.500}',
            },
            warn: {
              hoverBackground: '{orange.50}',
              activeBackground: '{orange.100}',
              color: '{orange.500}',
            },
            help: {
              hoverBackground: '{purple.50}',
              activeBackground: '{purple.100}',
              color: '{purple.500}',
            },
            danger: {
              hoverBackground: '{red.50}',
              activeBackground: '{red.100}',
              color: '{red.500}',
            },
            plain: {
              hoverBackground: '{surface.50}',
              activeBackground: '{surface.100}',
              color: '{surface.700}',
            },
          },
          link: {
            color: '{primary.color}',
            hoverColor: '{primary.color}',
            activeColor: '{primary.color}',
          },
        },
        dark: {
          root: {
            primary: {
              background: '{primary.color}',
              hoverBackground: '{primary.hover.color}',
              activeBackground: '{primary.active.color}',
              borderColor: '{primary.color}',
              hoverBorderColor: '{primary.hover.color}',
              activeBorderColor: '{primary.active.color}',
              color: '{primary.contrast.color}',
              hoverColor: '{primary.contrast.color}',
              activeColor: '{primary.contrast.color}',
              focusRing: { color: '{primary.color}', shadow: 'none' },
            },
            secondary: {
              background: '{surface.800}',
              hoverBackground: '{surface.700}',
              activeBackground: '{surface.600}',
              borderColor: '{surface.800}',
              hoverBorderColor: '{surface.700}',
              activeBorderColor: '{surface.600}',
              color: '{surface.300}',
              hoverColor: '{surface.200}',
              activeColor: '{surface.100}',
              focusRing: { color: '{surface.300}', shadow: 'none' },
            },
            info: {
              background: '{sky.400}',
              hoverBackground: '{sky.300}',
              activeBackground: '{sky.200}',
              borderColor: '{sky.400}',
              hoverBorderColor: '{sky.300}',
              activeBorderColor: '{sky.200}',
              color: '{sky.950}',
              hoverColor: '{sky.950}',
              activeColor: '{sky.950}',
              focusRing: { color: '{sky.400}', shadow: 'none' },
            },
            success: {
              background: '{green.400}',
              hoverBackground: '{green.300}',
              activeBackground: '{green.200}',
              borderColor: '{green.400}',
              hoverBorderColor: '{green.300}',
              activeBorderColor: '{green.200}',
              color: '{green.950}',
              hoverColor: '{green.950}',
              activeColor: '{green.950}',
              focusRing: { color: '{green.400}', shadow: 'none' },
            },
            warn: {
              background: '{yellow.500}',
              hoverBackground: '{yellow.520}',
              activeBackground: '{yellow.550}',
              borderColor: '{yellow.500}',
              hoverBorderColor: '{yellow.520}',
              activeBorderColor: '{yellow.550}',
              color: '#000000',
              hoverColor: '#000000',
              activeColor: '#000000',
              focusRing: { color: '{yellow.520}', shadow: 'none' },
            },
            help: {
              background: '{purple.400}',
              hoverBackground: '{purple.300}',
              activeBackground: '{purple.200}',
              borderColor: '{purple.400}',
              hoverBorderColor: '{purple.300}',
              activeBorderColor: '{purple.200}',
              color: '{purple.950}',
              hoverColor: '{purple.950}',
              activeColor: '{purple.950}',
              focusRing: { color: '{purple.400}', shadow: 'none' },
            },
            danger: {
              background: '{red.400}',
              hoverBackground: '{red.300}',
              activeBackground: '{red.200}',
              borderColor: '{red.400}',
              hoverBorderColor: '{red.300}',
              activeBorderColor: '{red.200}',
              color: '{red.950}',
              hoverColor: '{red.950}',
              activeColor: '{red.950}',
              focusRing: { color: '{red.400}', shadow: 'none' },
            },
            contrast: {
              background: '{surface.0}',
              hoverBackground: '{surface.100}',
              activeBackground: '{surface.200}',
              borderColor: '{surface.0}',
              hoverBorderColor: '{surface.100}',
              activeBorderColor: '{surface.200}',
              color: '{surface.950}',
              hoverColor: '{surface.950}',
              activeColor: '{surface.950}',
              focusRing: { color: '{surface.0}', shadow: 'none' },
            },
          },
          // outlined: {
          // 	primary: {
          // 		hoverBackground: "color-mix(in srgb, {primary.color}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {primary.color}, transparent 84%)",
          // 		borderColor: "{primary.700}",
          // 		color: "{primary.color}",
          // 	},
          // 	secondary: {
          // 		hoverBackground: "rgba(255,255,255,0.04)",
          // 		activeBackground: "rgba(255,255,255,0.16)",
          // 		borderColor: "{surface.700}",
          // 		color: "{surface.400}",
          // 	},
          // 	success: {
          // 		hoverBackground: "color-mix(in srgb, {green.400}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {green.400}, transparent 84%)",
          // 		borderColor: "{green.700}",
          // 		color: "{green.400}",
          // 	},
          // 	info: {
          // 		hoverBackground: "color-mix(in srgb, {sky.400}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {sky.400}, transparent 84%)",
          // 		borderColor: "{sky.700}",
          // 		color: "{sky.400}",
          // 	},
          // 	warn: {
          // 		hoverBackground: "color-mix(in srgb, {orange.400}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {orange.400}, transparent 84%)",
          // 		borderColor: "{orange.700}",
          // 		color: "{orange.400}",
          // 	},
          // 	help: {
          // 		hoverBackground: "color-mix(in srgb, {help.400}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {help.400}, transparent 84%)",
          // 		borderColor: "{purple.700}",
          // 		color: "{purple.400}",
          // 	},
          // 	danger: {
          // 		hoverBackground: "color-mix(in srgb, {danger.400}, transparent 96%)",
          // 		activeBackground: "color-mix(in srgb, {danger.400}, transparent 84%)",
          // 		borderColor: "{red.700}",
          // 		color: "{red.400}",
          // 	},
          // 	contrast: {
          // 		hoverBackground: "{surface.800}",
          // 		activeBackground: "{surface.700}",
          // 		borderColor: "{surface.500}",
          // 		color: "{surface.0}",
          // 	},
          // 	plain: {
          // 		hoverBackground: "{surface.800}",
          // 		activeBackground: "{surface.700}",
          // 		borderColor: "{surface.600}",
          // 		color: "{surface.0}",
          // 	},
          // },
          text: {
            primary: {
              hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
              color: '{primary.color}',
            },
            secondary: {
              hoverBackground: '{surface.800}',
              activeBackground: '{surface.700}',
              color: '{surface.400}',
            },
            success: {
              hoverBackground: 'color-mix(in srgb, {green.400}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {green.400}, transparent 84%)',
              color: '{green.400}',
            },
            info: {
              hoverBackground: 'color-mix(in srgb, {sky.400}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {sky.400}, transparent 84%)',
              color: '{sky.400}',
            },
            warn: {
              hoverBackground: 'color-mix(in srgb, {orange.400}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {orange.400}, transparent 84%)',
              color: '{orange.400}',
            },
            help: {
              hoverBackground: 'color-mix(in srgb, {purple.400}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {purple.400}, transparent 84%)',
              color: '{purple.400}',
            },
            danger: {
              hoverBackground: 'color-mix(in srgb, {red.400}, transparent 96%)',
              activeBackground: 'color-mix(in srgb, {red.400}, transparent 84%)',
              color: '{red.400}',
            },
            plain: {
              hoverBackground: '{surface.800}',
              activeBackground: '{surface.700}',
              color: '{surface.0}',
            },
          },
          link: {
            color: '{primary.color}',
            hoverColor: '{primary.color}',
            activeColor: '{primary.color}',
          },
        },
      },
    },
    paginator: {
      colorScheme: {
        light: {
          root: {
            background: '{content.background}',
            color: '{content.color}',
          }
        },
        dark: {
          root: {
            background: 'transparent',
            color: '{content.color}',
          }
        },
      },
    },
    // root: {
    //   currentPageReport: { color: '{text.muted.color}' },
    //   // 	jumpToPageInput: { maxWidth: "2.5rem" },
    //   colorSheme: {
    //     light: {
    //       root: {
    //         background: '{content.background}',
    //         color: '{content.color}',
    //       },
    //     },
    //     dark: {
    //       root: {
    //         background: '{content.dark.background}',
    //         color: '{content.dark.color}',
    //       },
    //     },
    //   },
    // },
    checkbox: {
      colorScheme: {
        light: {
          root: {
            disabledBackground: '{surface.130}',
            borderColor: '{surface.130}',
            checkedDisabledBorderColor: '{surface.130}',
          },
          icon: {
            disabledColor: '{primary-500}',
          },
        },
        dark: {
          root: {
            background: '{surface.880}',
            borderColor: '{surface.620}',
            disabledBackground: '{surface.780}',
            checkedDisabledBorderColor: '{surface.780}',
            checkedBackground: '{primary.500}',
          },
          icon: {
            disabledColor: '{primary-500}',
          },
        },
      },
    },
    datepicker: {
      inputIcon: { color: '{form.field.icon.color}' },
      group: { borderColor: '{content.border.color}', gap: '{overlay.popover.padding}' },
      dayView: { margin: '0.5rem 0 0 0' },
      weekDay: { padding: '0.25rem', fontWeight: '500', color: '{content.color}' },
      buttonbar: { padding: '0.5rem 0 0 0', borderColor: '{content.border.color}' },
      timePicker: {
        padding: '0.5rem 0 0 0',
        borderColor: '{content.border.color}',
        gap: '0.5rem',
        buttonGap: '0.25rem',
      },
      colorScheme: {
        light: {
          dropdown: {
            background: '{surface.100}',
            hoverBackground: '{surface.200}',
            activeBackground: '{surface.300}',
            color: '{surface.600}',
            hoverColor: '{surface.700}',
            activeColor: '{surface.800}',
          },
          today: { background: '{surface.200}', color: '{surface.900}' },
        },
        dark: {
          dropdown: {
            background: '{surface.800}',
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.600}',
            color: '{surface.300}',
            hoverColor: '{surface.200}',
            activeColor: '{surface.100}',
          },
          header: {
            background: '{content.background}',
            borderColor: '{content.border.color}',
            color: '{content.color}',
            padding: '0 0 0.5rem 0',
          },
          panel: {
            background: '{content.background}',
            borderColor: '{content.border.color}',
            color: '{content.color}',
            borderRadius: '{content.border.radius}',
            shadow: '{overlay.popover.shadow}',
            padding: '{overlay.popover.padding}',
          },
          selectMonth: {
            hoverBackground: '{content.hover.background}',
            color: '{content.color}',
            hoverColor: '{content.hover.color}',
            padding: '0.25rem 0.5rem',
            borderRadius: '{content.border.radius}',
          },
          selectYear: {
            hoverBackground: '{content.hover.background}',
            color: '{content.color}',
            hoverColor: '{content.hover.color}',
            padding: '0.25rem 0.5rem',
            borderRadius: '{content.border.radius}',
          },
          date: {
            hoverBackground: '{content.hover.background}',
            selectedBackground: '{primary.color}',
            rangeSelectedBackground: '{highlight.background}',
            color: '{content.color}',
            hoverColor: '{content.hover.color}',
            selectedColor: '{primary.contrast.color}',
            rangeSelectedColor: '{highlight.color}',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            padding: '0.25rem',
            focusRing: {
              width: '{focus.ring.width}',
              style: '{focus.ring.style}',
              color: '{focus.ring.color}',
              offset: '{focus.ring.offset}',
              shadow: '{focus.ring.shadow}',
            },
          },
          monthView: { margin: '0.5rem 0 0 0' },
          month: { borderRadius: '{content.border.radius}' },
          yearView: { margin: '0.5rem 0 0 0' },
          year: { borderRadius: '{content.border.radius}' },
          group: { borderColor: '{content.border.color}', gap: '{overlay.popover.padding}' },
          dayView: { margin: '0.5rem 0 0 0' },
          weekDay: { padding: '0.25rem', fontWeight: '500', color: '{content.color}' },
          today: { background: '{surface.700}', color: '{surface.0}' },
          timePicker: {
            padding: '0.5rem 0 0 0',
            borderColor: '{content.border.color}',
            gap: '0.5rem',
            buttonGap: '0.25rem',
          },
        },
      },
    },
    multiselect: {
      colorScheme: {
        light: {
          root: {
            background: 'transparent',
          }
        },
        dark: {
          root: {
            background: 'transparent',
          }
        },
      },
      list: {
        padding: '0 0',
      },
      option: {
        borderRadius: '0',
        focusBackground: 'linear-gradient({primary.450}, {primary.550})',
        focusColor: '{surface.0}',
      },
    },
    select: {
      root: {
        background: 'transparent',
        borderRadius: '0',
        paddingX: '1rem',
        paddingY: '0.25rem',
        transitionDuration: '0',
        shadow: 'none',
      },
      option: {
        padding: '0 1rem',
        borderRadius: '0',
      },
      colorScheme: {
        light: {
          option: {
            color: '{surface.510}',
            focusBackground: 'linear-gradient({primary.450}, {primary.550})',
            focusColor: '{surface.0}',
          },
        },
        dark: {
          root: {
            disabledBackground: 'transparent',
            color: '{surface.130}',
          },
          option: {
            color: '{surface.400}',
            focusBackground: 'linear-gradient({primary.450}, {primary.550})',
            focusColor: '{surface.0}',
          },
          overlay: {
            background: '{surface.880}',
            borderColor: '{surface.870}',
          },
        },
      },
    },
    dialog: {
      colorScheme: {
        light: {
          root: {
            color: '{text.color}',
            background: '{surface.50}',
            borderColor: 'transparent',
          }
        },
        dark: {
          root: {
            color: '{text.color}',
            background: '{surface.870}',
            borderColor: 'transparent',
          },
        },
      },
    },
    popover: {
      colorScheme: {
        light: {
          root: {
            color: '{text.color}',
            background: '{surface.50}',
            borderColor: 'transparent',
          }
        },
        dark: {
          root: {
            color: '{text.color}',
            background: '{surface.870}',
            borderColor: 'transparent',
          },
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
            // hover: {
              // background: '{surface.800}',
              // color: '{surface.0}'
            // },
          },
          toggleIcon: {
            // hoverColor: '{primary.500}'
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
            background: '{surface.880}',
            color: '{surface.0}',
          },
          subtitle: {
            // color: '{surface.400}'
          },
        },
      },
    },
    tabs: {
      active: {
        colorScheme: {
          light: {
            background: '{primary.850}',
          },
          dark: {
            bar: {
              background: '{primary.550}',
            },
          },
        },
      },
      tablist: {
        background: 'transparent',
        borderColor: 'transparent',
        // colorScheme: {
        //   light: {
        //     background: 'transparent',
        //     border: {
        //       color: 'transparent',
        //     },
        //   },
        //   dark: {
        //     background: 'transparent',
        //     border: {
        //       color: 'transparent',
        //     },
        //   },
        // },
      },
      tab: {
        // @ts-expect-error
        colorScheme: {
          light: {
            background: 'transparent',
            color: '{surface.870}',
            border: {
              color: '{surface.870}',
            },
            active: {
              color: '{primary.890}',
              border: {
                color: '{primary.890}',
              },
            },
            hover: {
              color: '{primary.850}',
              border: {
                color: '{primary.850}',
              },
            },
          },
          dark: {
            background: 'transparent',
            color: '{surface.370}',
            border: {
              color: '{surface.370}',
            },
            active: {
              color: '{primary.500}',
              border: {
                color: '{primary.500}',
              },
            },
            hover: {
              color: '{primary.450}',
              border: {
                color: '{primary.450}',
              },
            },
          },
        },
      },
      tabpanel: {
        background: 'transparent',
      },
    },
    inputtext: {
      root: {
        shadow: 'none',
      },
      colorScheme: {
        light: {
          root: {
            background: '{surface.50}',
            color: '{surface.780}',
            borderColor: '{surface.780}',
          }
        },
        dark: {
          root: {
            background: '{surface.880}',
            color: '{surface.130}',
            borderColor: '{surface.780}',
          }
        },
      },
    },
    textarea: {
      root: {
        background: 'transparent',
        transitionDuration: '0',
      },
      colorScheme: {
        light: {
          root: {
            color: '{surface.780}',
          }
        },
        dark: {
          root: {
            color: '{surface.370}',
          }
        },
      },
    },
  },
};

export default BasicAAB;
