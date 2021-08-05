import { HttpStatusCode } from '../../../src/common/http-status-code.constant';
import { TextAlignmentService } from '../../../src/core/services/text-alignment.service';
import { AppDbContext } from '../../../src/infrastructure/data-access/app-db-context';
import { LimitRateRepository } from '../../../src/infrastructure/repositories/limit-rate.repo';

describe(TextAlignmentService.name, () => {
  let textAlignmentService: TextAlignmentService;
  const AppDbContextMock = <jest.Mock<AppDbContext>>AppDbContext;
  const limitRateRepo = new LimitRateRepository(new AppDbContextMock());
  const email = 'willy.falone@tictactrip.fr';

  describe(`quand on appel ${TextAlignmentService.name}.justify() avec un texte à justifier`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(limitRateRepo, 'findTodayRate').mockResolvedValue({} as never);
      jest
        .spyOn(limitRateRepo, 'updateTotalWords')
        .mockResolvedValue([1] as never);

      textAlignmentService = new TextAlignmentService(limitRateRepo);
    });

    describe(`et que c'est le premier appelle réalisé par l'utilisateur <${email}>`, () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(limitRateRepo, 'findTodayRate').mockResolvedValue(null);
        jest.spyOn(limitRateRepo, 'create').mockResolvedValue({} as never);

        textAlignmentService = new TextAlignmentService(limitRateRepo);
      });

      it(`devrait se créer une nouvelle ligne dans la base de données`, async () => {
        const text = 'TicTacTrip';
        await textAlignmentService.justify(email, text);
        expect(limitRateRepo.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('et que le texte contient un seul mot', () => {
      it(`devrait retourner le même texte non justifié`, async () => {
        const text = 'TicTacTrip';
        const response = await textAlignmentService.justify(email, text);
        expect(response.data).toBe(text);
      });
    });

    describe('et que le texte fait moins de 80 caractères', () => {
      describe(`et que le texte est sur une ligne`, () => {
        it(`devrait retourner le même texte non justifié`, async () => {
          const text =
            'Cette croyance survivait pendant quelques secondes à mon réveil.';
          const expected =
            'Cette croyance survivait pendant quelques secondes à mon réveil.';
          const response = await textAlignmentService.justify(email, text);
          expect(response.data).toBe(expected);
        });
      });

      describe(`et que le texte est sur plusieurs lignes`, () => {
        it(`devrait justifier le texte sauf la dernière ligne`, async () => {
          const text = `Longtemps, je me suis couché de bonne heure.
Bonne nouvelle !`;
          const expectedText = `Longtemps,      je      me      suis      couché      de      bonne       heure.
Bonne nouvelle !`;
          const response = await textAlignmentService.justify(email, text);
          expect(response.data).toBe(expectedText);
        });
      });
    });

    describe(`et que le texte est sur plusieurs lignes`, () => {
      it(`devrait justifier le texte sauf la dernière ligne`, async () => {
        const text = `Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. 
      Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;

        const expectedText = `Cette croyance survivait  pendant  quelques  secondes  à  mon  réveil;  elle  ne
choquait pas ma raison, mais pesait comme des  écailles  sur  mes  yeux  et  les
empêchait  de  se  rendre  compte  que  le   bougeoir   n’était   plus   allumé.
Puis elle commençait à me devenir inintelligible, comme  après  la  métempsycose
les pensées d’une existence antérieure; le sujet du livre se détachait  de  moi,
j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et  j’étais
bien étonné de trouver autour de moi une obscurité, douce et reposante pour  mes
yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait  comme
une chose sans cause, incompréhensible, comme une chose vraiment obscure.`;
        const response = await textAlignmentService.justify(email, text);
        expect(response.data).toBe(expectedText);
      });
    });

    describe(`et que la limite de mot est atteinte (> 80000)`, () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest
          .spyOn(limitRateRepo, 'findTodayRate')
          .mockResolvedValue({ totalWords: 79999 } as never);
        jest.spyOn(limitRateRepo, 'create').mockResolvedValue({} as never);

        textAlignmentService = new TextAlignmentService(limitRateRepo);
      });

      it(`devrait retourner une erreur ${HttpStatusCode.PAYMENT_REQUIRED}`, async () => {
        const text =
          'Cette croyance survivait pendant quelques secondes à mon réveil.';
        const response = await textAlignmentService.justify(email, text);
        const message = response?.error?.message;
        expect(response.httpCode).toBe(HttpStatusCode.PAYMENT_REQUIRED);
        expect(message).toBe(message);
      });
    });
  });
});
