function newGoldenLayoutConfig(): GoldenLayout.Config {
  return {
    settings: {
      hasHeaders: true,
      reorderEnabled: true,
      selectionEnabled: false,
      showPopoutIcon: false,
      showMaximiseIcon: false,
      showCloseIcon: true
    },
    dimensions: {
      borderWidth: 5,
      minItemHeight: 10,
      minItemWidth: 10,
      headerHeight: 24,
      dragProxyWidth: 300,
      dragProxyHeight: 200
    },
    labels: {
      close: 'close',
      maximise: 'maximise',
      minimise: 'minimise',
      popout: 'open in new window'
    },
    content: [{
      type: 'stack',
      content: []
    }]
  }
}

export default newGoldenLayoutConfig
