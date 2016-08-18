
function initializeSummernote(element) {
  var airmodeOptions = $.extend(true, { airMode: true },
                            { popover: (<any> $).summernote.options.popover });
  airmodeOptions.popover.air.unshift(['style', ['style']]);
  (<any> $('textarea.text.airmode', element)).summernote(airmodeOptions);
  (<any> $('textarea.text', element)).summernote();
}

function initializeComponents(element) {
  (<any> $('[data-toggle="popover"]', element)).popover();
  (<any> $('[title]', element)).tooltip();
  (<any> $('input.toggle-all[type="checkbox"]', element)).checkboxToggleAll();
  (<any> $('textarea.code', element)).ace();
  initializeSummernote(element);
}

const summernote =
  'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js'

if ((<any> window).$) {
  $.getScript(summernote, () => {
    initializeComponents(document)
  })
}
