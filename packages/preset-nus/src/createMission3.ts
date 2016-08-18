declare var window: any

export default function () {
  const globals: string[] = []
  const context = {}

  function export_symbol(sym, value) {
    context[sym] = value
    globals.push(sym)
  }

  export_symbol('show', window.show);
  export_symbol('clear', window.clear);
  export_symbol('hollusion', window.hollusion);
  export_symbol('anaglyph', window.anaglyph);
  export_symbol('stereogram', window.stereogram);
  export_symbol('scale', window.scale);
  export_symbol('overlay', window.overlay);
  export_symbol('overlay_frac', window.overlay_frac);
  export_symbol('rotate', window.rotate);
  export_symbol('translate', window.translate);
  export_symbol('flip_horiz', window.flip_horiz);
  export_symbol('flip_vert', window.flip_vert);
  export_symbol('turn_upside_down', window.turn_upside_down);
  export_symbol('quarter_turn_left', window.quarter_turn_left);
  export_symbol('quarter_turn_right', window.quarter_turn_right);
  export_symbol('beside', window.beside);
  export_symbol('stack', window.stack);
  export_symbol('stackn', window.stackn);
  export_symbol('stack_frac', window.stack_frac);
  export_symbol('repeat_pattern', window.repeat_pattern);
  export_symbol('make_cross', window.make_cross);
  export_symbol('rcross_bb', window.rcross_bb);
  export_symbol('sail_bb', window.sail_bb);
  export_symbol('corner_bb', window.corner_bb);
  export_symbol('nova_bb', window.nova_bb);
  export_symbol('heart_bb', window.heart_bb);
  export_symbol('circle_bb', window.circle_bb);
  export_symbol('ribbon_bb', window.ribbon_bb);
  export_symbol('black_bb', window.black_bb);
  export_symbol('blank_bb', window.blank_bb);
  export_symbol('pentagram_bb', window.pentagram_bb);

  return {context, globals}
}
