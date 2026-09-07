// ============================================================================
// PROJECT AIRFRAME - DICIONÁRIO DE INTERNACIONALIZAÇÃO (PT-BR)
// ============================================================================

export const ptBR = {
  common: {
    appName: 'Project Airframe',
    loading: 'Carregando ambiente de simulação aeroespacial...',
    cancel: 'Cancelar',
    continue: 'Continuar',
    confirm: 'Confirmar',
    back: 'Voltar',
    save: 'Salvar',
    saving: 'Salvando...',
    saved: 'Salvo',
    autosaved: 'Salvo automaticamente',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    select: 'Selecionar',
    selected: 'Selecionado',
    active: 'Ativo',
    completed: 'Concluído',
    inProgress: 'Em Progresso',
    pending: 'Pendente',
    open: 'Aberto',
    closed: 'Fechado',
    units: 'Unidades',
    aircraft: 'Aeronaves',
    passengers: 'Passageiros',
    pax: 'pax',
    month: 'Mês',
    months: 'Meses',
    year: 'Ano',
    years: 'Anos',
    day: 'Dia',
    days: 'Dias',
    quarter: 'Trimestre',
    usd: 'USD',
    reputation: 'Reputação',
    reputationLevels: {
      unknown: 'Desconhecido',
      experimental: 'Experimental',
      emerging: 'Emergente',
      proven: 'Comprovado',
      trusted: 'Confiável',
      global_supplier: 'Fornecedor Global',
      industry_leader: 'Líder da Indústria'
    }
  },

  navigation: {
    companyGroup: 'EMPRESA',
    overview: 'Visão Geral',
    organization: 'Organização',
    finance: 'Finanças',
    legacyTimeline: 'Linha do Tempo',
    
    productsGroup: 'PRODUTOS',
    aircraft: 'Programas de Aeronaves',
    engines: 'Programas de Motores',
    flightTesting: 'Ensaios em Voo',

    commercialGroup: 'COMERCIAL',
    ordersRfps: 'Propostas e Pedidos',
    customers: 'Companhias Aéreas',
    marketIntel: 'Inteligência de Mercado',

    operationsGroup: 'OPERAÇÕES',
    production: 'Montagem Final',
    airworthiness: 'Aeronavegabilidade e Segurança',
    fleetMap: 'Mapa de Operações',

    worldGroup: 'MUNDO',
    news: 'Notícias da Aviação',
    competitors: 'Concorrentes',
    saveArchive: 'Arquivo de Saves',
    settings: 'Configurações'
  },

  topbar: {
    briefing: 'BRIEFING EXECUTIVO',
    pause: 'Pausar Simulação',
    speed1x: '1× Velocidade Normal',
    speed2x: '2× Acelerado',
    speed4x: '4× Rápido',
    speed8x: '8× Alta Velocidade',
    speed16x: '16× Velocidade Máxima',
    speedMenu: 'Velocidade de Simulação',
    treasury: 'Tesouraria',
    runway: 'Fôlego de Caixa',
    notifications: 'Notificações',
    alerts: 'Anomalias de Segurança',
    dispatches: 'Notícias da Aviação',
    manualSave: 'Salvar Simulação',
    language: 'Idioma',
    settings: 'Configurações'
  },

  company: {
    founding: {
      badge: 'PROJECT AIRFRAME // NOVA EMPRESA',
      title: 'Fundar Fabricante de Aeronaves',
      subtitle: 'Estabeleça sua fabricante aeroespacial comercial. Projete aviões, gerencie linhas de montagem, negocie pedidos de frota e construa um legado na aviação.',
      stepIndicator: 'Etapa {{current}} de {{total}}',
      steps: {
        identity: 'Identidade',
        headquarters: 'Sede Global',
        financing: 'Financiamento',
        philosophy: 'Filosofia',
        review: 'Revisão e Lançamento'
      },
      step1: {
        title: 'Crie sua fabricante',
        desc: 'Defina a identidade e a presença no mercado da sua fabricante aeroespacial.',
        nameLabel: 'Nome da Empresa / Fabricante',
        namePlaceholder: 'ex: Embraer, Aureon Aerospace',
        tickerLabel: 'Código da Ação / Ticker',
        tickerPlaceholder: 'ex: AUR',
        previewTitle: 'Prévia da Identidade Comercial',
        previewDesc: 'Este identificador aparecerá nos certificados de tipo, relatórios financeiros e contratos com companhias aéreas.'
      },
      step2: {
        title: 'Escolha sua sede',
        desc: 'Selecione seu polo global de engenharia e manufatura. A localização afeta custos de mão de obra, talentos e acesso a fornecedores.',
        consequencesTitle: 'Vantagens do Polo Regional',
        engineeringTalent: 'Talento em Engenharia',
        laborCost: 'Custo de Mão de Obra',
        supplierAccess: 'Acesso a Fornecedores',
        governmentSupport: 'Apoio Governamental',
        high: 'Alto',
        moderate: 'Moderado',
        low: 'Baixo',
        excellent: 'Excelente',
        strong: 'Forte',
        premium: 'Premium'
      },
      step3: {
        title: 'Selecione o financiamento inicial',
        desc: 'Escolha a fonte do seu capital inicial. Mais capital exige maior diluição societária e pressão por metas rápidas.',
        founderEquity: 'Participação do Fundador',
        boardSeats: 'Assentos no Conselho',
        growthPressure: 'Pressão por Crescimento',
        startingCapital: 'Capital Inicial',
        options: {
          bootstrapped: {
            title: 'Fundador Independente',
            capital: 'US$ 180M',
            desc: 'Startup autofinanciada. Mantenha 100% de controle sem interferência do conselho e com metas conservadoras.'
          },
          private_equity: {
            title: 'Sindicato de Investidores Privados',
            capital: 'US$ 650M',
            desc: 'Aporte institucional equilibrado com metas razoáveis, contatos na indústria e 2 assentos no conselho.'
          },
          venture_capital: {
            title: 'Aliança de Venture Capital',
            capital: 'US$ 950M',
            desc: 'Capital agressivo exigindo entrada rápida no mercado, adoção ousada de tecnologia e prazos curtos de certificação.'
          },
          industrial_group: {
            title: 'Conglomerado Industrial',
            capital: 'US$ 1,2B',
            desc: 'Parceria com grupo industrial pesado oferecendo acesso direto a fornecedores de motores, ferramental e materiais compostos.'
          },
          state_backed: {
            title: 'Fundo Soberano Estatal',
            capital: 'US$ 1,6B',
            desc: 'Grande fundo soberano voltado a estabelecer um campeão aeroespacial nacional com mandato industrial estratégico.'
          }
        }
      },
      step4: {
        title: 'Qual filosofia guiará seus aviões?',
        desc: 'Escolha sua filosofia de engenharia. Isso influencia a velocidade de P&D, custos unitários e a percepção das companhias aéreas.',
        options: {
          engineering_excellence: {
            title: 'Excelência em Engenharia',
            desc: 'Foque em pureza aerodinâmica, materiais avançados e o menor consumo de combustível por assento.',
            pros: ['+15% Eficiência aerodinâmica e consumo', '+20% Reputação técnica de marca'],
            cons: ['+18% Custos de desenvolvimento em P&D']
          },
          cost_leadership: {
            title: 'Liderança em Custos e Simplicidade',
            desc: 'Entregue aeronaves acessíveis com baixo preço de compra, ferramental rápido e montagem simplificada.',
            pros: ['-20% Custo de ferramental e montagem', '+15% Velocidade de aumento de produção'],
            cons: ['-10% Alcance máximo em relação aos concorrentes']
          },
          passenger_comfort: {
            title: 'Conforto e Espaço do Passageiro',
            desc: 'Priorize cabines mais largas, menor altitude de cabine e isolamento acústico silencioso.',
            pros: ['+25% Preferência dos passageiros', '+15% Apelo para companhias de alto padrão'],
            cons: ['+8% Peso estrutural da fuselagem']
          },
          operational_ruggedness: {
            title: 'Robustez Operacional',
            desc: 'Reforce o trem de pouso, redundância elétrica e compatibilidade com pistas não pavimentadas.',
            pros: ['+25% Confiabilidade de despacho em climas severos', 'Certificação para pistas de cascalho'],
            cons: ['+10% Margem de peso vazio']
          },
          technological_pioneer: {
            title: 'Pioneirismo Tecnológico',
            desc: 'Adoção agressiva de Fly-By-Wire adaptativo e arquitetura de sistemas mais elétricos.',
            pros: ['+20% Modernidade do cockpit', '+12% Extensão nos intervalos de manutenção'],
            cons: ['Maiores riscos na campanha de ensaios em voo']
          }
        }
      },
      step5: {
        title: 'Revisar e Fundar Empresa',
        desc: 'Confirme seu estatuto antes de incorporar oficialmente sua fabricante aeroespacial.',
        startingCapital: 'Tesouraria Líquida',
        monthlyBurnEst: 'Gasto Mensal Estimado',
        founderOwnership: 'Participação do Fundador',
        headquartersLabel: 'Sede Principal',
        philosophyLabel: 'Filosofia Corporativa',
        submitButton: 'Fundar {{companyName}}',
        foundingHeadline: '{{companyName}} Oficialmente Fundada',
        foundingSummary: 'A {{companyName}} foi estabelecida em {{city}}, {{country}} com {{capital}} em capital fundador.'
      }
    }
  },

  dashboard: {
    greeting: 'Bom dia, {{companyName}}',
    briefingSubtitle: 'Sua empresa está capitalizada e pronta para entrar no mercado de aeronaves comerciais.',
    briefingWithProgram: 'Gerenciando {{count}} programa(s) ativo(s) a partir da sua fábrica em {{city}}.',
    metrics: {
      cash: 'Caixa da Tesouraria',
      runway: 'Fôlego de Caixa',
      backlog: 'Carteira de Pedidos',
      trust: 'Confiança na Indústria'
    },
    insolvency: {
      bannerTitle: 'DÉFICIT CRÍTICO DE LIQUIDEZ',
      bannerDesc: 'O caixa da empresa está negativo. A empresa está operando sob reestruturação financeira.',
      emergencyFunding: 'Solicitar Empréstimo Ponte Emergencial (US$ 100M)',
      slowdownPrograms: 'Desacelerar Queima de P&D'
    },
    nextAction: {
      title: 'PRÓXIMA AÇÃO RECOMENDADA',
      designFirst: {
        title: 'Projetar Aeronave Clean-Sheet',
        desc: 'Sua empresa não possui programas ativos. Abra o Estúdio de Design para configurar e lançar seu primeiro avião.',
        action: 'Abrir Estúdio de Design'
      },
      buildPrototype: {
        title: 'Construir Protótipo de Ensaios',
        desc: 'Engenharia detalhada concluída. Construa seu primeiro protótipo (US$ 35M) para preparar os ensaios em solo.',
        action: 'Construir Protótipo'
      },
      conductGroundTests: {
        title: 'Executar Ensaios em Solo',
        desc: 'Protótipo concluído. Complete os ensaios estáticos e integração de sistemas antes do primeiro voo.',
        action: 'Ir para Ensaios em Solo'
      },
      flightTestCampaign: {
        title: 'Avançar Campanha de Ensaios em Voo',
        desc: 'Seu {{aircraft}} necessita de mais {{hoursRemaining}} horas de ensaio em voo e cenários mandatórios antes da certificação.',
        action: 'Abrir Ensaios em Voo'
      },
      secureOrders: {
        title: 'Conquistar Clientes de Lançamento',
        desc: 'Sua aeronave está próxima da certificação. Envie propostas em RFPs compatíveis para formar sua carteira de pedidos.',
        action: 'Ver RFPs Compatíveis'
      },
      commissionLine: {
        title: 'Comissionar Linha de Montagem',
        desc: 'Você possui pedidos firmes. Comissione o ferramental da linha de montagem (US$ 85M) para iniciar a produção.',
        action: 'Abrir Montagem Final'
      },
      deliverAircraft: {
        title: 'Realizar Entregas aos Clientes',
        desc: 'Aeronaves estão avançando pelas estações. Conclua a produção para entregar as unidades e receber a receita.',
        action: 'Ver Linha de Produção'
      }
    },
    roadmap: {
      title: 'Caminho até a Entrada em Serviço',
      concept: 'Conceito',
      preliminary: 'Projeto Preliminar',
      detailed: 'Projeto Detalhado',
      prototype: 'Construção do Protótipo',
      groundTests: 'Ensaios em Solo',
      firstFlight: 'Primeiro Voo',
      flightTesting: 'Campanha de Ensaios em Voo',
      certification: 'Certificação de Tipo',
      production: 'Produção em Série',
      firstDelivery: 'Primeira Entrega (EIS)',
      projectedDate: 'Previsão: {{date}}',
      actualDate: 'Concluído: {{date}}',
      pending: 'Aguardando pré-requisitos'
    },
    emptyState: {
      title: 'Seu Primeiro Avião Começa Aqui',
      desc: 'Sua empresa ainda não possui programas ativos. Lance sua primeira aeronave comercial e conquiste seus primeiros clientes.',
      action: 'Lançar Programa de Aeronave'
    },
    activeProgram: {
      title: 'Programa de Aeronave Ativo',
      viewAll: 'Todos os Programas ({{count}})',
      phase: 'Fase Atual',
      phaseProgress: 'Progresso da Fase ({{percent}}%)',
      targetEis: 'Previsão de EIS: Ano {{year}}',
      flightOpsAction: 'Operações de Voo de Ensaio',
      specs: {
        seating: 'Capacidade de Assentos',
        range: 'Alcance do Projeto',
        listPrice: 'Preço de Tabela',
        backlog: 'Pedidos Firmes'
      }
    },
    rfpSection: {
      title: 'Oportunidades de Mercado e RFPs',
      viewAll: 'Ver Todas ({{count}})',
      empty: 'Nenhuma concorrência aberta no momento.',
      closingIn: 'Proposta encerra em {{days}} dias',
      budgetPerUnit: 'Orçamento: US$ {{amount}}M/unidade',
      action: 'Ver Proposta'
    },
    newsSection: {
      title: 'Últimas Notícias da Indústria',
      viewAll: 'Noticiário Completo',
      empty: 'Nenhuma notícia registrada ainda.'
    }
  },

  designer: {
    title: 'Estúdio de Design de Aeronaves Clean-Sheet',
    step: 'Etapa {{current}} de {{total}}: {{name}}',
    warnings: {
      highWingLoadingTitle: 'CARGA ALAR ELEVADA ({{value}} kg/m²)',
      highWingLoadingDesc: 'Exigirá velocidades mais altas na decolagem e pistas mais longas.',
      lowWingLoadingTitle: 'CARGA ALAR BAIXA ({{value}} kg/m²)',
      lowWingLoadingDesc: 'Asa maior que o necessário aumenta o peso estrutural e o arrasto de fricção em cruzeiro.',
      underpoweredTitle: 'RELAÇÃO EMPUXO-PESO INSUFICIENTE (E/P {{tw}})',
      underpoweredDesc: 'Os motores selecionados fornecem pouca margem de subida para o MTOW configurado.',
      excessiveFuelTitle: 'VOLUME DE COMBUSTÍVEL EXCESSIVO ({{pct}}% do MTOW)',
      excessiveFuelDesc: 'A massa de combustível representa uma fração desproporcional do peso total da aeronave.',
      runwayRestrictiveTitle: 'PISTA DE DECOLAGEM RESTRITIVA ({{tofl}} m)',
      runwayRestrictiveDesc: 'A distância de decolagem limita as operações a grandes aeroportos internacionais.'
    },
    why: {
      wingspan: 'Maior envergadura e aspecto aumentam o rendimento aerodinâmico e reduzem o arrasto induzido, aumentando o alcance, mas geram maior momento fletor na raiz da asa.',
      sweep: 'O enflechamento atrasa a formação de ondas de choque em velocidades transônicas (Mach 0,78–0,85), mas reduz o coeficiente de sustentação em baixas velocidades.',
      winglets: 'Dispositivos de ponta de asa dissipam os vórtices marginais, proporcionando economia de 4% a 6% no consumo de combustível em etapas longas com baixo acréscimo de peso.',
      materials: 'Compósitos de fibra de carbono reduzem expressivamente o peso da estrutura e eliminam a corrosão, porém exigem maior investimento em ferramental e autoclaves.',
      engines: 'Turbofans modernos de alta razão de diluição (BPR) diminuem o consumo específico de combustível e ruído, mas possuem diâmetro maior e maior arrasto de nacele.',
      fbw: 'Comandos Fly-By-Wire digitais oferecem proteção ativa de envelope, dispensam cabos de aço pesados e aliviam cargas estruturais durante rajadas de vento.'
    },
    deltas: {
      range: 'Variação de Alcance',
      fuelBurn: 'Variação no Consumo',
      oew: 'Variação no Peso Vazio',
      mtow: 'Variação no MTOW',
      tofl: 'Variação na Decolagem',
      unitCost: 'Variação no Custo Unitário',
      rdCost: 'Variação no Orçamento de P&D'
    }
  },

  rfp: {
    title: 'Concorrências e Pedidos de Companhias Aéreas',
    fleetRenewalTitle: 'Concorrência de Renovação da {{airline}}: {{segment}}',
    openTenders: 'RFPs em Aberto',
    activeContracts: 'Contratos de Produção Firmados',
    airline: 'Companhia Aérea',
    segment: 'Segmento Solicitado',
    quantity: 'Quantidade',
    firmAndOptions: '{{firm}} Firmes + {{options}} Opções',
    maxBudget: 'Orçamento Máximo',
    deliveryDesired: 'Entrega Desejada',
    submitBid: 'Preparar e Enviar Proposta',
    bidSubmitted: 'Proposta Enviada — Companhia Analisando',
    underReview: 'Companhia Avaliando Proposta ({{days}} dias restantes)',
    compatibility: {
      title: 'Compatibilidade da Aeronave',
      excellent: 'Excelente Compatibilidade',
      good: 'Boa Compatibilidade',
      marginal: 'Compatibilidade Limítrofe',
      incompatible: 'Incompatível'
    }
  },

  production: {
    title: 'Linhas de Montagem Final e Produção',
    subtitle: 'Gerencie taxas de montagem, investimentos em ferramental e entregas aos clientes.',
    activeLines: 'Linhas de Montagem Ativas',
    addLine: 'Comissionar Linha de Montagem (US$ 85M)',
    toolingInProgress: 'Comissionamento de Ferramental ({{days}} dias restantes)',
    status: {
      tooling: 'FERRAMENTAL EM PREPARAÇÃO',
      ready: 'PRONTA PARA PRODUÇÃO',
      producing: 'PRODUÇÃO ATIVA'
    },
    ratePerMonth: 'Meta de Produção Mensal',
    actualRate: 'Taxa Real: {{rate}} / mês',
    stations: {
      s1: { name: 'Junção e Emenda das Seções da Fuselagem', desc: 'Alinhamento a laser e rebitagem automática das seções dianteira, central e traseira.' },
      s2: { name: 'Junção Asa-Fuselagem a Laser', desc: 'Alinhamento de alta precisão e fixação da caixa de asa em titânio de alta resistência.' },
      s3: { name: 'Integração da Empenagem e Estabilizadores', desc: 'Fixação do estabilizador vertical e atuadores do estabilizador horizontal ajustável.' },
      s4: { name: 'Instalação Hidráulica, Fiação e Combustível', desc: 'Instalação de chicotes elétricos, linhas hidráulicas de alta pressão e bombas de combustível.' },
      s5: { name: 'Montagem de Cabine, Assentos e Galleys', desc: 'Instalação de poltronas, bagageiros superiores, cozinhas de bordo, lavatórios e entretenimento.' },
      s6: { name: 'Instalação dos Pilones e Motores Turbofan', desc: 'Fixação dos pilones sob as asas, suspensão dos turbofans e montagem das naceles.' },
      s7: { name: 'Ligue dos Aviônicos e Testes de Sistemas', desc: 'Inicialização do glass cockpit, calibração dos servos de comando de voo e testes de estanqueidade.' },
      s8: { name: 'Hangar de Pintura e Voo de Aceitação', desc: 'Aplicação da pintura personalizada do cliente, ensaio em ponto de solo e voo de entrega.' }
    }
  },

  testing: {
    title: 'Campanha de Ensaios em Voo e Certificação',
    subtitle: 'Conduza ensaios estáticos em solo, expansão de envelope e voos para certificação de tipo.',
    testFleet: 'Frota de Protótipos de Ensaio',
    addPrototype: 'Construir Protótipo (US$ 35M)',
    flightHours: 'Horas de Voo de Ensaio',
    envelopeExpansion: 'Expansão de Envelope de Voo',
    certProgress: 'Status da Certificação de Tipo',
    conductTest: 'Agendar Missão de Ensaio',
    sortiesRunning: 'Missão em andamento (Dia {{elapsed}}/{{total}})',
    scenarios: {
      structural_ultimate_load: { name: 'Ensaio de Carga Limite Estrutural 150%', desc: 'Atuadores hidráulicos flexionam a asa de carbono até 1,5x o limite de projeto.' },
      cabin_emergency_evacuation: { name: 'Simulação de Evacuação Total em 90 Segundos', desc: 'Evacuação de passageiros na escuridão total com 50% das saídas bloqueadas.' },
      landing_gear_rto_brakes: { name: 'Decolagem Abortada de Máxima Energia (RTO)', desc: 'Frenagem no peso máximo com freios desgastados e sem o uso de reversores.' },
      iron_bird_systems_integration: { name: 'Bancada Integrada de Sistemas Iron Bird', desc: 'Bancada em escala real alimentando aviônicos, hidráulica e atuadores.' },
      basic_handling_qualities: { name: 'Qualidades de Pilotagem Básica', desc: 'Voo inicial para verificação de compensação, resposta aos comandos e estabilidade.' },
      stall_campaign: { name: 'Estol em Baixa Velocidade e Proteção Alfa', desc: 'Exploração dos limites de ângulo de ataque, avisador de estol e proteções FBW.' },
      flutter_envelope_expansion: { name: 'Mergulho Transônico e Margem de Flutter', desc: 'Mergulho até Mach 0,93 para verificar o amortecimento aeroelástico da cauda.' },
      hot_and_high_trials: { name: 'Ensaios em Aeroportos Altos e Quentes', desc: 'Desdobramento em aeroporto de alta altitude a 38°C para validar gradientes de subida.' },
      natural_icing_campaign: { name: 'Ensaios em Condições Severas de Gelo Natural', desc: 'Busca por nuvens com água super-resfriada para testar o sistema de degelo das asas.' },
      crosswind_landing_trials: { name: 'Pousos com Vento Cruzado Rajado de 35 Nós', desc: 'Avaliação da autoridade do leme e absorção de cargas laterais do trem de pouso.' },
      autoland_cat3_validation: { name: 'Pouso Automático em Visibilidade Zero CAT IIIb', desc: 'Aproximação de precisão por instrumentos com desaceleração automática na pista.' },
      long_range_endurance_validation: { name: 'Validação de Longo Alcance ETOPS', desc: 'Voo de longa duração comprovando confiabilidade de desvio e consumo de óleo.' }
    }
  },

  news: {
    templates: {
      maidenFlight: 'O protótipo de testes do {{aircraft}} completou seu histórico voo inaugural hoje, iniciando sua campanha formal de certificação.',
      certificationGranted: 'O {{aircraft}} recebeu oficialmente a Certificação de Tipo comercial completa pelas autoridades aeronáuticas.',
      firstDelivery: 'A primeira unidade de produção do {{aircraft}} ({{msn}}) foi oficialmente entregue ao cliente de lançamento {{customer}}.',
      rfpWon: 'A {{airline}} selecionou oficialmente o {{aircraft}}, assinando contrato firme para {{quantity}} aeronaves avaliadas em US$ {{valueB}}B.',
      rfpLost: 'A {{airline}} concedeu sua concorrência de frota à {{competitor}} para {{quantity}} unidades do {{planeName}}.'
    }
  },

  settings: {
    title: 'Preferências do Aplicativo',
    language: 'Idioma / Language',
    theme: 'Tema Visual',
    darkTheme: 'Escuro Industrial (Padrão)',
    lightTheme: 'Claro Técnico',
    units: 'Unidades de Medida',
    metric: 'Métrico (km, kg, m)',
    imperial: 'Imperial (nm, lbs, ft)',
    autosave: 'Intervalo de Salvamento',
    sound: 'Efeitos Sonoros'
  }
};
