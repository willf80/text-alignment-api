import { TextOptions } from '../../../src/core/utils/text-options.enum';
import { TextWrapper } from '../../../src/core/utils/text-transform.util';

describe('quand on passe un texte et une limite de caractères par ligne', () => {
  let text = '';
  describe('et que le texte est vide', () => {
    it(`devrait retourner un texte vide`, () => {
      text = '';
      const expectedResult = TextWrapper.wrap(text, TextOptions.MaxLength);
      expect(expectedResult).toBe(text);
    });
  });

  describe(`et que le nombre de caractères par ligne max est inférieur à ${TextOptions.MinLength}`, () => {
    it(`devrait lever une exception`, () => {
      const line = 39;
      try {
        TextWrapper.wrap(text, line);
      } catch (e) {
        expect(`maxLine must be greater than or equal to ${TextOptions.MinLength}`).toBe(e.message);
      }
    });
  });

  describe('et que le texte est sur une ligne', () => {
    describe(`et que le texte fait moins de ${TextOptions.MaxLength} caractères`, () => {
      it(`devrait retourner la même ligne`, () => {
        text = 'Longtemps, je me suis couché de bonne heure.';
        const expectedResult = TextWrapper.wrap(text, TextOptions.MaxLength);
        expect(expectedResult).toBe(text);
      });
    });

    describe(`et que le texte fait plus de ${TextOptions.MaxLength} caractères`, () => {
      beforeEach(() => {
        text = 
        `Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains.`;
      });

      it(`devrait retourner un texte sur plusieurs ligne`, () => {
        const mockResult = 
`Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,
mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je
m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le
sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les
mains.`;

        const result = TextWrapper.wrap(text, TextOptions.MaxLength);
        expect(result).toBe(mockResult);
      });
    });
  });

  describe('et que le texte est sur plusieurs ligne', () => {
    beforeEach(() => {
      text = 
`Il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. 

Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. 
  Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;
    });

    it(`devrait retourner un texte sur plusieurs ligne`, () => {
      const mockResult = 
`Il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un
quatuor, la rivalité de François Ier et de Charles-Quint.

Cette croyance survivait pendant quelques secondes à mon réveil; elle ne
choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les
empêchait de se rendre compte que le bougeoir n’était plus allumé.
Puis elle commençait à me devenir inintelligible, comme après la métempsycose
les pensées d’une existence antérieure; le sujet du livre se détachait de moi,
j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais
bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes
yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme
une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;

        const result = TextWrapper.wrap(text, TextOptions.MaxLength);
        expect(result).toBe(mockResult);
    });
  });
});
