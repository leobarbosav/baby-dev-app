export interface Vacina {
  id: string;
  nome: string;
  dose: string;
  doencaPrevine: string;
  idadeDias: number;
  idadeLabel: string;
  obrigatoria: boolean;
}

export interface VacinaComStatus extends Vacina {
  dataPrevista: Date;
  status: 'aplicada' | 'pendente' | 'atrasada';
  diasParaData: number;
}

export const VACINAS_SUS: Vacina[] = [
  { id: 'bcg',         nome: 'BCG',                    dose: 'Dose única',   doencaPrevine: 'Tuberculose grave',                          idadeDias: 0,    idadeLabel: 'Ao nascer',   obrigatoria: true },
  { id: 'hepb1',       nome: 'Hepatite B',              dose: '1ª dose',      doencaPrevine: 'Hepatite B',                                 idadeDias: 0,    idadeLabel: 'Ao nascer',   obrigatoria: true },
  { id: 'penta1',      nome: 'Pentavalente',            dose: '1ª dose',      doencaPrevine: 'Difteria, tétano, coqueluche, Hib, Hep B',   idadeDias: 60,   idadeLabel: '2 meses',     obrigatoria: true },
  { id: 'penta2',      nome: 'Pentavalente',            dose: '2ª dose',      doencaPrevine: 'Difteria, tétano, coqueluche, Hib, Hep B',   idadeDias: 120,  idadeLabel: '4 meses',     obrigatoria: true },
  { id: 'penta3',      nome: 'Pentavalente',            dose: '3ª dose',      doencaPrevine: 'Difteria, tétano, coqueluche, Hib, Hep B',   idadeDias: 180,  idadeLabel: '6 meses',     obrigatoria: true },
  { id: 'vip1',        nome: 'VIP (Poliomielite)',      dose: '1ª dose',      doencaPrevine: 'Poliomielite',                               idadeDias: 60,   idadeLabel: '2 meses',     obrigatoria: true },
  { id: 'vip2',        nome: 'VIP (Poliomielite)',      dose: '2ª dose',      doencaPrevine: 'Poliomielite',                               idadeDias: 120,  idadeLabel: '4 meses',     obrigatoria: true },
  { id: 'vip3',        nome: 'VIP (Poliomielite)',      dose: '3ª dose',      doencaPrevine: 'Poliomielite',                               idadeDias: 180,  idadeLabel: '6 meses',     obrigatoria: true },
  { id: 'vop_ref',     nome: 'VOP (Poliomielite oral)', dose: 'Reforço',      doencaPrevine: 'Poliomielite',                               idadeDias: 450,  idadeLabel: '15 meses',    obrigatoria: true },
  { id: 'pneumo1',     nome: 'Pneumocócica 10V',        dose: '1ª dose',      doencaPrevine: 'Pneumonia, meningite',                       idadeDias: 60,   idadeLabel: '2 meses',     obrigatoria: true },
  { id: 'pneumo2',     nome: 'Pneumocócica 10V',        dose: '2ª dose',      doencaPrevine: 'Pneumonia, meningite',                       idadeDias: 120,  idadeLabel: '4 meses',     obrigatoria: true },
  { id: 'pneumo_ref',  nome: 'Pneumocócica 10V',        dose: 'Reforço',      doencaPrevine: 'Pneumonia, meningite',                       idadeDias: 365,  idadeLabel: '12 meses',    obrigatoria: true },
  { id: 'rota1',       nome: 'Rotavírus (VORH)',         dose: '1ª dose',      doencaPrevine: 'Diarreia grave',                             idadeDias: 60,   idadeLabel: '2 meses',     obrigatoria: true },
  { id: 'rota2',       nome: 'Rotavírus (VORH)',         dose: '2ª dose',      doencaPrevine: 'Diarreia grave',                             idadeDias: 120,  idadeLabel: '4 meses',     obrigatoria: true },
  { id: 'meningo1',    nome: 'Meningocócica C',         dose: '1ª dose',      doencaPrevine: 'Meningite C',                                idadeDias: 90,   idadeLabel: '3 meses',     obrigatoria: true },
  { id: 'meningo2',    nome: 'Meningocócica C',         dose: '2ª dose',      doencaPrevine: 'Meningite C',                                idadeDias: 150,  idadeLabel: '5 meses',     obrigatoria: true },
  { id: 'meningo_ref', nome: 'Meningocócica C',         dose: 'Reforço',      doencaPrevine: 'Meningite C',                                idadeDias: 365,  idadeLabel: '12 meses',    obrigatoria: true },
  { id: 'fa',          nome: 'Febre Amarela',           dose: 'Dose única',   doencaPrevine: 'Febre Amarela',                              idadeDias: 270,  idadeLabel: '9 meses',     obrigatoria: true },
  { id: 'scr1',        nome: 'Tríplice Viral (SCR)',    dose: '1ª dose',      doencaPrevine: 'Sarampo, caxumba, rubéola',                  idadeDias: 365,  idadeLabel: '12 meses',    obrigatoria: true },
  { id: 'scr2',        nome: 'Tríplice Viral (SCR)',    dose: '2ª dose',      doencaPrevine: 'Sarampo, caxumba, rubéola',                  idadeDias: 450,  idadeLabel: '15 meses',    obrigatoria: true },
  { id: 'dtp1_ref',    nome: 'DTP',                    dose: '1º reforço',   doencaPrevine: 'Difteria, tétano, coqueluche',               idadeDias: 450,  idadeLabel: '15 meses',    obrigatoria: true },
  { id: 'dtp2_ref',    nome: 'DTP',                    dose: '2º reforço',   doencaPrevine: 'Difteria, tétano, coqueluche',               idadeDias: 1460, idadeLabel: '4 anos',      obrigatoria: true },
  { id: 'varicela',    nome: 'Varicela',               dose: 'Dose única',   doencaPrevine: 'Catapora',                                   idadeDias: 450,  idadeLabel: '15 meses',    obrigatoria: true },
  { id: 'hepa',        nome: 'Hepatite A',             dose: 'Dose única',   doencaPrevine: 'Hepatite A',                                 idadeDias: 450,  idadeLabel: '15 meses',    obrigatoria: true },
];

export function calcularCartao(dataNascimento: Date): VacinaComStatus[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return VACINAS_SUS.map(v => {
    const dataPrevista = new Date(dataNascimento);
    dataPrevista.setDate(dataPrevista.getDate() + v.idadeDias);
    dataPrevista.setHours(0, 0, 0, 0);

    const diffMs = dataPrevista.getTime() - hoje.getTime();
    const diasParaData = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const status: 'pendente' | 'atrasada' = dataPrevista > hoje ? 'pendente' : 'atrasada';

    return { ...v, dataPrevista, status, diasParaData };
  });
}
