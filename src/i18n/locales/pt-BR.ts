// ============================================================================
// PROJECT AIRFRAME - DICIONÁRIO DE LOCALIZAÇÃO EM PORTUGUÊS (PT-BR)
// ============================================================================

export const ptBR = {
  common: {
    appName: 'Project Airframe',
    loading: 'Carregando ambiente de simulação aeronáutica...',
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
    inProgress: 'Em Andamento',
    pending: 'Pendente',
    open: 'Aberto',
    closed: 'Encerrado',
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
    usd: 'US$',
    reputation: 'Reputação',
    reputationLevels: {
      unknown: 'Desconhecida',
      experimental: 'Experimental',
      emerging: 'Emergente',
      proven: 'Comprovada',
      trusted: 'Confiável',
      global_supplier: 'Fornecedora Global',
      industry_leader: 'Líder da Indústria'
    }
  },

  navigation: {
    companyGroup: 'EMPRESA',
    overview: 'Visão Geral',
    organization: 'Organização',
    finance: 'Finanças',
    legacyTimeline: 'Linha do Tempo & Legado',
    
    productsGroup: 'PRODUTOS',
    aircraft: 'Programas de Aeronave',
    engines: 'Motores & Propulsão',
    flightTesting: 'Ensaios em Voo',

    commercialGroup: 'COMERCIAL',
    ordersRfps: 'Pedidos & Concorrências (RFP)',
    customers: 'Clientes & Companhias Aéreas',
    marketIntel: 'Inteligência de Mercado',

    operationsGroup: 'OPERAÇÕES',
    production: 'Linhas de Montagem Final',
    airworthiness: 'Aeronavegabilidade & Segurança',
    fleetMap: 'Mapa Operacional em Tempo Real',

    worldGroup: 'MUNDO',
    news: 'Notícias & Despachos',
    competitors: 'Concorrentes',
    saveArchive: 'Arquivo de Saves',
    settings: 'Configurações'
  },

  topbar: {
    briefing: 'INFORME EXECUTIVO',
    pause: 'Pausar Simulação',
    speed1x: '1× Velocidade Normal',
    speed2x: '2× Acelerada',
    speed4x: '4× Rápida',
    speed8x: '8× Alta Velocidade',
    speed16x: '16× Velocidade Máxima',
    speedMenu: 'Velocidade da Simulação',
    treasury: 'Tesouraria',
    runway: 'Fôlego',
    notifications: 'Notificações',
    alerts: 'Anomalia de Segurança de Voo',
    dispatches: 'Despachos da Indústria',
    manualSave: 'Salvar Simulação',
    language: 'Idioma',
    settings: 'Configurações'
  },

  company: {
    founding: {
      badge: 'PROJECT AIRFRAME // NOVA EMPRESA',
      title: 'Fundar uma Fabricante de Aeronaves',
      subtitle: 'Estabeleça sua fabricante aeroespacial comercial. Projete aviões, gerencie linhas de produção, dispute encomendas de companhias aéreas e construa um legado duradouro na aviação.',
      stepIndicator: 'Etapa {{current}} de {{total}}',
      steps: {
        identity: 'Identidade',
        headquarters: 'Sede Global',
        financing: 'Financiamento',
        philosophy: 'Filosofia',
        review: 'Revisão & Fundação'
      },
      step1: {
        title: 'Crie sua fabricante',
        desc: 'Comece definindo a identidade e a presença no mercado da sua empresa aeroespacial.',
        nameLabel: 'Nome da Fabricante',
        namePlaceholder: 'ex: Aureon Aerospace',
        tickerLabel: 'Ticker / Código de Mercado',
        tickerPlaceholder: 'ex: AUR',
        previewTitle: 'Identidade Comercial',
        previewDesc: 'Esta identificação constará nos certificados de tipo das aeronaves, listagens de mercado e contratos com companhias aéreas.'
      },
      step2: {
        title: 'Escolha sua sede global',
        desc: 'Selecione seu polo de engenharia e manufatura. O polo regional afeta a disponibilidade de engenheiros, custos de mão de obra e a proximidade da cadeia de fornecedores.',
        consequencesTitle: 'Vantagens do Polo Regional',
        engineeringTalent: 'Talento de Engenharia',
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
        title: 'Selecione o financiamento e estrutura de capital',
        desc: 'Escolha a origem do capital inicial. Um aporte maior exige maior diluição de controle acionário, maior pressão por resultados e assentos no conselho.',
        founderEquity: 'Participação do Fundador',
        boardSeats: 'Assentos no Conselho',
        growthPressure: 'Pressão por Crescimento',
        startingCapital: 'Capital Inicial',
        options: {
          bootstrapped: {
            title: 'Fundador Independente (Bootstrapped)',
            capital: 'US$ 120M',
            desc: 'Autofinanciamento. 100% de controle para o fundador, sem interferência de conselho e metas de crescimento conservadoras.'
          },
          private_equity: {
            title: 'Sindicato de Investidores Privados',
            capital: 'US$ 650M',
            desc: 'Aporte institucional equilibrado com metas de crescimento moderadas, boa rede de contatos na indústria e 2 assentos no conselho.'
          },
          venture_capital: {
            title: 'Aliança de Venture Capital',
            capital: 'US$ 950M',
            desc: 'Capital agressivo demandando rápida entrada no mercado, adoção tecnológica veloz e prazos curtos para entrada em serviço.'
          },
          industrial_group: {
            title: 'Conglomerado Industrial',
            capital: 'US$ 1,2B',
            desc: 'Parceria com grupo industrial tradicional, com acesso direto a fornecedores de aeroestruturas, ferramentais e redes de materiais.'
          },
          state_backed: {
            title: 'Fundo Soberano de Desenvolvimento',
            capital: 'US$ 1,6B',
            desc: 'Aporte soberano de grande porte com o objetivo de formar uma fabricante campeã nacional com diretrizes estratégicas de estado.'
          }
        }
      },
      step4: {
        title: 'O que deve definir sua empresa?',
        desc: 'Selecione a filosofia de engenharia e de negócios da sua empresa. Isso influencia a velocidade de P&D, os custos de produção e a percepção das companhias aéreas.',
        options: {
          engineering_excellence: {
            title: 'Excelência em Engenharia',
            desc: 'Projetar aeronaves com foco em pureza aerodinâmica, qualidade estrutural e menor consumo de combustível por assento.',
            pros: ['+15% Eficiência aerodinâmica e de combustível', '+20% Reputação de engenharia no mercado'],
            cons: ['+18% Custos mais altos de desenvolvimento em P&D']
          },
          cost_leadership: {
            title: 'Liderança em Custos & Simplicidade',
            desc: 'Entregar aviões comerciais acessíveis com baixo preço de aquisição, ferramentais ágeis e mínima complexidade fabril.',
            pros: ['-20% Custo de ferramental e montagem', '+15% Velocidade no aumento de produção'],
            cons: ['-10% Alcance comparado a rivais premium']
          },
          passenger_comfort: {
            title: 'Conforto & Espaço para o Passageiro',
            desc: 'Priorizar seções de cabine mais largas, menor altitude de cabine e isolamento acústico silencioso.',
            pros: ['+25% Preferência do passageiro pela marca', '+15% Atratividade para rotas rentáveis'],
            cons: ['+8% Peso estrutural da fuselagem']
          },
          operational_ruggedness: {
            title: 'Robustez Operacional',
            desc: 'Trem de pouso superdimensionado, alta redundância em sistemas e capacidade de operação em pistas não pavimentadas.',
            pros: ['+25% Confiabilidade de despacho em climas severos', 'Certificação para pistas secundárias e cascalho'],
            cons: ['+10% Margem de peso vazio']
          },
          technological_pioneer: {
            title: 'Pioneirismo Tecnológico',
            desc: 'Adoção avançada de envelope de voo Fly-By-Wire e arquiteturas de sistemas mais elétricos.',
            pros: ['+20% Atratividade do cockpit moderno', '+12% Extensão nos intervalos de manutenção'],
            cons: ['Maiores riscos e prazos na certificação em voo']
          }
        }
      },
      step5: {
        title: 'Revisão & Constituição da Empresa',
        desc: 'Confira as diretrizes fundamentais antes de formalizar a constituição da sua fabricante de aeronaves.',
        startingCapital: 'Caixa Líquido Inicial',
        monthlyBurnEst: 'Queima Mensal Estimada',
        founderOwnership: 'Controle do Fundador',
        headquartersLabel: 'Sede Global',
        philosophyLabel: 'Filosofia Corporativa',
        submitButton: 'Fundar {{companyName}}',
        foundingHeadline: '{{companyName}} Fundada Oficialmente',
        foundingSummary: 'A {{companyName}} foi estabelecida oficialmente em {{city}}, {{country}} com {{capital}} em capital inicial de fundação.'
      }
    }
  },

  dashboard: {
    greeting: 'Bom dia, {{companyName}}',
    briefingSubtitle: 'Sua empresa está capitalizada e pronta para ingressar no mercado de aviação comercial.',
    briefingWithProgram: 'Gerenciando {{count}} programa(s) ativo(s) a partir do seu polo em {{city}}.',
    metrics: {
      cash: 'Caixa da Tesouraria',
      runway: 'Fôlego Financeiro',
      backlog: 'Carteira de Pedidos',
      trust: 'Confiança no Mercado'
    },
    emptyState: {
      title: 'Sua Primeira Aeronave Começa Aqui',
      desc: 'Sua empresa ainda não possui nenhum programa de aeronave em andamento. Inicie o desenvolvimento do zero de um avião comercial e dispute seus primeiros clientes de frotas.',
      action: 'Iniciar Programa de Aeronave'
    },
    activeProgram: {
      title: 'Programa de Aeronave Ativo',
      viewAll: 'Todos os Programas ({{count}})',
      phase: 'Fase Atual',
      phaseProgress: 'Progresso da Fase ({{percent}}%)',
      targetEis: 'Previsão de Entrada em Serviço: Ano {{year}}',
      flightOpsAction: 'Operações de Ensaios em Voo',
      specs: {
        seating: 'Capacidade de Passageiros',
        range: 'Alcance Projetado',
        listPrice: 'Preço de Tabela',
        backlog: 'Pedidos Firmes'
      }
    },
    rfpSection: {
      title: 'Oportunidades de Mercado & Concorrências (RFP)',
      viewAll: 'Ver Todas ({{count}})',
      empty: 'Nenhuma concorrência aberta por companhias aéreas no momento.',
      closingIn: 'Proposta encerra em {{days}} dias',
      budgetPerUnit: 'Orçamento: US$ {{amount}}M/unidade',
      action: 'Ver Concorrência'
    },
    newsSection: {
      title: 'Últimas Notícias da Aviação',
      viewAll: 'Noticiário Completo',
      empty: 'Nenhum despacho de notícias registrado ainda.'
    }
  },

  designer: {
    title: 'Projeto de Aeronave do Zero',
    step: 'Etapa {{current}} de {{total}}: {{name}}',
    steps: {
      segment: 'Segmento de Mercado',
      fuselage: 'Fuselagem & Cabine',
      wing: 'Asa & Aerodinâmica',
      propulsion: 'Propulsão & Motores',
      systems: 'Aviônica & Comandos de Voo',
      materials: 'Materiais Estruturais',
      livery: 'Pintura & Identidade Visual',
      summary: 'Lançamento do Programa'
    },
    blueprint: 'Blueprint Técnico em CAD',
    projectedMetrics: 'Métricas de Engenharia Calculadas',
    mtow: 'Peso Máximo de Decolagem (MTOW)',
    oew: 'Peso Operacional Vazio (OEW)',
    fuelCapacity: 'Capacidade de Combustível',
    typicalSeats: 'Capacidade Típica de Passageiros',
    maxRange: 'Alcance Máximo',
    cruiseMach: 'Velocidade de Cruzeiro',
    takeoffDistance: 'Comprimento de Pista para Decolagem',
    estimatedDevCost: 'Custo Estimado de P&D',
    estimatedDevTime: 'Cronograma Estimado de P&D',
    listPrice: 'Preço Unitário de Tabela',
    launchProgram: 'Iniciar Desenvolvimento do Programa',
    saveDraft: 'Salvar Rascunho do Projeto'
  },

  rfp: {
    title: 'Concorrências & Encomendas de Frotas',
    openTenders: 'Concorrências Abertas (RFPs)',
    activeContracts: 'Contratos Firmados de Produção',
    airline: 'Companhia Aérea',
    segment: 'Segmento Solicitado',
    quantity: 'Quantidade',
    firmAndOptions: '{{firm}} Firmes + {{options}} Opções',
    maxBudget: 'Orçamento Máximo',
    deliveryDesired: 'Prazo Desejado',
    submitBid: 'Elaborar & Submeter Proposta',
    bidSubmitted: 'Proposta Enviada',
    importanceFactors: 'Critérios de Avaliação'
  },

  production: {
    title: 'Linhas de Montagem Final & Manufatura',
    subtitle: 'Gerencie cadência de montagem das células, investimentos em ferramentais e slots de entrega.',
    activeLines: 'Linhas de Montagem Ativas',
    addLine: 'Construir Nova Linha de Montagem',
    lineName: 'Linha de Montagem {{number}}',
    ratePerMonth: 'Cadência Mensal de Produção',
    workers: 'Mão de Obra Fabril',
    efficiency: 'Eficiência da Planta',
    monthlyOperatingCost: 'Custo Operacional Mensal'
  },

  testing: {
    title: 'Campanha de Ensaios em Voo & Certificação',
    subtitle: 'Realize ensaios estáticos em solo, expansão do envelope de voo e voos para certificação de tipo.',
    testFleet: 'Frota de Protótipos de Teste',
    addPrototype: 'Fabricar Protótipo Adicional',
    flightHours: 'Horas de Ensaios em Voo',
    certProgress: 'Progresso da Certificação de Tipo',
    conductTest: 'Executar Voo de Teste',
    groundTests: 'Ensaios Estáticos em Solo',
    envelopeExpansion: 'Expansão do Envelope de Voo',
    avionicsCert: 'Certificação de Sistemas & Aviônica',
    icingColdOps: 'Operações em Clima Extremo & Gelo'
  },

  safety: {
    title: 'Aeronavegabilidade & Segurança Operacional',
    subtitle: 'Monitoramento de confiabilidade de frota, investigações de ocorrências e diretrizes regulatórias.',
    activeFleetInService: 'Frota Ativa em Serviço',
    fleetDispatchReliability: 'Confiabilidade de Despacho da Frota',
    incidentHistory: 'Ocorrências Registradas em Operação',
    noIncidents: 'Histórico exemplar de segurança. Nenhuma anomalia ativa em serviço.',
    investigationPhase: 'Fase de Investigação',
    adDirectives: 'Diretrizes de Aeronavegabilidade (DA)'
  },

  news: {
    title: 'Noticiário Global da Aviação',
    subtitle: 'Despachos da indústria em tempo real, decisões regulatórias e movimentações de concorrentes.',
    categories: {
      all: 'Todos os Despachos',
      commercial: 'Comercial & Encomendas',
      engineering: 'Engenharia & P&D',
      safety: 'Segurança & Diretrizes',
      financial: 'Corporativo & Finanças'
    }
  },

  milestones: {
    title: 'Linha do Tempo & Legado na Aviação',
    subtitle: 'Acompanhe as conquistas históricas da sua empresa e da engenharia aeroespacial.',
    unlocked: 'Marcos Históricos Alcançados',
    locked: 'Próximos Marcos Bloqueados'
  },

  settings: {
    title: 'Preferências do Sistema',
    language: 'Idioma / Language',
    theme: 'Tema da Interface',
    darkTheme: 'Escuro Industrial (Padrão)',
    lightTheme: 'Claro Técnico',
    units: 'Unidades de Medida',
    metric: 'Métrico (km, kg, m)',
    imperial: 'Imperial (nm, lbs, ft)',
    autosave: 'Intervalo de Salvamento Automático',
    sound: 'Efeitos Sonoros'
  }
};
