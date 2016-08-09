declare var $: any

function initializeSummernote(element) {
  var airmodeOptions = $.extend(true, { airMode: true },
                                 { popover: $.summernote.options.popover });
  airmodeOptions.popover.air.unshift(['style', ['style']]);
  $('textarea.text.airmode', element).summernote(airmodeOptions);
  $('textarea.text', element).summernote();
}

function initializeComponents(element) {
  $('[data-toggle="popover"]', element).popover();
  $('[title]', element).tooltip();
  $('input.toggle-all[type="checkbox"]', element).checkboxToggleAll();
  $('textarea.code', element).ace();
  initializeSummernote(element);
}

const summernote =
  'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js'

if (window.$) {
  $.getScript(summernote, () => {
    initializeComponents(document)
  })
}
