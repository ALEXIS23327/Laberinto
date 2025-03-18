"use strict";

/*
 * Reglas:
 * El final de cada nivel debe ser el inicio del siguiente
 */

const emojis = {
  '-': ' ',
  'O': '🚪',
  'X': '🌵',
  'I': '💾',
  'PLAYER': '🐔',
  'BOMB_COLLISION': '💥',
  'GAME_OVER': '👎',
  'WIN': '🏆',
  'HEART': '❤️',
};

const maps = [];
maps.push(`
  IXXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  OXXXXXXXXX
`);
maps.push(`
  O--XXXXXXX
  X--XXXXXXX
  XX----XXXX
  X--XX-XXXX
  X-XXX--XXX
  X-XXXX-XXX
  XX--XX--XX
  XX--XXX-XX
  XXXX---IXX
  XXXXXXXXXX
  `);
maps.push(`
  I-----XXXX
  XXXXX-XXXX
  XX----XXXX
  XX-XXXXXXX
  XX-----XXX
  XXXXXX-XXX
  XX-----XXX
  XX-XXXXXXX
  XX-----OXX
  XXXXXXXXXX
`);
maps.push(`
  O----XXXXX
  XXXX-XXXXX
  XXXX-XXXXX
  XXXX-XXXXX
  XXXX---XXX
  XXXXXX-XXX
  XXXXXX-XXX
  XXXXXX---X
  XXXXXXXXIX
  XXXXXXXXXX
`);  
maps.push(`
  I-------XX
  -X-XXXX-XX
  -XXX-----X
  -XXXXX-XXX
  -----X-XXX
  XXXXXX-XXX
  XX-----XXX
  XX-XXXXXXX
  XX-----OXX
  XXXXXXXXXX
`);
maps.push(`
  O-X-XXXXXX
  X-X--X-XXX
  X-XX-X-XXX
  X----X---X
  XX-X--XX-X
  X--X----XX
  X-XX-X--XX
  X--X--X-XX
  XXX-X--I-X
  XXXXXXXXXX
`);
maps.push(`
  O--X-XXXXX
  X--XX-X-XX
  XX---X-XXX
  X-X--X--XX
  X--X---X-X
  X-X-X---XX
  XX--X---XX
  X--XX---XX
  XX---X--IX
  XXXXXXXXXX
`);  
maps.push(`
  XXXXXXXXXX
  X-----X--I
  X-XXX-X-XX
  X---X----X
  XXX-XXX-XX
  XX--X---XX
  XX-XXXXXXX
  XX-----XXX
  O---XX---X
  XXXXXXXXXX
`);