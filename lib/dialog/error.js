/**
 * Random errors
 */

module.exports = function(query) {
  return [
    'Je n\'ai trouvé pas de '+ query +', désolé.',
    query +' ? cette musique de tapette ?',
    'Trop oldschool ce son.',
    query +' ? NOPE.',
    'Ça sort de la playlist de ta petite soeur ?'
  ];
};