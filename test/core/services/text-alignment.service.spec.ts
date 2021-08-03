import { TextAlignmentService } from '../../../src/core/services/text-alignment.service';

describe(`quand on appel "TextAlignmentService.justify()" avec un texte à justifier`, () => {
  let textAlignmentService: TextAlignmentService;
  beforeEach(() => {
    textAlignmentService = new TextAlignmentService();
  });

  describe('et que le texte contient un seul mot', () => {
    it(`devrait retourner le même texte non justifié`, () => {
      const text = 'TicTacTrip';
      const result = textAlignmentService.justify(text);
      expect(result).toBe(text);
    });
  });

  describe('et que le texte fait moins de 80 caractères', () => {
    describe(`et que le texte est sur une ligne`, () => {
      it(`devrait retourner le même texte non justifié`, () => {
        const text =
          'Cette croyance survivait pendant quelques secondes à mon réveil.';
        const expected =
          'Cette croyance survivait pendant quelques secondes à mon réveil.';
        const result = textAlignmentService.justify(text);
        expect(result).toBe(expected);
      });
    });

    describe(`et que le texte est sur plusieurs lignes`, () => {
      it(`devrait justifier le texte sauf la dernière ligne`, () => {
        const text = `Longtemps, je me suis couché de bonne heure.
Bonne nouvelle !`;
        const expectedText = `Longtemps,      je      me      suis      couché      de      bonne       heure.
Bonne nouvelle !`;
        const result = textAlignmentService.justify(text);
        expect(result).toBe(expectedText);
      });
    });
  });

  describe(`et que le texte est sur plusieurs lignes`, () => {
    it(`devrait justifier le texte sauf la dernière ligne`, () => {
      const text = `Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. 
      Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;
      
      const expectedText = 
`Cette croyance survivait  pendant  quelques  secondes  à  mon  réveil;  elle  ne
choquait pas ma raison, mais pesait comme des  écailles  sur  mes  yeux  et  les
empêchait  de  se  rendre  compte  que  le   bougeoir   n’était   plus   allumé.
Puis elle commençait à me devenir inintelligible, comme  après  la  métempsycose
les pensées d’une existence antérieure; le sujet du livre se détachait  de  moi,
j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et  j’étais
bien étonné de trouver autour de moi une obscurité, douce et reposante pour  mes
yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait  comme
une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;
      const result = textAlignmentService.justify(text);
      expect(result).toBe(expectedText);
    });
  });
});
