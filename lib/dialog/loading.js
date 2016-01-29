/**
 * Loading
 */

module.exports = function(query) {
  return [
    'En attente de recherche pour '+ query +'...',
    'Je te cherche ça... ',
    'Bonne pioche ! juste une seconde...',
    'J\'ai quelque chose pour toi...',
    'J\'ai du matos pour toi, gros...',
    'Ouais j\'en ai ! attends attends...',
    'Tu veux du '+ query +' ? j\'ai ce qu\'il te faut...'
  ];
};