import { TextOptions } from '../../../src/core/utils/text-options.enum';
import { wrapText } from '../../../src/core/utils/text-transform.util';

describe('quand on passe un texte', () => {
  let text = '';
  describe('et que le texte est vide', () => {
    it(`devrait retourner un texte vide`, () => {
      text = '';
      const expectedResult = wrapText(text, TextOptions.MaxLine);
      expect(text).toBe(expectedResult);
    });
  });

  describe(`et que le nombre de caractères par ligne max est inférieur à ${TextOptions.MinLine}`, () => {
    it(`devrait lever une exception`, () => {
      const line = 39;
      try {
        wrapText(text, line);
      } catch (e) {
        expect(e.message).toBe(
          `maxLine must be greater than or equal to ${TextOptions.MinLine}`,
        );
      }
    });
  });

  describe('et que le texte est sur une ligne', () => {
    describe(`et que le texte fait moins de ${TextOptions.MaxLine} caractères`, () => {
      it(`devrait retourner la même ligne`, () => {
        text = 'Longtemps, je me suis couché de bonne heure.';
        const expectedResult = wrapText(text, TextOptions.MaxLine);
        expect(text).toBe(expectedResult);
      });
    });

    describe(`et que le texte fait plus de ${TextOptions.MaxLine} caractères`, () => {
      it(`devrait retourner un texte sur plusieurs ligne`, () => {
        //
      });
    });
  });

  describe('et que le texte est sur plusieurs ligne', () => {
    it(`devrait retourner un texte sur plusieurs ligne`, () => {
      //
    });
  });
});
