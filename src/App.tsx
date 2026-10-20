/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Users, Gift, Image as ImageIcon, User, Settings, LogOut, 
  ChevronRight, ChevronLeft, ArrowLeft, ShieldCheck, Clock, CheckCircle2, Plus, 
  Camera, Video, Edit3, Smartphone, Sparkles, Menu, Eye, EyeOff,
  Filter, RotateCw, Crop, Sliders, Check, AlertCircle, Share2, Download,
  Layers, Play, ArrowRight, Home, Trash2, Save, Upload, Search, ZoomIn, X, Lock, QrCode, Copy,
  Volume2, VolumeX, MoveLeft, MoveRight, Cloud, Flame, Bell, Star, UserMinus, UserCheck,
  Compass, PartyPopper, BookOpen, HeartHandshake, TrendingUp, DollarSign, WifiOff, Wifi
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

type Screen = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'admin_dashboard' 
  | 'family_profile' 
  | 'sponsor_profile' 
  | 'child_profile' 
  | 'approval_workflow' 
  | 'waiting_area' 
  | 'gallery' 
  | 'photo_editor' 
  | 'media_management' 
  | 'settings' 
  | 'menu_drawer' 
  | 'pwa_install';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: 'Aguardando Apadrinhamento' | 'Em Análise' | 'Apadrinhado';
  likes: string;
  dream: string;
  address: string;
  image: string;
  letter: string;
  wishlist: { name: string; price: number }[];
  sponsorName?: string;
  sponsorId?: string;
}

interface LocalAppNotification {
  id: string;
  title: string;
  body: string;
  type: 'new_child' | 'status_change' | 'system';
  timestamp: string;
  read: boolean;
  childId?: string;
  childName?: string;
}

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
}

interface Media916 {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  subtitle: string;
}

interface FooterButton {
  id: string;
  label: string;
  iconName: 'home' | 'user' | 'users' | 'gift' | 'heart' | 'star' | 'sparkles' | 'video';
  targetScreenIndex?: number;
  isDonation?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  familyMessage?: string; // Mensagem carinhosa para a Família e Acolhidos
  isLoggedIn: boolean;
  password?: string;
}

interface EvangelicalTheme {
  id: string;
  name: string;
  tagline: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  iconBg: string;
  textColor: string;
  badgeBg: string;
}

interface EvangelicalMessage {
  id: string;
  verse: string;
  reference: string;
  category: string;
}

const INITIAL_EVANGELICAL_THEMES: EvangelicalTheme[] = [
  {
    id: 'luz_divina',
    name: 'Luz Divina & Esperança',
    tagline: 'Ouro Celestial & Brilho Divino',
    bgGradient: 'from-amber-950/80 via-[#2A1840] to-amber-900/60',
    borderColor: 'border-amber-400/50',
    accentColor: '#F59E0B',
    iconBg: 'bg-amber-500/20 text-amber-300',
    textColor: 'text-amber-100',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'graca_paz',
    name: 'Graça & Paz Celestial',
    tagline: 'Azul Celestial da Glória',
    bgGradient: 'from-blue-950/80 via-[#1E1738] to-cyan-900/60',
    borderColor: 'border-sky-400/50',
    accentColor: '#38BDF8',
    iconBg: 'bg-sky-500/20 text-sky-300',
    textColor: 'text-sky-100',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'amor_agape',
    name: 'Amor Ágape de Cristo',
    tagline: 'Rubi Sagrado & Rosa de Saron',
    bgGradient: 'from-rose-950/80 via-[#2A1230] to-pink-900/60',
    borderColor: 'border-rose-400/50',
    accentColor: '#F43F5E',
    iconBg: 'bg-rose-500/20 text-rose-300',
    textColor: 'text-rose-100',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'bom_pastor',
    name: 'O Bom Pastor',
    tagline: 'Verde das Pastagens & Oliva da Paz',
    bgGradient: 'from-emerald-950/80 via-[#132A25] to-teal-900/60',
    borderColor: 'border-emerald-400/50',
    accentColor: '#10B981',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
    textColor: 'text-emerald-100',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'reino_gloria',
    name: 'Reino & Glória Eterna',
    tagline: 'Púrpura Real da Salvação',
    bgGradient: 'from-purple-950/80 via-[#260E3B] to-violet-900/60',
    borderColor: 'border-purple-400/50',
    accentColor: '#A855F7',
    iconBg: 'bg-purple-500/20 text-purple-300',
    textColor: 'text-purple-100',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    id: 'aguas_vivas',
    name: 'Fontes de Águas Vivas',
    tagline: 'Turquesa da Vida & Pureza',
    bgGradient: 'from-teal-950/80 via-[#102936] to-cyan-900/60',
    borderColor: 'border-cyan-400/50',
    accentColor: '#06B6D4',
    iconBg: 'bg-cyan-500/20 text-cyan-300',
    textColor: 'text-cyan-100',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  }
];

const INITIAL_EVANGELICAL_MESSAGES: EvangelicalMessage[] = [
  {
    id: 'm1',
    verse: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.',
    reference: 'Jeremias 29:11',
    category: 'Esperança'
  },
  {
    id: 'm2',
    verse: 'Deixem vir a mim as crianças e não as impeçam; pois o Reino dos céus pertence aos que são semelhantes a elas.',
    reference: 'Mateus 19:14',
    category: 'Acolhimento'
  },
  {
    id: 'm3',
    verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta.',
    reference: '1 Coríntios 13:4,7',
    category: 'Amor'
  },
  {
    id: 'm4',
    verse: 'O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.',
    reference: 'Salmos 23:1-2',
    category: 'Paz & Proteção'
  },
  {
    id: 'm5',
    verse: 'Tudo posso naquele que me fortalece.',
    reference: 'Filipenses 4:13',
    category: 'Fé'
  },
  {
    id: 'm6',
    verse: 'Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.',
    reference: 'Provérbios 22:6',
    category: 'Educação & Cuidado'
  }
];

const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=300&fit=crop',
    title: 'Transforme um Sonho em Realidade',
    subtitle: 'Adote uma cartinha e faça uma criança sorrir neste ano.',
    badge: 'Lar Esperança'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=300&fit=crop',
    title: 'Amor que Acolhe e Protege',
    subtitle: 'Cada apadrinhamento cria um futuro cheio de possibilidades.',
    badge: 'Apadrinhamento 2026'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=300&fit=crop',
    title: 'Doe Esperança e Faça a Diferença',
    subtitle: 'Apoie o Lar Esperança com presentes ou doação via PIX.',
    badge: 'Solidariedade'
  }
];

const INITIAL_STORIES_916: Media916[] = [
  {
    id: 's1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=450&h=800&fit=crop',
    title: 'Sorriso de Ana Clara',
    subtitle: 'Momentos especiais no ateliê de artes'
  },
  {
    id: 's2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=450&h=800&fit=crop',
    title: 'Lucas e o Futebol',
    subtitle: 'Treino da tarde com os amigos'
  },
  {
    id: 's3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=450&h=800&fit=crop',
    title: 'Gabriel Construindo Sonhos',
    subtitle: 'Brincadeiras e aprendizado no Lar'
  }
];

const INITIAL_CHILDREN: Child[] = [
  {
    id: '1',
    name: 'Ana Clara Souza',
    age: 7,
    gender: 'Menina',
    status: 'Apadrinhado',
    likes: 'bonecas, livros, desenhos',
    dream: 'ser médica',
    address: 'Rua das Flores, 123 - Jardim Esperança - SP',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop',
    letter: 'Querido padrinho, meu sonho é ser médica para cuidar de todos. Gosto muito de bonecas e historinhas!',
    wishlist: [{ name: 'Boneca', price: 89.90 }, { name: 'Kit de material escolar', price: 49.90 }],
    sponsorName: 'Carlos Henrique',
    sponsorId: 'sponsor_1'
  },
  {
    id: '2',
    name: 'Lucas Pereira',
    age: 9,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    likes: 'futebol, blocos de montar, ciência',
    dream: 'ser astronauta',
    address: 'Av. Brasil, 456 - Jardim Esperança - SP',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop',
    letter: 'Olá! Adoro jogar bola e montar robôs. Quero muito ganhar uma bola nova.',
    wishlist: [{ name: 'Bola de futebol', price: 59.90 }, { name: 'Jogo de montar', price: 129.90 }]
  },
  {
    id: '3',
    name: 'Gabriel Santos',
    age: 6,
    gender: 'Menino',
    status: 'Aguardando Apadrinhamento',
    likes: 'carrinhos, super-heróis',
    dream: 'ser bombeiro',
    address: 'Rua das Palmeiras, 78 - Jardim Esperança - SP',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=400&fit=crop',
    letter: 'Gosto muito de carrinhos e quero ser bombeiro quando crescer.',
    wishlist: [{ name: 'Bicicleta', price: 299.90 }]
  }
];

const INITIAL_FOOTER_BUTTONS: FooterButton[] = [
  { id: '1', label: 'Início', iconName: 'home', targetScreenIndex: 0 },
  { id: '2', label: 'Padrinho', iconName: 'user', targetScreenIndex: 5 },
  { id: '3', label: 'Família', iconName: 'users', targetScreenIndex: 4 },
  { id: '4', label: 'Doação', iconName: 'gift', isDonation: true }
];

// Web Audio API Synthesizer (Sino de Natal)
function playFestiveChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const melody = [
      { note: 659.25, duration: 0.18, time: 0 },
      { note: 659.25, duration: 0.18, time: 0.2 },
      { note: 659.25, duration: 0.35, time: 0.4 },
      { note: 659.25, duration: 0.18, time: 0.8 },
      { note: 659.25, duration: 0.18, time: 1.0 },
      { note: 659.25, duration: 0.35, time: 1.2 },
      { note: 659.25, duration: 0.18, time: 1.6 },
      { note: 783.99, duration: 0.18, time: 1.8 },
      { note: 523.25, duration: 0.25, time: 2.0 },
      { note: 587.33, duration: 0.18, time: 2.3 },
      { note: 659.25, duration: 0.5, time: 2.5 }
    ];

    melody.forEach(({ note, duration, time }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, audioCtx.currentTime + time);
      gain.gain.setValueAtTime(0, audioCtx.currentTime + time);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + time);
      osc.stop(audioCtx.currentTime + time + duration);
    });
  } catch (e) {
    console.warn("Audio unavailable", e);
  }
}

// Web Audio API Synthesizer (Estouro Realista de Fogos de Artifício)
function playFireworkBoom() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Boom grave potente
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);

    // Ruído cintilante de fagulhas em estalo
    const bufferSize = ctx.sampleRate * 0.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(ctx.currentTime + 0.03);
  } catch (e) {
    console.warn("Audio boom error", e);
  }
}

export default function App() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0); 

  // CADASTRO E AUTENTICAÇÃO DA FAMÍLIA (Separado)
  const [familyUser, setFamilyUser] = useState<UserProfile>({
    id: 'family_1',
    name: 'Juliana e Família',
    email: 'familia@larespereanca.org',
    phone: '(11) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    bio: 'Família acolhedora dedicada a oferecer amor, apoio e um lar seguro para nossas crianças com muito carinho.',
    isLoggedIn: true
  });
  const [familyAuthMode, setFamilyAuthMode] = useState<'login' | 'register'>('login');
  const [familyLoginEmail, setFamilyLoginEmail] = useState('familia@larespereanca.org');
  const [familyLoginPassword, setFamilyLoginPassword] = useState('123456');

  // CADASTRO E AUTENTICAÇÃO DO PADRINHO (Separado)
  const [sponsorUser, setSponsorUser] = useState<UserProfile>({
    id: 'sponsor_1',
    name: 'Carlos Henrique',
    email: 'carlos@email.com',
    phone: '(11) 91234-5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    bio: 'Acredito que o carinho e o incentivo aos estudos transformam o futuro de uma criança. Muito feliz em apoiar!',
    familyMessage: 'Querida família e querido afilhado: estou imensamente feliz em apoiar vocês e fazer parte deste lindo caminho! Que as bênçãos e a paz estejam sempre presentes no seu lar.',
    isLoggedIn: true
  });
  const [sponsorAuthMode, setSponsorAuthMode] = useState<'login' | 'register'>('login');
  const [sponsorLoginEmail, setSponsorLoginEmail] = useState('carlos@email.com');
  const [sponsorLoginPassword, setSponsorLoginPassword] = useState('123456');

  // Tabs internas dos perfis
  const [familyTab, setFamilyTab] = useState<'children' | 'edit_profile' | 'account_settings'>('children');
  const [sponsorTab, setSponsorTab] = useState<'my_children' | 'sponsor_more' | 'edit_profile' | 'account_settings'>('my_children');

  // Confirmação de exclusão
  const [showFamilyExcludeConfirm, setShowFamilyExcludeConfirm] = useState(false);
  const [showSponsorExcludeConfirm, setShowSponsorExcludeConfirm] = useState(false);
  const [showFestiveButtons, setShowFestiveButtons] = useState(false);
  const [showHomeButtons, setShowHomeButtons] = useState(true);

  // Ordem personalizada dos blocos na Tela Inicial
  // order: ['banner', 'search_filters', 'stories', 'festive', 'evangelical', 'access_cards', 'children_list', 'gallery']
  const [homeCardOrder, setHomeCardOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('homeCardOrder');
      return saved ? JSON.parse(saved) : ['banner', 'search_filters', 'stories', 'festive', 'evangelical', 'children_list', 'access_cards', 'gallery'];
    } catch {
      return ['banner', 'search_filters', 'stories', 'festive', 'evangelical', 'children_list', 'access_cards', 'gallery'];
    }
  });

  const [selectedChild, setSelectedChild] = useState<Child>(INITIAL_CHILDREN[0]);
  const [notification, setNotification] = useState<string | null>('Aplicativo Lar Esperança pronto!');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<'all' | 'waiting' | 'sponsored'>('all');
  const [isBannerAutoPlay, setIsBannerAutoPlay] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Carrossel de Banners em Movimento da Tela Inicial
  const [banners, setBanners] = useState<BannerSlide[]>(INITIAL_BANNERS);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('Lar Esperança');

  // Carrossel em movimento contínuo automático
  useEffect(() => {
    if (!isBannerAutoPlay || banners.length <= 1) return;
    const bannerTimer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(bannerTimer);
  }, [banners.length, isBannerAutoPlay]);

  // Mídias Formato 9:16 (Stories / Reels)
  const [stories916, setStories916] = useState<Media916[]>(INITIAL_STORIES_916);
  const [selectedMedia916, setSelectedMedia916] = useState<Media916 | null>(null);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStorySubtitle, setNewStorySubtitle] = useState('');

  // Botões Dinâmicos do Rodapé (Editáveis, Reordenáveis e Criáveis)
  const [footerButtons, setFooterButtons] = useState<FooterButton[]>(INITIAL_FOOTER_BUTTONS);
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonIcon, setNewButtonIcon] = useState<'home' | 'user' | 'users' | 'gift' | 'heart' | 'star' | 'sparkles' | 'video'>('heart');

  // Animações Festivas (Natal, Ano Novo, Neve e Fogos)
  const [festiveMode, setFestiveMode] = useState<'christmas' | 'new_year' | 'off'>('christmas');
  const [snowIntensity, setSnowIntensity] = useState<'off' | 'light' | 'medium' | 'heavy'>('medium');
  const [snowScope, setSnowScope] = useState<'home_only' | 'all_screens'>('home_only');
  const [fireworksScope, setFireworksScope] = useState<'home_only' | 'home_sky' | 'all_screens'>('home_only');
  const [fireworksPosition, setFireworksPosition] = useState<'sky_top' | 'full_screen'>('sky_top');
  const [fireworksIntensity, setFireworksIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [isFestiveSoundEnabled, setIsFestiveSoundEnabled] = useState(true);
  const [isAdminSimulatorRunning, setIsAdminSimulatorRunning] = useState(true);

  // Splash Screen 3D de Entrada com Nuvem & Revelação do Logo
  const [isSplashEnabled, setIsSplashEnabled] = useState(true);
  const [isShowingSplash, setIsShowingSplash] = useState(true);
  const [splashColorTheme, setSplashColorTheme] = useState<
    'gold_pink' | 'blue_silver' | 'emerald_gold' | 'purple_cyan' | 'ruby_gold' | 'silver_white'
  >('gold_pink');
  const [splashPrimaryColor, setSplashPrimaryColor] = useState('#FF7EB6');
  const [splashCloudGlow, setSplashCloudGlow] = useState('#FBBF24');
  const [splashTitle, setSplashTitle] = useState('Corações que Acolhe');
  const [splashSubtitle, setSplashSubtitle] = useState('Lar Esperança • Transformando Vidas');
  const [splashStage, setSplashStage] = useState(0); // 0: nuvem 3D, 1: logo 3D, 2: nome e ação
  const [splashShowEnterButton, setSplashShowEnterButton] = useState(true); // Opção ajustável no Painel de Gestão
  const [splashAutoEnterDelay, setSplashAutoEnterDelay] = useState(4); // Segundos caso botão esteja desligado

  // Temas Evangélicos & Mensagens Bíblicas Editáveis
  const [evangelicalThemes, setEvangelicalThemes] = useState<EvangelicalTheme[]>(INITIAL_EVANGELICAL_THEMES);
  const [activeEvangelicalThemeId, setActiveEvangelicalThemeId] = useState('luz_divina');
  const [evangelicalMessages, setEvangelicalMessages] = useState<EvangelicalMessage[]>(INITIAL_EVANGELICAL_MESSAGES);
  const [activeEvangelicalMessageId, setActiveEvangelicalMessageId] = useState('m1');
  const [isEvangelicalBannerEnabled, setIsEvangelicalBannerEnabled] = useState(true);

  // Estados para Adição e Edição de Mensagens Evangélicas
  const [newVerseText, setNewVerseText] = useState('');
  const [newVerseRef, setNewVerseRef] = useState('');
  const [newVerseCategory, setNewVerseCategory] = useState('Esperança');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingVerseText, setEditingVerseText] = useState('');
  const [editingVerseRef, setEditingVerseRef] = useState('');
  const [editingVerseCategory, setEditingVerseCategory] = useState('');

  // Doação personalizada
  const [donationCustomMessage, setDonationCustomMessage] = useState(
    'Sua contribuição alimenta sonhos e mantém vivas as oportunidades de nossas crianças no Lar Esperança. Cada centavo é transformado em amor, educação e carinho.'
  );

  // PIX Settings
  const [pixKey, setPixKey] = useState('doacoes@larespereanca.org');
  const [pixBankName, setPixBankName] = useState('Banco do Brasil - Lar Esperança');
  const [pixQrCode, setPixQrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PixKey:doacoes@larespereanca.org');

  // PWA Custom Button
  const [pwaCustomIcon, setPwaCustomIcon] = useState(() => {
    try {
      return localStorage.getItem('pwaCustomIcon') || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop';
    }
  });

  const [adminTab, setAdminTab] = useState<
    'dashboard' | 'festive' | 'splash3d' | 'evangelical' | 'sponsors_families' | 'buttons' | 'media916' | 'carousel' | 'children' | 'pix' | 'gallery' | 'security' | 'settings' | 'profile'
  >('dashboard');
  
  const [adminName, setAdminName] = useState('Diretor Carlos');
  const [adminRole, setAdminRole] = useState('Coordenador Geral');
  const [adminAvatar, setAdminAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop');
  const [childrenList, setChildrenList] = useState<Child[]>(() => {
    try {
      const saved = localStorage.getItem('childrenList');
      return saved ? JSON.parse(saved) : INITIAL_CHILDREN;
    } catch {
      return INITIAL_CHILDREN;
    }
  });
  const [galleryItems, setGalleryItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('galleryItems');
      return saved ? JSON.parse(saved) : [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300&h=300&fit=crop',
      ];
    } catch {
      return [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300&h=300&fit=crop',
      ];
    }
  });
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [homeMenuAvatar, setHomeMenuAvatar] = useState(() => {
    try {
      return localStorage.getItem('homeMenuAvatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop';
    }
  });
  const [monthlyDonationsData, setMonthlyDonationsData] = useState([
    { month: 'Mai', total: 3450, doadores: 28 },
    { month: 'Jun', total: 4200, doadores: 34 },
    { month: 'Jul', total: 3900, doadores: 31 },
    { month: 'Ago', total: 5120, doadores: 42 },
    { month: 'Set', total: 6300, doadores: 49 },
    { month: 'Out', total: 7850, doadores: 63 },
  ]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildLetter, setNewChildLetter] = useState('');

  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const [notificationsList, setNotificationsList] = useState<LocalAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('localNotifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'welcome-notif',
          title: 'Sistema de Notificações Ativo 🔔',
          body: 'Você receberá alertas locais sempre que uma nova criança for cadastrada ou quando o status de apadrinhamento for atualizado.',
          type: 'system',
          timestamp: 'Hoje',
          read: false,
        }
      ];
    } catch {
      return [
        {
          id: 'welcome-notif',
          title: 'Sistema de Notificações Ativo 🔔',
          body: 'Você receberá alertas locais sempre que uma nova criança for cadastrada ou quando o status de apadrinhamento for atualizado.',
          type: 'system',
          timestamp: 'Hoje',
          read: false,
        }
      ];
    }
  });

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'new_child' | 'status_change'>('all');
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);

  // Simulação de autenticação biométrica (Placeholder)
  useEffect(() => {
    if (biometricLockEnabled && isUnlocked) {
        // Implementação real exigiria Web Authentication API ou SDKs específicos de dispositivo
        console.log("Sistema bloqueado por biometria. Aguardando verificação...");
    }
  }, [biometricLockEnabled, isUnlocked]);

  const snowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const adminFireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const triggerSimulatorExplosionRef = useRef<(() => void) | null>(null);

  const currentEvangelicalTheme = evangelicalThemes.find(t => t.id === activeEvangelicalThemeId) || evangelicalThemes[0];
  const currentEvangelicalMessage = evangelicalMessages.find(m => m.id === activeEvangelicalMessageId) || evangelicalMessages[0];

  const orderedScreens: { id: Screen; title: string; number: number }[] = [
    { id: 'home', number: 1, title: 'Tela Inicial / Home' },
    { id: 'login', number: 2, title: 'Tela de Acesso (Login)' },
    { id: 'register', number: 3, title: 'Cadastro Simples' },
    { id: 'admin_dashboard', number: 4, title: 'Painel de Gestão' },
    { id: 'family_profile', number: 5, title: 'Perfil da Família' },
    { id: 'sponsor_profile', number: 6, title: 'Perfil do Padrinho' },
    { id: 'child_profile', number: 7, title: 'Perfil da Criança' },
    { id: 'approval_workflow', number: 8, title: 'Processo de Aprovação (3 Etapas)' },
    { id: 'waiting_area', number: 9, title: 'Área de Espera' },
    { id: 'gallery', number: 10, title: 'Galeria - Fotos e Vídeos' },
    { id: 'photo_editor', number: 11, title: 'Editor de Fotos (Ajuste Automático)' },
    { id: 'media_management', number: 12, title: 'Gerenciamento de Mídias' },
    { id: 'settings', number: 13, title: 'Configurações de Cores' },
    { id: 'menu_drawer', number: 14, title: 'Menu Lateral (Perfil e Acesso)' },
    { id: 'pwa_install', number: 15, title: 'PWA - Instalação' },
  ];

  const currentScreenObj = orderedScreens[currentScreenIndex];

  // Auto-hide notification after 3.2s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Sincronização offline: Salva automaticamente lista de crianças e galeria no storage local
  useEffect(() => {
    try {
      localStorage.setItem('childrenList', JSON.stringify(childrenList));
    } catch (e) {
      console.warn('Erro ao sincronizar crianças no cache local:', e);
    }
  }, [childrenList]);

  useEffect(() => {
    try {
      localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    } catch (e) {
      console.warn('Erro ao sincronizar galeria no cache local:', e);
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('homeCardOrder', JSON.stringify(homeCardOrder));
    } catch (e) {
      console.warn('Erro ao salvar ordem dos cards:', e);
    }
  }, [homeCardOrder]);

  useEffect(() => {
    try {
      localStorage.setItem('pwaCustomIcon', pwaCustomIcon);
    } catch (e) {
      console.warn('Erro ao salvar ícone PWA:', e);
    }
  }, [pwaCustomIcon]);

  // Monitoramento de status Online / Offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNotification('Conexão restabelecida! Aplicativo online.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setNotification('Modo Offline ativado! Crianças e Galeria disponíveis via cache.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Splash progression stages & auto-enter logic: now ALWAYS auto-hides
  useEffect(() => {
    if (isShowingSplash) {
      setSplashStage(0);
      const stage1 = setTimeout(() => setSplashStage(1), 1000);
      const stage2 = setTimeout(() => setSplashStage(2), 2200);

      // Always auto-hide after delay
      const autoTimer = setTimeout(() => {
        setIsShowingSplash(false);
        if (isFestiveSoundEnabled) playFestiveChime();
      }, (splashAutoEnterDelay || 4) * 1000);

      return () => {
        clearTimeout(stage1);
        clearTimeout(stage2);
        clearTimeout(autoTimer);
      };
    }
  }, [isShowingSplash, splashAutoEnterDelay, isFestiveSoundEnabled]);

  // Auto-advance Home Carousel every 4.5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Snow Canvas Animation (Default: Only Home Screen; Protegido do Painel)
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (
      snowIntensity === 'off' || 
      currentScreenObj.id === 'admin_dashboard' || 
      (snowScope === 'home_only' && currentScreenObj.id !== 'home')
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    const flakeCount = snowIntensity === 'light' ? 25 : snowIntensity === 'medium' ? 55 : 100;
    
    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = canvas.parentElement.clientHeight || 800;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const flakes: { x: number; y: number; r: number; d: number; s: number }[] = [];
    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * (canvas.width || 400),
        y: Math.random() * (canvas.height || 800),
        r: Math.random() * 3 + 1,
        d: Math.random() * flakeCount,
        s: Math.random() * 1.2 + 0.6
      });
    }

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      angle += 0.01;
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        f.y += Math.cos(angle + f.d) + 1 + f.s;
        f.x += Math.sin(angle) * 0.8;

        if (f.x > canvas.width + 5 || f.x < -5 || f.y > canvas.height) {
          flakes[i] = {
            x: Math.random() * canvas.width,
            y: -10,
            r: f.r,
            d: f.d,
            s: f.s
          };
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [snowIntensity, snowScope, currentScreenObj.id]);

  // Fireworks Canvas Engine in New Year Mode (Ajustado no Lugar, Cristalino e 100% Isolado do Painel)
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Regra Fundamental: Os fogos NUNCA devem invadir ou cobrir o painel administrativo!
    const isExcludedScreen = currentScreenObj.id === 'admin_dashboard';
    const isNotOnHome = (fireworksScope === 'home_only' || fireworksScope === 'home_sky') && currentScreenObj.id !== 'home';

    if (festiveMode !== 'new_year' || isExcludedScreen || isNotOnHome) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Auto-ajuste de tamanho responsivo (celular, tablet e computador)
    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = canvas.parentElement.clientHeight || 800;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      trail: { x: number; y: number; alpha: number }[];
    }

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    const colors = ['#FF5964', '#FEE180', '#35A7FF', '#38BDF8', '#38EF7D', '#FF7EB6', '#FFFFFF', '#F59E0B', '#E879F9'];

    const spawnExplosion = (x: number, y: number, baseColor?: string) => {
      if (isFestiveSoundEnabled) {
        playFireworkBoom();
      }
      const count = fireworksIntensity === 'heavy' ? 55 : fireworksIntensity === 'medium' ? 38 : 24;
      const col = baseColor || colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 3.6 + 1.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.35 ? col : '#FFFFFF',
          size: Math.random() * 2.2 + 1.2,
          decay: Math.random() * 0.02 + 0.014
        });
      }
    };

    const launchRocket = () => {
      const width = canvas.width || 400;
      const height = canvas.height || 800;
      const x = Math.random() * (width * 0.76) + width * 0.12;

      // Posição Ajustada: se for Céu/Topo (ideal para o banner), explode no terço superior
      const targetY = fireworksPosition === 'sky_top' || fireworksScope === 'home_sky'
        ? Math.random() * (height * 0.32) + (height * 0.08)
        : Math.random() * (height * 0.45) + (height * 0.15);

      rockets.push({
        x,
        y: height,
        targetY,
        vy: -(Math.random() * 3.5 + 7),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    };

    const intervalTime = fireworksIntensity === 'heavy' ? 1100 : fireworksIntensity === 'medium' ? 2000 : 3500;
    const rocketInterval = setInterval(() => {
      launchRocket();
    }, intervalTime);

    // Disparo inicial suave
    launchRocket();

    let animId: number;
    const animate = () => {
      // 100% Transparente: clearRect a cada frame para NUNCA criar película escura na tela!
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualiza e desenha foguetes subindo com rastro luminoso
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, alpha: 0.9 });
        if (r.trail.length > 8) r.trail.shift();

        r.y += r.vy;

        // Rastro de faíscas translúcido
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          ctx.save();
          ctx.globalAlpha = (t / r.trail.length) * 0.55;
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(pt.x + (Math.random() - 0.5) * 2, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Cabeça brilhante do foguete
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY) {
          spawnExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Atualiza e desenha partículas de explosão
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055; // Gravidade
        p.vx *= 0.98;  // Resistência do ar
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 7;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      clearInterval(rocketInterval);
      cancelAnimationFrame(animId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [festiveMode, fireworksScope, fireworksPosition, fireworksIntensity, currentScreenObj.id, isFestiveSoundEnabled]);

  // Simulador de Fogos do Painel (Caixa de Teste Dedicada - Nunca invade o painel)
  useEffect(() => {
    if (adminTab !== 'festive') return;

    const canvas = adminFireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 320;
    canvas.height = 160;

    interface SimParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    interface SimRocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      trail: { x: number; y: number }[];
    }

    let simParticles: SimParticle[] = [];
    let simRockets: SimRocket[] = [];
    const colors = ['#FF5964', '#FEE180', '#38BDF8', '#FF7EB6', '#FFFFFF', '#38EF7D', '#F59E0B'];

    const spawnSimExplosion = (x: number, y: number, color?: string) => {
      if (isFestiveSoundEnabled) playFireworkBoom();
      const col = color || colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 35; i++) {
        const angle = (Math.PI * 2 / 35) * i;
        const speed = Math.random() * 2.8 + 1.2;
        simParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.3 ? col : '#FFFFFF',
          size: Math.random() * 2 + 1,
          decay: Math.random() * 0.025 + 0.015
        });
      }
    };

    const launchSimRocket = () => {
      const x = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.15;
      simRockets.push({
        x,
        y: canvas.height - 10,
        targetY,
        vy: -(Math.random() * 2.5 + 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    };

    triggerSimulatorExplosionRef.current = () => {
      launchSimRocket();
      setTimeout(launchSimRocket, 250);
      setNotification('🎆 Teste disparado com sucesso dentro do simulador!');
    };

    let simInterval: any = null;
    if (isAdminSimulatorRunning) {
      simInterval = setInterval(() => {
        launchSimRocket();
      }, 2600);
      launchSimRocket();
    }

    let animId: number;
    const animateSim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Estrelas cintilantes de fundo no céu do simulador
      ctx.fillStyle = '#FFFFFF';
      for (let s = 0; s < 18; s++) {
        ctx.globalAlpha = 0.3 + (s % 4) * 0.18;
        ctx.fillRect((s * 31) % canvas.width, (s * 23) % (canvas.height - 35), 1.2, 1.2);
      }
      ctx.globalAlpha = 1;

      // Foguetes no simulador
      for (let i = simRockets.length - 1; i >= 0; i--) {
        const r = simRockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 6) r.trail.shift();
        r.y += r.vy;

        for (let t = 0; t < r.trail.length; t++) {
          ctx.save();
          ctx.globalAlpha = (t / r.trail.length) * 0.6;
          ctx.fillStyle = r.color;
          ctx.beginPath();
          ctx.arc(r.trail[t].x, r.trail[t].y, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY) {
          spawnSimExplosion(r.x, r.y, r.color);
          simRockets.splice(i, 1);
        }
      }

      // Partículas no simulador
      for (let i = simParticles.length - 1; i >= 0; i--) {
        const p = simParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          simParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animateSim);
    };

    animateSim();

    return () => {
      if (simInterval) clearInterval(simInterval);
      cancelAnimationFrame(animId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [adminTab, isAdminSimulatorRunning, isFestiveSoundEnabled]);

  const triggerManualFireworks = () => {
    if (isFestiveSoundEnabled) playFireworkBoom();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { x: Math.random() * 0.5 + 0.25, y: 0.35 },
      colors: ['#FF7EB6', '#FFB942', '#38BDF8', '#FFFFFF', '#4ADE80', '#A855F7'],
      disableForReducedMotion: true
    });
    setNotification('🎆 Grande estouro de fogos de Ano Novo!');
  };

  const clearAllEffects = () => {
    const snowCtx = snowCanvasRef.current?.getContext('2d');
    if (snowCtx && snowCanvasRef.current) snowCtx.clearRect(0, 0, snowCanvasRef.current.width, snowCanvasRef.current.height);

    const fwCtx = fireworksCanvasRef.current?.getContext('2d');
    if (fwCtx && fireworksCanvasRef.current) fwCtx.clearRect(0, 0, fireworksCanvasRef.current.width, fireworksCanvasRef.current.height);

    const simCtx = adminFireworksCanvasRef.current?.getContext('2d');
    if (simCtx && adminFireworksCanvasRef.current) simCtx.clearRect(0, 0, adminFireworksCanvasRef.current.width, adminFireworksCanvasRef.current.height);

    setNotification('🧹 Todos os efeitos foram limpos da tela com sucesso!');
  };

  const handleDonationClick = () => {
    setShowDonationModal(true);
  };

  // Funções de Saída / Logout limpas e seguras
  const handleSponsorLogout = (goToHome = false) => {
    setSponsorUser(prev => ({ ...prev, isLoggedIn: false }));
    setNotification('Sessão de Padrinho finalizada com sucesso.');
    if (goToHome) {
      setCurrentScreenIndex(0);
    } else {
      setSponsorAuthMode('login');
    }
  };

  const handleFamilyLogout = (goToHome = false) => {
    setFamilyUser(prev => ({ ...prev, isLoggedIn: false }));
    setNotification('Sessão da Família finalizada com sucesso.');
    if (goToHome) {
      setCurrentScreenIndex(0);
    } else {
      setFamilyAuthMode('login');
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      // Armazena como um objeto com tipo para diferenciar imagem/vídeo se necessário no futuro
      setGalleryItems([url, ...galleryItems]);
      
      const fileType = file.type.startsWith('video') ? 'Vídeo' : 'Foto';
      setNotification(`${fileType} adicionado(a) à galeria com sucesso!`);
    }
  };

  const handlePwaIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPwaCustomIcon(reader.result);
          try {
            localStorage.setItem('pwaCustomIcon', reader.result);
            // Broadcast para sincronizar em tempo real em todas as abas/dispositivos abertos na sessão
            if (typeof BroadcastChannel !== 'undefined') {
              const channel = new BroadcastChannel('lar_esperanca_sync');
              channel.postMessage({ type: 'UPDATE_PWA_ICON', icon: reader.result });
            }
          } catch (err) {
            console.warn('Erro ao sincronizar ícone PWA:', err);
          }
          setNotification('Logo PWA atualizada em tempo real para todos os dispositivos!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Listener para sincronização automática em tempo real entre abas e instâncias PWA
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('lar_esperanca_sync');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'UPDATE_PWA_ICON' && event.data.icon) {
          setPwaCustomIcon(event.data.icon);
        }
      };
      return () => channel.close();
    }
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      const newSlide: BannerSlide = {
        id: Date.now().toString(),
        image: url,
        title: newBannerTitle || 'Novo Destaque Lar Esperança',
        subtitle: newBannerSubtitle || 'Amor e acolhimento para nossas crianças.',
        badge: newBannerBadge || 'Destaque'
      };
      setBanners([...banners, newSlide]);
      setNewBannerTitle('');
      setNewBannerSubtitle('');
      setNotification('Nova foto adicionada ao carrossel com sucesso!');
    }
  };

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setAdminAvatar(url);
      setNotification('Foto de perfil do administrador atualizada!');
    }
  };

  const handleHomeMenuAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHomeMenuAvatar(reader.result);
          try {
            localStorage.setItem('homeMenuAvatar', reader.result);
          } catch (err) {
            console.warn('LocalStorage error:', err);
          }
          setNotification('Foto do Menu Lar Esperança atualizada com sucesso!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFamilyAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setFamilyUser(prev => ({ ...prev, avatar: url }));
      setNotification('Foto da família atualizada com sucesso!');
    }
  };

  const handleSponsorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setSponsorUser(prev => ({ ...prev, avatar: url }));
      setNotification('Foto do padrinho atualizada com sucesso!');
    }
  };

  // Upload de fotos gerenciadas pelo Painel de Gestão
  const handleAdminUploadSponsorAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setSponsorUser(prev => ({ ...prev, avatar: url }));
      setNotification('Foto do Padrinho atualizada com sucesso!');
    }
  };

  const handleAdminUploadFamilyAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setFamilyUser(prev => ({ ...prev, avatar: url }));
      setNotification('Foto da Família atualizada com sucesso!');
    }
  };

  const handleStory916Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const newStory: Media916 = {
        id: Date.now().toString(),
        type: isVideo ? 'video' : 'image',
        url: url,
        title: newStoryTitle || 'Momento Especial',
        subtitle: newStorySubtitle || 'Formato 9:16 direto da galeria'
      };
      setStories916([newStory, ...stories916]);
      setNewStoryTitle('');
      setNewStorySubtitle('');
      setNotification('Mídia 9:16 adicionada com sucesso!');
    }
  };

  // Sistema de Notificações Locais (Web Notifications API + Central de Notificações)
  const sendLocalNotification = (data: {
    title: string;
    body: string;
    type: 'new_child' | 'status_change' | 'system';
    childId?: string;
    childName?: string;
  }) => {
    const newNotif: LocalAppNotification = {
      id: Date.now().toString(),
      title: data.title,
      body: data.body,
      type: data.type,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      childId: data.childId,
      childName: data.childName,
    };

    setNotificationsList(prev => [newNotif, ...prev]);
    setNotification(`${data.title} ${data.body}`);

    // Disparo nativo PWA / Navegador (se concedido)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(data.title, {
              body: data.body,
              icon: '/icon.svg',
              badge: '/icon.svg',
              tag: newNotif.id,
            });
          }).catch(() => {
            new Notification(data.title, { body: data.body, icon: '/icon.svg' });
          });
        } else {
          new Notification(data.title, { body: data.body, icon: '/icon.svg' });
        }
      } catch (err) {
        console.warn('Erro ao disparar notificação nativa:', err);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotification('Notificações nativas não suportadas neste dispositivo.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      if (permission === 'granted') {
        sendLocalNotification({
          title: 'Notificações Ativadas! 🔔',
          body: 'Você será alertado no seu dispositivo sobre novas crianças e atualizações de apadrinhamento.',
          type: 'system',
        });
      } else {
        setNotification('Permissão de notificações não concedida.');
      }
    } catch (err) {
      console.warn('Erro ao solicitar permissão de notificações:', err);
    }
  };

  const handleChangeChildStatus = (childId: string, newStatus: Child['status']) => {
    const targetChild = childrenList.find(c => c.id === childId);
    if (!targetChild) return;
    const oldStatus = targetChild.status;
    const updated = childrenList.map(c => {
      if (c.id === childId) {
        return {
          ...c,
          status: newStatus,
          sponsorName: newStatus === 'Apadrinhado' ? (c.sponsorName || sponsorUser.name || 'Padrinho Acolhedor') : undefined,
          sponsorId: newStatus === 'Apadrinhado' ? (c.sponsorId || sponsorUser.id) : undefined,
        };
      }
      return c;
    });
    setChildrenList(updated);

    sendLocalNotification({
      title: `Status de ${targetChild.name} Alterado! 🏷️`,
      body: `Status alterado de "${oldStatus}" para "${newStatus}".`,
      type: 'status_change',
      childId: targetChild.id,
      childName: targetChild.name,
    });
  };

  const handleSponsorChild = (childId: string) => {
    const targetChild = childrenList.find(c => c.id === childId);
    const updated = childrenList.map(c => {
      if (c.id === childId) {
        return { 
          ...c, 
          status: 'Apadrinhado' as const, 
          sponsorName: sponsorUser.name || 'Padrinho Acolhedor',
          sponsorId: sponsorUser.id 
        };
      }
      return c;
    });
    setChildrenList(updated);
    setNotification('Criança apadrinhada com sucesso! Você pode ver e gerenciar na sua área.');

    if (targetChild) {
      sendLocalNotification({
        title: 'Novo Apadrinhamento Confirmado! 💖',
        body: `${targetChild.name} foi apadrinhado(a)! Que este gesto transforme sua vida.`,
        type: 'status_change',
        childId: targetChild.id,
        childName: targetChild.name,
      });
    }
  };

  // Remover / Cancelar apadrinhamento de uma criança específica
  const handleRemoveSponsorship = (childId: string) => {
    const targetChild = childrenList.find(c => c.id === childId);
    const updated = childrenList.map(c => {
      if (c.id === childId) {
        return { 
          ...c, 
          status: 'Aguardando Apadrinhamento' as const, 
          sponsorName: undefined,
          sponsorId: undefined 
        };
      }
      return c;
    });
    setChildrenList(updated);
    setNotification('Apadrinhamento desvinculado com sucesso.');

    if (targetChild) {
      sendLocalNotification({
        title: 'Status Alterado: Aguardando Apadrinhamento 💛',
        body: `${targetChild.name} voltou a aguardar um novo padrinho no Lar Esperança.`,
        type: 'status_change',
        childId: targetChild.id,
        childName: targetChild.name,
      });
    }
  };

  // Exclusão de Conta da Família
  const handleExcludeFamilyAccount = () => {
    setFamilyUser({
      ...familyUser,
      isLoggedIn: false,
      name: 'Família Removida',
      email: '',
      phone: '',
      bio: 'Conta excluída a pedido do usuário.'
    });
    setShowFamilyExcludeConfirm(false);
    setCurrentScreenIndex(0);
    setNotification('Conta da família excluída do projeto.');
  };

  // Exclusão de Conta do Padrinho
  const handleExcludeSponsorAccount = () => {
    // Libera as crianças apadrinhadas
    const updated = childrenList.map(c => {
      if (c.sponsorId === sponsorUser.id) {
        return { ...c, status: 'Aguardando Apadrinhamento' as const, sponsorName: undefined, sponsorId: undefined };
      }
      return c;
    });
    setChildrenList(updated);
    setSponsorUser({
      ...sponsorUser,
      isLoggedIn: false,
      name: 'Padrinho Desvinculado',
      email: '',
      phone: '',
      bio: 'Cadastro cancelado.'
    });
    setShowSponsorExcludeConfirm(false);
    setCurrentScreenIndex(0);
    setNotification('Seu cadastro de padrinho foi cancelado com sucesso.');
  };

  // Gerenciamento de Versículos Evangélicos
  const handleAddEvangelicalMessage = () => {
    if (!newVerseText.trim() || !newVerseRef.trim()) {
      setNotification('Preencha o versículo e a referência bíblica!');
      return;
    }
    const newMsg: EvangelicalMessage = {
      id: Date.now().toString(),
      verse: newVerseText.trim(),
      reference: newVerseRef.trim(),
      category: newVerseCategory || 'Fé'
    };
    setEvangelicalMessages([...evangelicalMessages, newMsg]);
    setNewVerseText('');
    setNewVerseRef('');
    setNotification('Novo versículo bíblico adicionado!');
  };

  const handleStartEditEvangelicalMessage = (msg: EvangelicalMessage) => {
    setEditingMessageId(msg.id);
    setEditingVerseText(msg.verse);
    setEditingVerseRef(msg.reference);
    setEditingVerseCategory(msg.category);
  };

  const handleSaveEditEvangelicalMessage = () => {
    if (!editingMessageId) return;
    const updated = evangelicalMessages.map(m => {
      if (m.id === editingMessageId) {
        return {
          ...m,
          verse: editingVerseText.trim(),
          reference: editingVerseRef.trim(),
          category: editingVerseCategory.trim()
        };
      }
      return m;
    });
    setEvangelicalMessages(updated);
    setEditingMessageId(null);
    setNotification('Mensagem bíblica atualizada com sucesso!');
  };

  const handleDeleteEvangelicalMessage = (id: string) => {
    if (evangelicalMessages.length <= 1) {
      setNotification('Mantenha pelo menos um versículo cadastrado.');
      return;
    }
    const updated = evangelicalMessages.filter(m => m.id !== id);
    setEvangelicalMessages(updated);
    if (activeEvangelicalMessageId === id) {
      setActiveEvangelicalMessageId(updated[0].id);
    }
    setNotification('Mensagem bíblica removida.');
  };

  const handleCycleEvangelicalMessage = () => {
    const currentIdx = evangelicalMessages.findIndex(m => m.id === activeEvangelicalMessageId);
    const nextIdx = (currentIdx + 1) % evangelicalMessages.length;
    setActiveEvangelicalMessageId(evangelicalMessages[nextIdx].id);
    setNotification(`Versículo: ${evangelicalMessages[nextIdx].reference}`);
  };

  // Gerenciamento de Botões Dinâmicos do Rodapé
  const handleAddFooterButton = () => {
    if (!newButtonLabel.trim()) return;
    const newBtn: FooterButton = {
      id: Date.now().toString(),
      label: newButtonLabel.trim(),
      iconName: newButtonIcon,
      targetScreenIndex: 0
    };
    setFooterButtons([...footerButtons, newBtn]);
    setNewButtonLabel('');
    setNotification(`Botão "${newBtn.label}" criado com sucesso!`);
  };

  const handleRemoveFooterButton = (id: string) => {
    if (footerButtons.length <= 1) {
      setNotification('Mantenha pelo menos um botão no rodapé.');
      return;
    }
    setFooterButtons(footerButtons.filter(b => b.id !== id));
    setNotification('Botão removido.');
  };

  const handleMoveFooterButton = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= footerButtons.length) return;
    const reordered = [...footerButtons];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setFooterButtons(reordered);
  };

  const renderIcon = (name: string, className = "w-4 h-4") => {
    switch (name) {
      case 'home': return <Home className={className} />;
      case 'user': return <User className={className} />;
      case 'users': return <Users className={className} />;
      case 'gift': return <Gift className={className} />;
      case 'star': return <Star className={className} />;
      case 'sparkles': return <Sparkles className={className} />;
      case 'video': return <Video className={className} />;
      case 'heart':
      default:
        return <Heart className={className} />;
    }
  };

  // Cores do Tema da Abertura 3D
  const getSplashThemeStyles = () => {
    switch (splashColorTheme) {
      case 'blue_silver':
        return {
          bgGradient: 'from-[#030B1E] via-[#0F1E3D] to-[#050D24]',
          glow: 'rgba(56, 189, 248, 0.55)',
          logoGrad: 'from-blue-300 via-sky-200 to-indigo-100',
          cloudTint: 'text-sky-300/40',
          accent: '#38BDF8',
          name: 'Azul Celestial & Prata'
        };
      case 'emerald_gold':
        return {
          bgGradient: 'from-[#031D12] via-[#063321] to-[#02140C]',
          glow: 'rgba(52, 211, 153, 0.55)',
          logoGrad: 'from-emerald-300 via-amber-200 to-yellow-100',
          cloudTint: 'text-emerald-300/40',
          accent: '#34D399',
          name: 'Esmeralda & Ouro'
        };
      case 'purple_cyan':
        return {
          bgGradient: 'from-[#140529] via-[#2A0C4F] to-[#0E031E]',
          glow: 'rgba(192, 132, 252, 0.55)',
          logoGrad: 'from-purple-300 via-pink-300 to-cyan-200',
          cloudTint: 'text-purple-300/40',
          accent: '#C084FC',
          name: 'Púrpura & Ciano'
        };
      case 'ruby_gold':
        return {
          bgGradient: 'from-[#280509] via-[#450A10] to-[#160205]',
          glow: 'rgba(239, 68, 68, 0.55)',
          logoGrad: 'from-red-400 via-amber-300 to-yellow-100',
          cloudTint: 'text-red-400/40',
          accent: '#EF4444',
          name: 'Vermelho Rubi & Ouro'
        };
      case 'silver_white':
        return {
          bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0B0F19]',
          glow: 'rgba(226, 232, 240, 0.55)',
          logoGrad: 'from-slate-100 via-amber-200 to-white',
          cloudTint: 'text-slate-200/45',
          accent: '#E2E8F0',
          name: 'Branco Polar & Cristal'
        };
      case 'gold_pink':
      default:
        return {
          bgGradient: 'from-[#0B0518] via-[#1E0B38] to-[#0D071E]',
          glow: 'rgba(244, 114, 182, 0.55)',
          logoGrad: 'from-pink-300 via-amber-200 to-white',
          cloudTint: 'text-pink-300/35',
          accent: '#FF7EB6',
          name: 'Dourado & Rosa Neon'
        };
    }
  };

  const splashTheme = getSplashThemeStyles();

  return (
    <div className="w-full min-h-screen bg-[#0D071E] text-white font-sans select-none relative overflow-x-hidden flex flex-col">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-pink-600 to-amber-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Offline Status Badge */}
      {!isOnline && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-amber-600/90 text-white px-3.5 py-1.5 rounded-full shadow-lg border border-amber-400/40 flex items-center space-x-2 text-[11px] font-bold animate-pulse backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5 text-white" />
          <span>Modo Offline — Crianças e Galeria ativas via cache</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3D MOTION SPLASH SCREEN RESPONSIVA COM NUVEM & LOGO 3D */}
      {/* ==================================================== */}
      {isSplashEnabled && isShowingSplash && (
        <div className={`fixed inset-0 z-[60] bg-gradient-to-b ${splashTheme.bgGradient} flex flex-col items-center justify-center p-0`}>
          
          {/* NUVEM EM CRESCIMENTO 3D E MOVIMENTO RESPONSIVO */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Núcleo volumétrico de luz e névoa */}
            <div 
              className="w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] rounded-full blur-3xl opacity-50 duration-1000 animate-glow-pulse"
              style={{ backgroundColor: splashCloudGlow }}
            />
            {/* Nuvens 3D em expansão com escala responsiva */}
            <div className="absolute transform scale-[1.5] sm:scale-[2.0] md:scale-[2.6] lg:scale-[3.2] opacity-40 animate-cloud-3d">
              <Cloud className={`w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 ${splashTheme.cloudTint} blur-md`} />
            </div>
            <div className="absolute -top-12 -left-12 sm:-top-16 sm:-left-16 transform scale-[1.5] sm:scale-[2.0] md:scale-[2.5] opacity-30 animate-pulse duration-1000">
              <Cloud className={`w-56 h-56 sm:w-72 sm:h-72 md:w-88 md:h-88 ${splashTheme.cloudTint} blur-xl`} />
            </div>
            <div className="absolute -bottom-12 -right-12 sm:-bottom-16 sm:-right-16 transform scale-[1.5] sm:scale-[2.0] md:scale-[2.5] opacity-30 animate-pulse duration-700">
              <Cloud className={`w-56 h-56 sm:w-72 sm:h-72 md:w-88 md:h-88 ${splashTheme.cloudTint} blur-xl`} />
            </div>
          </div>

          {/* LOGO 3D CHEGANDO COM PROFUNDIDADE, BRILHO E REVELAÇÃO DO NOME */}
          <div className="relative z-10 flex flex-col items-center text-center p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl w-full">
            
            {/* LOGO EM DESTAQUE 3D RESPONSIVO */}
            <div 
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl p-2 sm:p-2.5 mb-4 sm:mb-6 transition-all duration-700 transform hover:scale-105 animate-logo-3d shadow-2xl shrink-0"
              style={{
                background: `linear-gradient(135deg, ${splashPrimaryColor}, ${splashCloudGlow}, #9333EA)`,
                boxShadow: `0 0 70px ${splashTheme.glow}`
              }}
            >
              <div className="w-full h-full bg-[#1A1033] rounded-[20px] sm:rounded-[24px] flex items-center justify-center border border-white/30 backdrop-blur-md">
                <Heart className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 animate-pulse" style={{ color: splashPrimaryColor, fill: splashPrimaryColor }} />
              </div>
            </div>

            {/* SLOGAN & NOME DO PROJETO COM EFEITO DE REVELAÇÃO */}
            <span className="px-3 sm:px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase mb-2 sm:mb-3 shadow backdrop-blur-md text-amber-200">
              {splashSubtitle}
            </span>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${splashTheme.logoGrad} drop-shadow-2xl`}>
              {splashTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-200 mt-2 max-w-md italic leading-relaxed">
              "Toda criança merece sentir o amor e o aconchego de uma família."
            </p>

            {/* BOTÃO PARA ENTRAR OU TRANSIÇÃO AUTOMÁTICA (CONFIGURÁVEL NO PAINEL) */}
            {splashShowEnterButton ? (
              <button 
                onClick={() => { 
                  setIsShowingSplash(false); 
                  if (isFestiveSoundEnabled) playFestiveChime(); 
                }}
                className="mt-6 sm:mt-8 px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-2xl active:scale-[0.98] transition-transform flex items-center space-x-2 text-white"
                style={{
                  background: `linear-gradient(to right, ${splashPrimaryColor}, ${splashCloudGlow})`
                }}
              >
                <span>Entrar no Aplicativo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="mt-6 sm:mt-8 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2 text-xs text-purple-200">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Carregando e entrando automaticamente...</span>
                </div>
                <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (splashStage + 1) * 35)}%`,
                      background: `linear-gradient(to right, ${splashPrimaryColor}, ${splashCloudGlow})`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zoom Modal for Safe High-Res Viewing without Download */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4" onClick={() => setZoomedImage(null)}>
          <div className="relative max-w-lg w-full bg-[#1A1033] rounded-3xl p-3 border border-purple-500/40 shadow-2xl" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
            <button onClick={() => setZoomedImage(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-purple-900/80 text-white hover:bg-purple-800 active:scale-[0.98] transition">
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none pointer-events-none mb-3">
              <img src={zoomedImage} alt="Zoomed" className="w-full h-full object-contain select-none pointer-events-none" />
            </div>
            <p className="text-center text-xs text-purple-300 font-medium">Visualização segura com zoom ativado (Download e salvamento desativados por segurança).</p>
          </div>
        </div>
      )}

      {/* Modal Visualizador 9:16 (Stories/Reels) */}
      {selectedMedia916 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4" onClick={() => setSelectedMedia916(null)}>
          <div className="relative w-full max-w-xs aspect-[9/16] bg-[#1A1033] rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
            <button onClick={() => setSelectedMedia916(null)} className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 active:scale-[0.98] transition">
              <X className="w-4 h-4" />
            </button>
            <img src={selectedMedia916.url} alt={selectedMedia916.title} className="w-full h-full object-cover select-none pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold w-fit mb-1.5 shadow">
                Momento 9:16
              </span>
              <h3 className="text-base font-bold text-white drop-shadow">{selectedMedia916.title}</h3>
              <p className="text-xs text-purple-200 mt-0.5 leading-relaxed drop-shadow">{selectedMedia916.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de Exclusão da Família */}
      {showFamilyExcludeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A1033] rounded-3xl p-5 border border-red-500/40 shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>Confirmar Exclusão de Família</span>
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              Tem certeza que deseja solicitar o encerramento do cadastro da sua família acolhedora? Seus dados serão removidos com segurança.
            </p>
            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => setShowFamilyExcludeConfirm(false)} 
                className="flex-1 py-2.5 rounded-xl bg-purple-900/60 text-purple-200 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleExcludeFamilyAccount} 
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow active:scale-[0.98]"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de Exclusão do Padrinho */}
      {showSponsorExcludeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A1033] rounded-3xl p-5 border border-red-500/40 shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>Confirmar Exclusão de Padrinho</span>
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              Tem certeza que deseja solicitar o cancelamento do seu cadastro de padrinho? Suas crianças apadrinhadas ficarão livres para novos acolhedores.
            </p>
            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => setShowSponsorExcludeConfirm(false)} 
                className="flex-1 py-2.5 rounded-xl bg-purple-900/60 text-purple-200 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleExcludeSponsorAccount} 
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow active:scale-[0.98]"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIX Donation Modal with Editable Message */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1A1033] rounded-3xl p-6 border border-purple-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-purple-900/60">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Doação via PIX</h3>
              </div>
              <button onClick={() => setShowDonationModal(false)} className="p-2 rounded-xl bg-purple-900/60 text-purple-200 active:scale-[0.98]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-600/20 to-amber-500/20 border border-pink-500/30 text-xs text-purple-100 italic">
                "{donationCustomMessage}"
              </div>

              <div className="w-40 h-40 mx-auto bg-white p-2 rounded-2xl shadow-inner select-none pointer-events-none" onContextMenu={(e) => e.preventDefault()}>
                <img src={pixQrCode} alt="QR Code PIX" className="w-full h-full object-contain select-none pointer-events-none" />
              </div>
              <div className="bg-[#2A1840] p-3 rounded-2xl border border-purple-500/30 text-left space-y-1">
                <span className="text-[10px] text-purple-300 block font-medium">{pixBankName}</span>
                <span className="text-xs font-bold text-amber-300 block select-all">{pixKey}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard?.writeText(pixKey);
                setNotification('Chave PIX copiada para a área de transferência!');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Chave PIX</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full min-h-screen flex-1 bg-[#140C26] flex flex-col relative overflow-x-hidden">
        
        {/* Canvas de Neve de Natal (Isolado e Seguro: Não atrapalha o Painel) */}
        {snowIntensity !== 'off' && 
         currentScreenObj.id !== 'admin_dashboard' && 
         (snowScope !== 'home_only' || currentScreenObj.id === 'home') && (
          <canvas 
            ref={snowCanvasRef}
            className="absolute inset-0 pointer-events-none z-20"
          />
        )}

        {/* Canvas de Fogos de Artifício de Ano Novo (Ajustado no Lugar e 100% Isolado do Painel) */}
        {festiveMode === 'new_year' && 
         currentScreenObj.id !== 'admin_dashboard' && 
         (fireworksScope !== 'home_only' || currentScreenObj.id === 'home') && (
          <canvas 
            ref={fireworksCanvasRef}
            className={`absolute pointer-events-none z-10 transition-all duration-300 ${
              fireworksPosition === 'sky_top' || fireworksScope === 'home_sky'
                ? 'top-0 left-0 right-0 h-[48%]'
                : 'inset-0'
            }`}
          />
        )}

        {/* ==================================================== */}
        {/* 1. TELA INICIAL (HOME) */}
        {/* ==================================================== */}
        {currentScreenObj.id === 'home' && (
          <div className="flex-1 w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#140C26] overflow-y-auto overflow-x-hidden">
            <div className="space-y-3.5 w-full max-w-5xl mx-auto flex-1">
              
              {/* 1. TOPO COM NOME */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsHomeMenuOpen(true)}
                    className="p-2.5 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] transition shadow"
                    title="Menu Lateral"
                  >
                    <Menu className="w-5 h-5 text-pink-400" />
                  </button>
                  <div>
                    <h1 className="text-base font-black tracking-tight text-white flex items-center space-x-1.5">
                      <span>Corações que Acolhe</span>
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    </h1>
                    <span className="text-[10px] text-purple-300 font-medium">Lar Esperança • Transformando Vidas</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      if (isFestiveSoundEnabled) playFestiveChime();
                      setIsFestiveSoundEnabled(!isFestiveSoundEnabled);
                      setNotification(isFestiveSoundEnabled ? 'Som desativado' : 'Som festivo ativado');
                    }}
                    className={`p-2 rounded-xl border transition ${isFestiveSoundEnabled ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-purple-900/40 text-purple-400 border-purple-800'}`}
                    title="Som Festivo"
                  >
                    {isFestiveSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. ABAIXO: CARROSSEL EM MOVIMENTO (Com Auto-play e Interatividade) */}
              {banners.length > 0 && (
                <div 
                  className="relative w-full h-44 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 group"
                  onMouseEnter={() => setIsBannerAutoPlay(false)}
                  onMouseLeave={() => setIsBannerAutoPlay(true)}
                  onTouchStart={() => setIsBannerAutoPlay(false)}
                  onTouchEnd={() => setIsBannerAutoPlay(true)}
                >
                  <div 
                    className="w-full h-full relative cursor-pointer select-none pointer-events-auto"
                    onClick={() => setZoomedImage(banners[activeBannerIndex]?.image)}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img 
                      src={banners[activeBannerIndex]?.image} 
                      alt="Banner" 
                      className="w-full h-full object-cover transition-transform duration-700 select-none pointer-events-none group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 mb-1.5">
                        {banners[activeBannerIndex]?.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold shadow">
                            {banners[activeBannerIndex]?.badge}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-black/50 text-amber-300 text-[9px] font-semibold flex items-center space-x-1 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Em movimento</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white drop-shadow leading-snug">{banners[activeBannerIndex]?.title}</h3>
                      <p className="text-[11px] text-purple-200 mt-0.5 line-clamp-2 leading-relaxed drop-shadow">{banners[activeBannerIndex]?.subtitle}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-black/60 text-white hover:bg-pink-600/80 active:scale-[0.98] transition shadow z-10"
                    title="Banner Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-black/60 text-white hover:bg-pink-600/80 active:scale-[0.98] transition shadow z-10"
                    title="Próximo Banner"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 pointer-events-auto">
                    {banners.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBannerIndex(dotIdx);
                        }}
                        className={`h-1.5 rounded-full transition-all ${dotIdx === activeBannerIndex ? 'w-4 bg-pink-400' : 'w-1.5 bg-white/50'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 3. EM BAIXO: BARRA DE PESQUISA */}
              <div className="space-y-2 pt-0.5">
                <div className="relative flex items-center bg-[#2A1840] border border-purple-500/30 focus-within:border-pink-500 rounded-2xl px-3.5 py-2.5 shadow transition">
                  <Search className="w-4 h-4 text-pink-400 shrink-0 mr-2.5" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar crianças, cartinhas, pedidos de Natal..."
                    className="w-full bg-transparent text-xs text-white placeholder-purple-300/60 focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition"
                      title="Limpar Busca"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtros Rápidos da Pesquisa */}
                <div className="flex items-center space-x-1.5 text-[10px]">
                  <button 
                    onClick={() => setSearchCategoryFilter('all')}
                    className={`px-3 py-1 rounded-xl font-bold transition ${searchCategoryFilter === 'all' ? 'bg-pink-600 text-white shadow' : 'bg-[#2A1840] text-purple-300 border border-purple-500/20'}`}
                  >
                    Todas ({childrenList.length})
                  </button>
                  <button 
                    onClick={() => setSearchCategoryFilter('waiting')}
                    className={`px-3 py-1 rounded-xl font-bold transition ${searchCategoryFilter === 'waiting' ? 'bg-amber-500 text-black shadow' : 'bg-[#2A1840] text-purple-300 border border-purple-500/20'}`}
                  >
                    Aguardando ({childrenList.filter(c => c.status === 'Aguardando Apadrinhamento').length})
                  </button>
                  <button 
                    onClick={() => setSearchCategoryFilter('sponsored')}
                    className={`px-3 py-1 rounded-xl font-bold transition ${searchCategoryFilter === 'sponsored' ? 'bg-emerald-600 text-white shadow' : 'bg-[#2A1840] text-purple-300 border border-purple-500/20'}`}
                  >
                    Apadrinhadas ({childrenList.filter(c => c.status === 'Apadrinhado').length})
                  </button>
                </div>
              </div>

              {/* 4. DEPOIS: VÍDEOS E FOTOS 9:16 (Momentos & Histórias) */}
              {stories916.length > 0 && (
                <div className="pt-0.5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Video className="w-4 h-4 text-pink-400" />
                      <span>Vídeos e Fotos 9:16</span>
                    </h3>
                    <span className="text-[10px] text-purple-300">Toque para ver</span>
                  </div>

                  <div className="flex space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {stories916.map((st) => (
                      <div 
                        key={st.id}
                        onClick={() => setSelectedMedia916(st)}
                        className="w-20 h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-pink-500 relative cursor-pointer active:scale-95 transition shadow-lg group select-none pointer-events-auto"
                      >
                        <img src={st.url} alt={st.title} className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                          <span className="text-[9px] font-bold text-white truncate drop-shadow">{st.title}</span>
                          <span className="text-[8px] text-amber-300 flex items-center space-x-0.5">
                            {st.type === 'video' ? <Play className="w-2 h-2 fill-amber-300" /> : <ImageIcon className="w-2 h-2" />}
                            <span>{st.type === 'video' ? 'Vídeo' : 'Foto'}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. DEMAIS COISAS UMA ABAIXO DA OUTRA: */}
              
              {/* 5.1 Seletor Rápido Festivo (Natal / Ano Novo / Entrada 3D) */}
              {showFestiveButtons && (
                <div className="flex items-center space-x-1.5 bg-[#2A1840] p-1.5 rounded-2xl border border-purple-500/30 text-[10px]">
                  <button 
                    onClick={() => {
                      if (festiveMode === 'christmas') {
                        setFestiveMode('off');
                        clearAllEffects();
                        setNotification('Tema festivo desligado');
                      } else {
                        setFestiveMode('christmas');
                        if (isFestiveSoundEnabled) playFestiveChime();
                        setNotification('🎄 Modo Natal Ativado! Neve caindo suavemente.');
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition flex items-center justify-center space-x-1 ${festiveMode === 'christmas' ? 'bg-red-600 text-white shadow' : 'text-purple-300'}`}
                  >
                    <span>🎄 Natal</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (festiveMode === 'new_year') {
                        setFestiveMode('off');
                        clearAllEffects();
                        setNotification('Tema festivo desligado');
                      } else {
                        setFestiveMode('new_year');
                        if (isFestiveSoundEnabled) playFireworkBoom();
                        setNotification('🎆 Modo Ano Novo Ativado! Fogos iluminando o céu.');
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition flex items-center justify-center space-x-1 ${festiveMode === 'new_year' ? 'bg-amber-500 text-black shadow' : 'text-purple-300'}`}
                  >
                    <PartyPopper className="w-3 h-3" />
                    <span>Ano Novo</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsShowingSplash(true);
                      if (isFestiveSoundEnabled) playFestiveChime();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-900/80 text-pink-300 font-semibold border border-pink-500/30 flex items-center space-x-1 active:scale-[0.98]"
                    title="Testar Abertura 3D"
                  >
                    <Cloud className="w-3 h-3 text-pink-400" />
                    <span>Entrada 3D</span>
                  </button>
                </div>
              )}

              {/* 5.2 Card de Tema Evangélico & Versículo Bíblico do Dia */}
              {isEvangelicalBannerEnabled && (
                <div className={`p-3.5 rounded-3xl bg-gradient-to-r ${currentEvangelicalTheme.bgGradient} border ${currentEvangelicalTheme.borderColor} shadow-xl relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-xl ${currentEvangelicalTheme.iconBg} flex items-center justify-center shadow`}>
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wide uppercase text-amber-200">
                        {currentEvangelicalTheme.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${currentEvangelicalTheme.badgeBg}`}>
                        {currentEvangelicalMessage.category}
                      </span>
                      <button 
                        onClick={handleCycleEvangelicalMessage}
                        className="p-1 rounded-lg bg-black/40 text-white/80 hover:text-white hover:bg-black/60 active:scale-[0.98] transition"
                        title="Ver Outro Versículo"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-xs ${currentEvangelicalTheme.textColor} italic leading-relaxed pt-1`}>
                    "{currentEvangelicalMessage.verse}"
                  </p>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/10">
                    <span className="text-[10px] font-bold text-amber-300">
                      📖 {currentEvangelicalMessage.reference}
                    </span>
                    <button 
                      onClick={handleCycleEvangelicalMessage} 
                      className="text-[10px] text-amber-200/90 underline font-medium hover:text-white"
                    >
                      Próxima Mensagem →
                    </button>
                  </div>
                </div>
              )}

              {/* 5.3 Crianças & Cartinhas (AGORA ACIMA DOS ACESSOS) */}
              <div className="pt-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>Cartinhas de Natal das Crianças</span>
                  </h3>
                  <button onClick={() => setCurrentScreenIndex(9)} className="text-[10px] text-purple-300 underline">Ver todas</button>
                </div>

                {(() => {
                  const q = searchQuery.toLowerCase().trim();
                  const filtered = childrenList.filter(child => {
                    const matchesQuery = !q || 
                      child.name.toLowerCase().includes(q) || 
                      child.dream.toLowerCase().includes(q) || 
                      child.letter.toLowerCase().includes(q);
                    if (!matchesQuery) return false;
                    if (searchCategoryFilter === 'waiting') return child.status === 'Aguardando Apadrinhamento';
                    if (searchCategoryFilter === 'sponsored') return child.status === 'Apadrinhado';
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-4 rounded-2xl bg-[#2A1840] border border-purple-500/20 text-center text-xs text-purple-300">
                        Nenhuma criança encontrada para "{searchQuery}".
                        <button onClick={() => { setSearchQuery(''); setSearchCategoryFilter('all'); }} className="block mx-auto mt-1 text-pink-400 underline">
                          Limpar busca
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {filtered.slice(0, 4).map((child) => (
                        <div key={child.id} className="p-3 rounded-2xl bg-[#2A1840] border border-purple-500/30 flex items-center justify-between shadow">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl overflow-hidden border border-pink-500 select-none pointer-events-auto cursor-pointer"
                              onClick={() => setZoomedImage(child.image)}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              <img src={child.image} alt={child.name} className="w-full h-full object-cover select-none pointer-events-none" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{child.name}</h4>
                              <p className="text-[10px] text-purple-300">{child.age} anos • Sonho: {child.dream}</p>
                              <span className={`text-[9px] font-semibold ${child.status === 'Apadrinhado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {child.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1.5">
                            <button 
                              onClick={() => { setSelectedChild(child); setCurrentScreenIndex(6); }}
                              className="px-3 py-1.5 rounded-xl bg-purple-900/80 text-pink-300 text-[10px] font-semibold active:scale-[0.98] transition shadow"
                            >
                              Ver Carta
                            </button>
                            <button 
                              onClick={() => handleSponsorChild(child.id)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white text-[10px] font-bold active:scale-[0.98] transition shadow"
                            >
                              Apadrinhar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {showHomeButtons && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span>Acesso & Cadastros Separados</span>
                    </h3>
                    <span className="text-[10px] text-purple-300">Áreas Independentes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Card do Padrinho */}
                    <div className="p-3 rounded-2xl bg-gradient-to-b from-[#2A1840] to-[#1F1033] border border-pink-500/40 shadow-lg flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <User className="w-4 h-4 text-pink-400" />
                          <h4 className="text-xs font-bold text-white">Área do Padrinho</h4>
                        </div>
                        <p className="text-[9px] text-purple-200 line-clamp-2 leading-relaxed">
                          {sponsorUser.isLoggedIn 
                            ? `Logado como ${sponsorUser.name}. Gerencie suas crianças.` 
                            : 'Apadrinhe cartinhas e transforme futuros com amor.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setCurrentScreenIndex(sponsorUser.isLoggedIn ? 5 : 1)}
                        className="w-full py-1.5 rounded-xl bg-pink-600 text-white text-[10px] font-bold active:scale-[0.98] transition shadow"
                      >
                        {sponsorUser.isLoggedIn ? 'Acessar Área' : 'Entrar / Cadastrar'}
                      </button>
                    </div>

                    {/* Card da Família */}
                    <div className="p-3 rounded-2xl bg-gradient-to-b from-[#2A1840] to-[#1F1033] border border-purple-500/40 shadow-lg flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <Users className="w-4 h-4 text-amber-400" />
                          <h4 className="text-xs font-bold text-white">Área da Família</h4>
                        </div>
                        <p className="text-[9px] text-purple-200 line-clamp-2 leading-relaxed">
                          {familyUser.isLoggedIn 
                            ? `Família de ${familyUser.name}. Acompanhe os padrinhos.` 
                            : 'Cadastre sua família acolhedora e edite cartas.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setCurrentScreenIndex(familyUser.isLoggedIn ? 4 : 1)}
                        className="w-full py-1.5 rounded-xl bg-amber-600 text-white text-[10px] font-bold active:scale-[0.98] transition shadow"
                      >
                        {familyUser.isLoggedIn ? 'Acessar Área' : 'Entrar / Cadastrar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Galeria de Fotos Protegida */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Galeria</span>
                  </h3>
                  <button onClick={() => setCurrentScreenIndex(9)} className="text-[10px] text-purple-300 underline">Ver todas</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {galleryItems.slice(0, 4).map((img, idx) => (
                    <div 
                      key={idx} 
                      className="h-28 rounded-2xl overflow-hidden border border-purple-500/30 relative select-none pointer-events-auto cursor-pointer group shadow"
                      onClick={() => setZoomedImage(img)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <img src={img} alt="Galeria" className="w-full h-full object-cover select-none pointer-events-none" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Rodapé Dinâmico com Botões Customizáveis e Reordenáveis (Apenas na Tela Inicial) */}
            <div className="pt-3 mt-4 border-t border-purple-900/60 grid grid-flow-col auto-cols-fr gap-1 text-[10px] w-full max-w-5xl mx-auto">
              {footerButtons.map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => {
                    if (btn.isDonation) {
                      handleDonationClick();
                    } else if (typeof btn.targetScreenIndex === 'number') {
                      setCurrentScreenIndex(btn.targetScreenIndex);
                    }
                  }} 
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl active:scale-[0.98] transition-transform font-medium shadow border ${
                    btn.isDonation 
                      ? 'bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold border-pink-500/40' 
                      : btn.targetScreenIndex === currentScreenIndex 
                        ? 'bg-pink-600/20 border-pink-500/40 text-pink-300 font-bold' 
                        : 'bg-[#2A1840] border-purple-500/30 text-purple-200 hover:bg-purple-800'
                  }`}
                >
                  {renderIcon(btn.iconName, `w-4 h-4 mb-0.5 ${btn.isDonation ? 'text-white' : 'text-pink-400'}`)}
                  <span className="truncate max-w-[65px]">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. LOGIN SCREEN (GERAL) */}
        {currentScreenObj.id === 'login' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-[#1A1033]">
            <div className="pt-6">
              <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] transition-transform shadow mb-6"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold">Acessar Conta Geral</h2>
              <p className="text-xs text-purple-300 mt-1">Entre para acessar as funcionalidades do projeto.</p>
            </div>

            <div className="space-y-4 my-auto">
              <div className="space-y-1">
                <label className="text-xs text-purple-300">E-mail</label>
                <input type="email" defaultValue="usuario@email.com" className="w-full bg-[#2A1840] border border-purple-500/30 rounded-2xl px-4 py-3 text-xs text-white shadow" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-purple-300">Senha</label>
                <input type="password" defaultValue="********" className="w-full bg-[#2A1840] border border-purple-500/30 rounded-2xl px-4 py-3 text-xs text-white shadow" />
              </div>

              <button onClick={() => { setNotification('Login realizado!'); setCurrentScreenIndex(0); }} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98] transition-transform">
                Entrar
              </button>
            </div>

            <div className="text-center pb-4">
              <button onClick={() => setCurrentScreenIndex(2)} className="text-xs text-pink-400 underline font-medium">
                Criar Nova Conta
              </button>
            </div>
          </div>
        )}

        {/* 3. REGISTER SCREEN (GERAL) */}
        {currentScreenObj.id === 'register' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-[#1A1033]">
            <div className="pt-6">
              <button onClick={() => setCurrentScreenIndex(1)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] transition-transform shadow mb-6"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold">Criar Nova Conta</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">Bem-vindo</h2>
                  <p className="text-xs text-purple-300">Acesse sua conta para continuar.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-purple-400 ml-2">E-mail</label>
                    <input type="email" placeholder="seu@email.com" className="w-full bg-[#1A1033] border border-purple-500/30 rounded-2xl px-5 py-4 text-xs text-white shadow-inner focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-purple-400 ml-2">Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#1A1033] border border-purple-500/30 rounded-2xl px-5 py-4 text-xs text-white shadow-inner focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition" />
                  </div>
                </div>

                <button onClick={() => { setNotification('Login realizado!'); setCurrentScreenIndex(0); }} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 font-black text-xs text-white shadow-lg shadow-pink-900/40 active:scale-[0.98] transition">
                  ENTRAR
                </button>
              </div>
            </div>
            <div />
          </div>
        )}

        {/* 4. PAINEL DE GESTÃO */}
        {currentScreenObj.id === 'admin_dashboard' && (
          <div className="flex-1 flex flex-col bg-[#1B1429] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <button onClick={() => setIsAdminMenuOpen(true)} className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-black active:scale-[0.98] transition shadow-lg">
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-black text-white tracking-wide">Painel de Gestão</h2>
              </div>
              <button onClick={() => setCurrentScreenIndex(0)} className="px-4 py-2 rounded-2xl bg-[#3D2566] text-white text-xs font-bold active:scale-[0.98] border border-white/10">
                Início
              </button>
            </div>

            <div className="space-y-4">
              
              {/* 4.1 VISÃO GERAL */}
              {adminTab === 'dashboard' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-[#3D2566] to-[#251645] p-5 rounded-3xl border border-white/10 shadow-xl shadow-purple-900/20">
                      <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Total Crianças</p>
                      <h4 className="text-3xl font-black text-white mt-1">{childrenList.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-[#3D2566] to-[#251645] p-5 rounded-3xl border border-white/10 shadow-xl shadow-purple-900/20">
                      <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Apadrinhadas</p>
                      <h4 className="text-3xl font-black text-white mt-1">{childrenList.filter(c => c.status === 'Apadrinhado').length}</h4>
                    </div>
                  </div>

                  {/* Recharts Bar Chart */}
                  <div className="bg-gradient-to-br from-[#2A1840] to-[#150C25] p-5 rounded-3xl border border-white/5 shadow-2xl space-y-3">
                    <h4 className="text-sm font-bold text-white mb-2">Visão Gerencial: Proporção de Crianças</h4>
                    <div className="w-full h-48 bg-[#1A1033]/50 rounded-2xl p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Apadrinhadas', count: childrenList.filter(c => c.status === 'Apadrinhado').length },
                          { name: 'Aguardando', count: childrenList.filter(c => c.status === 'Aguardando Apadrinhamento').length },
                          { name: 'Em Análise', count: childrenList.filter(c => c.status === 'Em Análise').length },
                        ]}>
                          <XAxis dataKey="name" stroke="#FBBF24" fontSize={10} tickLine={false} />
                          <YAxis stroke="#FBBF24" fontSize={10} tickLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#1A1033', borderColor: '#F59E0B', borderRadius: 12, fontSize: 12 }} />
                          <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts Bar Chart: Volume de Doações Mensais */}
                  <div className="bg-gradient-to-br from-[#2A1840] to-[#150C25] p-5 rounded-3xl border border-white/5 shadow-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold text-white">Volume de Doações Mensais</h4>
                        </div>
                        <p className="text-[10px] text-purple-300 mt-0.5">Arrecadação consolidada mês a mês via PIX e apoios diretos</p>
                      </div>

                      {/* Resumo de Métricas Rápidas */}
                      <div className="flex items-center space-x-3 bg-[#1A1033]/80 px-3 py-1.5 rounded-2xl border border-purple-500/20">
                        <div>
                          <span className="text-[9px] text-purple-300 block uppercase font-medium">Total (6 meses)</span>
                          <span className="text-xs font-bold text-amber-300">
                            R$ {monthlyDonationsData.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-purple-900/60" />
                        <div>
                          <span className="text-[9px] text-purple-300 block uppercase font-medium">Mês Atual</span>
                          <span className="text-xs font-bold text-emerald-400">+24% ↗</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-56 bg-[#1A1033]/60 rounded-2xl p-3 border border-purple-900/40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyDonationsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="donationBarGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#EC4899" stopOpacity={0.95} />
                              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#3D2566" opacity={0.4} vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#CBD5E1" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={{ stroke: '#4C1D95', opacity: 0.5 }}
                          />
                          <YAxis 
                            stroke="#CBD5E1" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={{ stroke: '#4C1D95', opacity: 0.5 }}
                            tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#160D29', 
                              borderColor: '#EC4899', 
                              borderRadius: 16, 
                              fontSize: 12,
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                            }}
                            formatter={(value: any) => [
                              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                              'Total Doado'
                            ]}
                            labelFormatter={(label) => `Mês: ${label}`}
                          />
                          <Bar 
                            dataKey="total" 
                            fill="url(#donationBarGradient)" 
                            radius={[8, 8, 2, 2]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Detalhamento dos meses com doadores */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 text-center">
                      {monthlyDonationsData.map((d) => (
                        <div key={d.month} className="p-2 rounded-xl bg-[#1A1033] border border-purple-500/20">
                          <span className="text-[10px] text-purple-300 block">{d.month}</span>
                          <span className="text-xs font-bold text-white block">R${(d.total / 1000).toFixed(1)}k</span>
                          <span className="text-[9px] text-pink-400 block">{d.doadores} doadores</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Controle da Tela Inicial */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 shadow space-y-3">
                    <h4 className="text-xs font-bold text-amber-300">Controle da Tela Inicial</h4>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1033] border border-purple-500/20">
                      <span className="text-[10px] text-white">Botões Festivos (Natal/Ano Novo)</span>
                      <button onClick={() => setShowFestiveButtons(!showFestiveButtons)} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${showFestiveButtons ? 'bg-pink-600' : 'bg-purple-800'}`}>
                        {showFestiveButtons ? 'Visível' : 'Oculto'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1033] border border-purple-500/20">
                      <span className="text-[10px] text-white">Áreas de Acesso (Padrinho/Família)</span>
                      <button onClick={() => setShowHomeButtons(!showHomeButtons)} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${showHomeButtons ? 'bg-pink-600' : 'bg-purple-800'}`}>
                        {showHomeButtons ? 'Visível' : 'Oculto'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#2A1840] to-[#150C25] p-5 rounded-3xl border border-white/5 shadow-2xl space-y-3">
                    <h4 className="text-sm font-bold text-white">Áreas de Edição & Recursos</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setAdminTab('evangelical')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-amber-400 transition flex flex-col items-center justify-center text-center">
                        <BookOpen className="w-6 h-6 mb-2 text-amber-400" />
                        <span>Temas Evangélicos</span>
                      </button>
                      <button onClick={() => setAdminTab('sponsors_families')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-pink-400 transition flex flex-col items-center justify-center text-center">
                        <Users className="w-6 h-6 mb-2 text-pink-400" />
                        <span>Padrinhos & Famílias</span>
                      </button>
                      <button onClick={() => setAdminTab('festive')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-red-400 transition flex flex-col items-center justify-center text-center">
                        <Sparkles className="w-6 h-6 mb-2 text-amber-400" />
                        <span>Festivo</span>
                      </button>
                      <button onClick={() => setAdminTab('splash3d')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-pink-400 transition flex flex-col items-center justify-center text-center">
                        <Cloud className="w-6 h-6 mb-2 text-pink-400" />
                        <span>Abertura 3D</span>
                      </button>
                      <button onClick={() => setAdminTab('buttons')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-purple-400 transition flex flex-col items-center justify-center text-center">
                        <Layers className="w-6 h-6 mb-2 text-purple-400" />
                        <span>Gerenciar Botões</span>
                      </button>
                      <button onClick={() => setAdminTab('media916')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-blue-400 transition flex flex-col items-center justify-center text-center">
                        <Video className="w-6 h-6 mb-2 text-blue-400" />
                        <span>Mídias 9:16</span>
                      </button>
                      <button onClick={() => setAdminTab('carousel')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-pink-400 transition flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-6 h-6 mb-2 text-pink-400" />
                        <span>Banners</span>
                      </button>
                      <button onClick={() => setAdminTab('pix')} className="p-4 rounded-2xl bg-gradient-to-br from-[#3D2566] to-[#251645] border border-white/10 text-white font-bold text-xs shadow hover:border-amber-400 transition flex flex-col items-center justify-center text-center">
                        <QrCode className="w-6 h-6 mb-2 text-amber-400" />
                        <span>PIX & Doação</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.2 CONTROLE DE NATAL, ANO NOVO, NEVE & FOGOS */}
              {adminTab === 'festive' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Controle Festivo: Natal, Ano Novo & Neve</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3.5 shadow">
                    
                    {/* Alerta de Segurança e Isolamento */}
                    <div className="flex items-center space-x-2 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-500/40 text-[11px] text-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Painel Protegido:</strong> Os fogos nunca cobrem o painel nem interferem em botões e formulários.</span>
                    </div>

                    <label className="text-amber-200 font-bold block">Tema Festivo do App:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => { setFestiveMode('christmas'); setNotification('Tema de Natal Ativado!'); }}
                        className={`p-3 rounded-xl font-bold border ${festiveMode === 'christmas' ? 'bg-red-600 text-white border-white' : 'bg-[#1A1033] border-amber-500/30 text-purple-200'}`}
                      >
                        🎄 Natal
                      </button>
                      <button 
                        onClick={() => { 
                          setFestiveMode('new_year'); 
                          setNotification('🎆 Modo Ano Novo Ativado! Fogos visíveis na tela inicial, isolados do painel.');
                        }}
                        className={`p-3 rounded-xl font-bold border ${festiveMode === 'new_year' ? 'bg-amber-500 text-black border-white' : 'bg-[#1A1033] border-amber-500/30 text-purple-200'}`}
                      >
                        🎆 Ano Novo (Fogos)
                      </button>
                      <button 
                        onClick={() => { setFestiveMode('off'); setNotification('Tema Normal Restaurado'); }}
                        className={`p-3 rounded-xl font-bold border ${festiveMode === 'off' ? 'bg-purple-700 text-white border-white' : 'bg-[#1A1033] border-amber-500/30 text-purple-200'}`}
                      >
                        Padrão
                      </button>
                    </div>

                    {/* Escopo dos Fogos de Artifício */}
                    <div className="pt-2 border-t border-purple-900/50 space-y-2">
                      <label className="text-amber-200 font-bold block">Onde exibir os Fogos de Artifício:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { setFireworksScope('home_only'); setNotification('Fogos configurados: Apenas na Tela Inicial'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${fireworksScope === 'home_only' ? 'bg-amber-500 text-black border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Apenas na Tela Inicial (Padrão)
                        </button>
                        <button 
                          onClick={() => { setFireworksScope('all_screens'); setNotification('Fogos configurados: Em Telas Públicas'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${fireworksScope === 'all_screens' ? 'bg-amber-500 text-black border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Em Telas Públicas
                        </button>
                      </div>
                    </div>

                    {/* Posicionamento dos Fogos na Tela (Ajuste no Lugar) */}
                    <div className="pt-2 border-t border-purple-900/50 space-y-2">
                      <label className="text-amber-200 font-bold block">Posicionamento dos Fogos na Tela:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { setFireworksPosition('sky_top'); setNotification('Fogos ajustados: Céu do Banner / Topo'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${fireworksPosition === 'sky_top' ? 'bg-purple-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Céu do Banner / Topo (Ajustado)
                        </button>
                        <button 
                          onClick={() => { setFireworksPosition('full_screen'); setNotification('Fogos ajustados: Tela Inteira'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${fireworksPosition === 'full_screen' ? 'bg-purple-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Tela Inteira
                        </button>
                      </div>
                    </div>

                    {/* Frequência dos Fogos de Artifício */}
                    <div className="pt-2 border-t border-purple-900/50 space-y-2">
                      <label className="text-amber-200 font-bold block">Frequência dos Estouros de Fogos:</label>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                        {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                          <button
                            key={intensity}
                            onClick={() => {
                              setFireworksIntensity(intensity);
                              setNotification(`Fogos: ${intensity === 'light' ? 'Suave (Calmo)' : intensity === 'medium' ? 'Médio (Equilibrado)' : 'Show Pirotécnico'}`);
                            }}
                            className={`py-2 rounded-xl font-semibold border ${fireworksIntensity === intensity ? 'bg-amber-500 text-black border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                          >
                            {intensity === 'light' ? 'Suave' : intensity === 'medium' ? 'Média' : 'Show Pirotécnico'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulador Fechado de Demonstração */}
                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-amber-200 font-bold block">Simulador de Demonstração:</label>
                        <span className="text-[10px] text-emerald-400 font-medium">● Área Fechada de Demonstração</span>
                      </div>
                      
                      {/* Palco do Simulador */}
                      <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gradient-to-b from-[#090314] via-[#140b29] to-[#200e3b] border border-amber-500/40 shadow-inner flex flex-col justify-between p-2.5">
                        <canvas 
                          ref={adminFireworksCanvasRef}
                          className="absolute inset-0 pointer-events-none"
                        />
                        <div className="relative z-10 flex items-center justify-between text-[10px] text-purple-300">
                          <span className="bg-black/50 px-2 py-0.5 rounded-md border border-purple-500/30">Céu Noturno Lar Esperança</span>
                          <span className="text-amber-300 font-semibold">Simulação Segura</span>
                        </div>
                        
                        <div className="relative z-10 flex items-center justify-between pt-2">
                          <button 
                            onClick={() => {
                              if (triggerSimulatorExplosionRef.current) {
                                triggerSimulatorExplosionRef.current();
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold text-[10px] shadow active:scale-[0.98] flex items-center space-x-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Disparar no Simulador</span>
                          </button>
                          
                          <button 
                            onClick={() => setIsAdminSimulatorRunning(!isAdminSimulatorRunning)}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold border ${isAdminSimulatorRunning ? 'bg-purple-900/70 border-purple-500/40 text-purple-200' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                          >
                            {isAdminSimulatorRunning ? 'Pausar Loop' : 'Ativar Loop'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Escopo da Neve: Apenas na Tela Inicial (Padrão) vs Em Todas as Telas */}
                    <div className="pt-2 border-t border-purple-900/50 space-y-2">
                      <label className="text-amber-200 font-bold block">Onde exibir a neve caindo:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { setSnowScope('home_only'); setNotification('Neve configurada: Apenas na Tela Inicial'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${snowScope === 'home_only' ? 'bg-pink-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Apenas na Tela Inicial (Padrão)
                        </button>
                        <button 
                          onClick={() => { setSnowScope('all_screens'); setNotification('Neve configurada: Em Todas as Telas'); }}
                          className={`p-2.5 rounded-xl font-semibold border ${snowScope === 'all_screens' ? 'bg-pink-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                        >
                          Em Todas as Telas
                        </button>
                      </div>
                    </div>

                    {/* Intensidade da Neve */}
                    <div className="pt-2 border-t border-purple-900/50 space-y-2">
                      <label className="text-amber-200 font-bold block">Intensidade dos Flocos de Neve:</label>
                      <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                        {(['off', 'light', 'medium', 'heavy'] as const).map((intensity) => (
                          <button
                            key={intensity}
                            onClick={() => {
                              setSnowIntensity(intensity);
                              setNotification(`Intensidade de neve: ${intensity === 'off' ? 'Desligada' : intensity === 'light' ? 'Pouca' : intensity === 'medium' ? 'Média' : 'Mais Forte'}`);
                            }}
                            className={`py-2 rounded-xl font-semibold border ${snowIntensity === intensity ? 'bg-blue-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                          >
                            {intensity === 'off' ? 'Desligar' : intensity === 'light' ? 'Pouca' : intensity === 'medium' ? 'Média' : 'Mais Forte'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ações de Controle e Limpeza de Efeitos */}
                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <div className="flex items-center justify-between space-x-2">
                        <button 
                          onClick={clearAllEffects}
                          className="flex-1 py-2.5 rounded-xl bg-purple-900/80 border border-purple-500/40 text-purple-200 font-semibold text-xs active:scale-[0.98] flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                          <span>Limpar Tela e Parar Efeitos</span>
                        </button>
                        <button 
                          onClick={() => {
                            setIsFestiveSoundEnabled(!isFestiveSoundEnabled);
                            setNotification(`Sons festivos ${!isFestiveSoundEnabled ? 'Ativados' : 'Desativados'}`);
                          }}
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border ${isFestiveSoundEnabled ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-gray-900/60 border-gray-700 text-gray-400'}`}
                        >
                          {isFestiveSoundEnabled ? '🔊 Som Ativo' : '🔇 Som Mudo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.3 ÁREA EXCLUSIVA DE ABERTURA 3D COM CORES, NUVEM E TOGGLE DO BOTÃO */}
              {adminTab === 'splash3d' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Abertura 3D: Nuvem, Logo e Controles</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Efeito de Abertura Ativo</span>
                      <button 
                        onClick={() => {
                          setIsSplashEnabled(!isSplashEnabled);
                          setNotification(`Abertura 3D ${!isSplashEnabled ? 'Ativada' : 'Desativada'}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold ${isSplashEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                        {isSplashEnabled ? 'Ativado' : 'Desativado'}
                      </button>
                    </div>

                    {/* Opção solicitada: Desligar o botão "Entrar no Aplicativo" para entrada automática */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1033] border border-amber-500/30">
                      <div>
                        <span className="font-bold text-white block">Botão "Entrar no Aplicativo"</span>
                        <span className="text-[10px] text-purple-300">
                          {splashShowEnterButton 
                            ? 'Botão visível: o usuário clica para entrar' 
                            : 'Desligado: entra automaticamente após a animação da nuvem'}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSplashShowEnterButton(!splashShowEnterButton);
                          setNotification(`Botão 'Entrar no Aplicativo' ${!splashShowEnterButton ? 'Ativado' : 'Desligado (Entrada Automática)'}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition shadow ${splashShowEnterButton ? 'bg-emerald-600 text-white' : 'bg-red-600/80 text-white'}`}
                      >
                        {splashShowEnterButton ? 'Ligado' : 'Desligado'}
                      </button>
                    </div>

                    {!splashShowEnterButton && (
                      <div className="p-3 rounded-xl bg-[#1A1033] border border-purple-500/30 space-y-1.5">
                        <label className="text-amber-200 block text-[11px] font-semibold">Tempo de Exibição da Animação antes de Entrar:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[3, 4, 5].map((sec) => (
                            <button
                              key={sec}
                              onClick={() => {
                                setSplashAutoEnterDelay(sec);
                                setNotification(`Tempo de animação: ${sec} segundos`);
                              }}
                              className={`py-1.5 rounded-lg font-bold ${splashAutoEnterDelay === sec ? 'bg-pink-600 text-white' : 'bg-[#2A1840] text-purple-300 border border-purple-500/30'}`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-amber-200 font-bold block">6 Versões de Cores da Abertura 3D (Celular, Tablet e PC):</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'gold_pink', label: 'Dourado & Rosa Neon' },
                          { id: 'blue_silver', label: 'Azul Celestial & Prata' },
                          { id: 'emerald_gold', label: 'Esmeralda & Ouro' },
                          { id: 'purple_cyan', label: 'Púrpura & Ciano' },
                          { id: 'ruby_gold', label: 'Vermelho Rubi & Ouro' },
                          { id: 'silver_white', label: 'Branco Polar & Cristal' },
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => {
                              setSplashColorTheme(th.id as any);
                              setNotification(`Tema da abertura: ${th.label}`);
                            }}
                            className={`p-2.5 rounded-xl font-semibold border ${splashColorTheme === th.id ? 'bg-pink-600 text-white border-white' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-amber-200 block mb-1">Cor Primária do Logo</label>
                        <input type="color" value={splashPrimaryColor} onChange={(e) => setSplashPrimaryColor(e.target.value)} className="w-full h-9 rounded-xl bg-transparent cursor-pointer" />
                      </div>
                      <div>
                        <label className="text-amber-200 block mb-1">Brilho da Nuvem</label>
                        <input type="color" value={splashCloudGlow} onChange={(e) => setSplashCloudGlow(e.target.value)} className="w-full h-9 rounded-xl bg-transparent cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="text-amber-200">Título da Abertura</label>
                      <input 
                        type="text" 
                        value={splashTitle} 
                        onChange={(e) => setSplashTitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs" 
                      />

                      <label className="text-amber-200">Subtítulo / Slogan</label>
                      <input 
                        type="text" 
                        value={splashSubtitle} 
                        onChange={(e) => setSplashSubtitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs" 
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setIsShowingSplash(true);
                          if (isFestiveSoundEnabled) playFestiveChime();
                        }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 font-bold text-white shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>Testar Entrada 3D com Nuvem Agora</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.4 TEMAS EVANGÉLICOS & VERSÍCULOS EDITÁVEIS */}
              {adminTab === 'evangelical' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Temas Evangélicos & Versículos Bíblicos</span>
                    </h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Exibir Card Evangélico no App</span>
                        <span className="text-[10px] text-purple-300">Aparece na tela inicial e nas áreas com conforto e fé</span>
                      </div>
                      <button 
                        onClick={() => {
                          setIsEvangelicalBannerEnabled(!isEvangelicalBannerEnabled);
                          setNotification(`Banner Evangélico ${!isEvangelicalBannerEnabled ? 'Ativado' : 'Ocultado'}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold ${isEvangelicalBannerEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                        {isEvangelicalBannerEnabled ? 'Ativo' : 'Oculto'}
                      </button>
                    </div>

                    {/* Seleção do Tema Evangélico Ativo */}
                    <div className="space-y-2 pt-2 border-t border-purple-900/50">
                      <label className="text-amber-200 font-bold block">Escolher Tema Evangélico Visual:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {evangelicalThemes.map((th) => (
                          <button
                            key={th.id}
                            onClick={() => {
                              setActiveEvangelicalThemeId(th.id);
                              setNotification(`Tema ativo: ${th.name}`);
                            }}
                            className={`p-2.5 rounded-xl text-left border transition ${activeEvangelicalThemeId === th.id ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow' : 'bg-[#1A1033] border-purple-500/30 text-purple-200'}`}
                          >
                            <span className="block text-xs font-bold">{th.name}</span>
                            <span className="text-[9px] text-purple-300 block">{th.tagline}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cadastrar Nova Mensagem / Versículo Bíblico */}
                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <h4 className="font-bold text-white flex items-center space-x-1.5">
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>Adicionar Novo Versículo ou Mensagem Bíblica</span>
                      </h4>
                      <textarea 
                        placeholder="Texto do versículo bíblico ou mensagem de fé..."
                        value={newVerseText}
                        onChange={(e) => setNewVerseText(e.target.value)}
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl p-2.5 text-white h-20 resize-none text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Ex: Salmos 91:1" 
                          value={newVerseRef}
                          onChange={(e) => setNewVerseRef(e.target.value)}
                          className="bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="Categoria (Fé, Esperança...)" 
                          value={newVerseCategory}
                          onChange={(e) => setNewVerseCategory(e.target.value)}
                          className="bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <button 
                        onClick={handleAddEvangelicalMessage}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-white shadow active:scale-[0.98]"
                      >
                        + Salvar Novo Versículo
                      </button>
                    </div>

                    {/* Edição de Versículo (caso ativo) */}
                    {editingMessageId && (
                      <div className="p-3 rounded-2xl bg-[#180F2A] border border-amber-400/60 space-y-2 shadow-lg">
                        <h4 className="font-bold text-amber-300">Editando Mensagem / Versículo:</h4>
                        <textarea 
                          value={editingVerseText}
                          onChange={(e) => setEditingVerseText(e.target.value)}
                          className="w-full bg-[#1A1033] border border-purple-500/40 rounded-xl p-2 text-white h-18 text-xs resize-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={editingVerseRef}
                            onChange={(e) => setEditingVerseRef(e.target.value)}
                            className="bg-[#1A1033] border border-purple-500/40 rounded-xl px-2 py-1.5 text-white text-xs"
                          />
                          <input 
                            type="text" 
                            value={editingVerseCategory}
                            onChange={(e) => setEditingVerseCategory(e.target.value)}
                            className="bg-[#1A1033] border border-purple-500/40 rounded-xl px-2 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => setEditingMessageId(null)} className="flex-1 py-1.5 rounded-xl bg-purple-900/60 text-purple-200">
                            Cancelar
                          </button>
                          <button onClick={handleSaveEditEvangelicalMessage} className="flex-1 py-1.5 rounded-xl bg-amber-500 text-black font-bold shadow">
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Lista de Versículos Cadastrados (com Edição e Exclusão) */}
                    <div className="pt-3 border-t border-purple-900/50 space-y-2.5">
                      <h4 className="font-bold text-amber-300">Versículos Cadastrados ({evangelicalMessages.length}):</h4>
                      <div className="space-y-2">
                        {evangelicalMessages.map((msg) => (
                          <div 
                            key={msg.id}
                            className={`p-3 rounded-2xl border transition shadow space-y-2 ${activeEvangelicalMessageId === msg.id ? 'bg-[#1E1138] border-amber-400' : 'bg-[#1A1033] border-purple-500/30'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 text-xs">📖 {msg.reference}</span>
                              <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 text-[9px] font-semibold">
                                {msg.category}
                              </span>
                            </div>
                            <p className="text-white italic text-xs leading-relaxed">"{msg.verse}"</p>
                            
                            <div className="flex items-center justify-between pt-1 border-t border-purple-900/40">
                              <button 
                                onClick={() => {
                                  setActiveEvangelicalMessageId(msg.id);
                                  setNotification(`Versículo destacado: ${msg.reference}`);
                                }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${activeEvangelicalMessageId === msg.id ? 'bg-amber-500 text-black' : 'bg-purple-900/60 text-purple-200'}`}
                              >
                                {activeEvangelicalMessageId === msg.id ? '★ Destacado' : 'Destacar'}
                              </button>
                              <div className="flex space-x-1.5">
                                <button 
                                  onClick={() => handleStartEditEvangelicalMessage(msg)}
                                  className="px-2.5 py-1 rounded-xl bg-purple-900/60 text-pink-300 text-[10px] font-semibold active:scale-[0.98]"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => handleDeleteEvangelicalMessage(msg.id)}
                                  className="px-2.5 py-1 rounded-xl bg-red-600/30 text-red-200 text-[10px] font-semibold active:scale-[0.98]"
                                >
                                  Apagar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4.5 GERENCIAR PADRINHOS & FAMÍLIAS (Com upload de foto da galeria e mensagens) */}
              {adminTab === 'sponsors_families' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span>Gerenciar Padrinhos & Famílias</span>
                    </h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  {/* Edição do Padrinho pelo Administrador */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-pink-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-pink-400 text-xs flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Perfil do Padrinho: Dados & Foto da Galeria</span>
                    </h4>

                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <div 
                        className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500 select-none pointer-events-auto cursor-pointer shadow shrink-0"
                        onClick={() => setZoomedImage(sponsorUser.avatar)}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <img src={sponsorUser.avatar} alt="Padrinho" className="w-full h-full object-cover select-none pointer-events-none" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label htmlFor="admin-sponsor-avatar" className="inline-block px-3 py-1.5 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98] text-[10px] shadow">
                          + Enviar Foto da Galeria
                        </label>
                        <input id="admin-sponsor-avatar" type="file" accept="image/*" onChange={handleAdminUploadSponsorAvatar} className="hidden" />
                        <p className="text-[9px] text-purple-300">Upload de foto do padrinho direto do dispositivo</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome do Padrinho</label>
                      <input 
                        type="text" 
                        value={sponsorUser.name} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, name: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp / Telefone</label>
                      <input 
                        type="text" 
                        value={sponsorUser.phone} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, phone: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        value={sponsorUser.email} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, email: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Bio / Sobre o Padrinho</label>
                      <textarea 
                        value={sponsorUser.bio} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, bio: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-16 resize-none" 
                      />
                    </div>
                    <div>
                      <label className="text-pink-300 block mb-1 font-bold">Mensagem do Padrinho para a Família:</label>
                      <textarea 
                        value={sponsorUser.familyMessage || ''} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, familyMessage: e.target.value })}
                        placeholder="Mensagem carinhosa que a família acolhedora poderá ler..."
                        className="w-full bg-[#1A1033] border border-pink-500/40 rounded-xl p-2.5 text-white h-20 resize-none" 
                      />
                    </div>

                    <button 
                      onClick={() => setNotification('Dados e foto do padrinho atualizados com sucesso!')}
                      className="w-full py-2.5 rounded-xl bg-pink-600 font-bold text-white shadow active:scale-[0.98]"
                    >
                      Salvar Dados do Padrinho
                    </button>
                  </div>

                  {/* Edição da Família pelo Administrador */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Perfil da Família: Dados & Foto da Galeria</span>
                    </h4>

                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <div 
                        className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 select-none pointer-events-auto cursor-pointer shadow shrink-0"
                        onClick={() => setZoomedImage(familyUser.avatar)}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <img src={familyUser.avatar} alt="Família" className="w-full h-full object-cover select-none pointer-events-none" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label htmlFor="admin-family-avatar" className="inline-block px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold cursor-pointer active:scale-[0.98] text-[10px] shadow">
                          + Enviar Foto da Galeria
                        </label>
                        <input id="admin-family-avatar" type="file" accept="image/*" onChange={handleAdminUploadFamilyAvatar} className="hidden" />
                        <p className="text-[9px] text-purple-300">Upload de foto da família direto do dispositivo</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome dos Responsáveis / Família</label>
                      <input 
                        type="text" 
                        value={familyUser.name} 
                        onChange={(e) => setFamilyUser({ ...familyUser, name: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp / Contato</label>
                      <input 
                        type="text" 
                        value={familyUser.phone} 
                        onChange={(e) => setFamilyUser({ ...familyUser, phone: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        value={familyUser.email} 
                        onChange={(e) => setFamilyUser({ ...familyUser, email: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Bio / História da Família</label>
                      <textarea 
                        value={familyUser.bio} 
                        onChange={(e) => setFamilyUser({ ...familyUser, bio: e.target.value })}
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-16 resize-none" 
                      />
                    </div>

                    <button 
                      onClick={() => setNotification('Dados e foto da família atualizados com sucesso!')}
                      className="w-full py-2.5 rounded-xl bg-amber-500 font-bold text-black shadow active:scale-[0.98]"
                    >
                      Salvar Dados da Família
                    </button>
                  </div>
                </div>
              )}

              {/* 4.6 GERENCIADOR DE BOTÕES */}
              {adminTab === 'buttons' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Gerenciador de Botões do Rodapé</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Criar Novo Botão Personalizado:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Nome do Botão" 
                        value={newButtonLabel} 
                        onChange={(e) => setNewButtonLabel(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs" 
                      />
                      <select 
                        value={newButtonIcon} 
                        onChange={(e) => setNewButtonIcon(e.target.value as any)}
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="heart">Coração</option>
                        <option value="user">Padrinho</option>
                        <option value="users">Família</option>
                        <option value="gift">Doação</option>
                        <option value="star">Estrela</option>
                        <option value="sparkles">Brilho</option>
                        <option value="video">Vídeo</option>
                        <option value="home">Início</option>
                      </select>
                    </div>

                    <button 
                      onClick={handleAddFooterButton}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 font-bold text-white shadow active:scale-[0.98] flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Novo Botão</span>
                    </button>

                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <h4 className="font-bold text-amber-300">Editar Ordem e Nomes dos Botões:</h4>
                      <div className="space-y-2">
                        {footerButtons.map((btn, idx) => (
                          <div key={btn.id} className="p-3 rounded-xl bg-[#1A1033] border border-purple-500/30 flex items-center justify-between">
                              <div className="flex items-center space-x-2 flex-1 mr-2">
                                {/* Icon Selector for Editing */}
                                <select 
                                  value={btn.iconName}
                                  onChange={(e) => {
                                    const updated = [...footerButtons];
                                    updated[idx].iconName = e.target.value as any;
                                    setFooterButtons(updated);
                                  }}
                                  className="bg-[#2A1840] border border-purple-500/30 rounded-lg px-1 py-1 text-white text-[10px]"
                                >
                                  <option value="heart">Coração</option>
                                  <option value="user">Usuário</option>
                                  <option value="users">Usuários</option>
                                  <option value="gift">Presente</option>
                                  <option value="star">Estrela</option>
                                  <option value="sparkles">Brilho</option>
                                  <option value="video">Vídeo</option>
                                  <option value="home">Início</option>
                                </select>
                                <input 
                                  type="text" 
                                  value={btn.label} 
                                  onChange={(e) => {
                                    const updated = [...footerButtons];
                                    updated[idx].label = e.target.value;
                                    setFooterButtons(updated);
                                  }}
                                  className="bg-[#2A1840] border border-purple-500/30 rounded-lg px-2 py-1 text-white text-xs w-full"
                                />
                              </div>
                            
                            <div className="flex items-center space-x-1 shrink-0">
                              <button 
                                onClick={() => handleMoveFooterButton(idx, 'left')}
                                disabled={idx === 0}
                                className="p-1 rounded-lg bg-purple-900/60 text-purple-200 disabled:opacity-30 active:scale-[0.98]"
                                title="Mover para esquerda"
                              >
                                <MoveLeft className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleMoveFooterButton(idx, 'right')}
                                disabled={idx === footerButtons.length - 1}
                                className="p-1 rounded-lg bg-purple-900/60 text-purple-200 disabled:opacity-30 active:scale-[0.98]"
                                title="Mover para direita"
                              >
                                <MoveRight className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleRemoveFooterButton(btn.id)}
                                className="p-1 rounded-lg bg-red-600/30 text-red-200 active:scale-[0.98]"
                                title="Excluir Botão"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.7 MÍDIAS 9:16 (Stories/Reels) */}
              {adminTab === 'media916' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Mídias no Formato 9:16 (Stories & Vídeos)</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Adicionar Foto ou Vídeo 9:16 da Galeria:</h4>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Título do Momento" 
                        value={newStoryTitle} 
                        onChange={(e) => setNewStoryTitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                      <input 
                        type="text" 
                        placeholder="Subtítulo ou Descrição rápida" 
                        value={newStorySubtitle} 
                        onChange={(e) => setNewStorySubtitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                      <label htmlFor="media-916-upload" className="block py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-center cursor-pointer active:scale-[0.98] shadow">
                        + Selecionar Foto/Vídeo 9:16 (Galeria)
                      </label>
                      <input id="media-916-upload" type="file" accept="image/*,video/*" onChange={handleStory916Upload} className="hidden" />
                    </div>

                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <h4 className="font-bold text-amber-300">Mídias 9:16 Ativas ({stories916.length}):</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {stories916.map((st) => (
                          <div key={st.id} className="relative aspect-[9/16] rounded-xl overflow-hidden border border-purple-500/30 group">
                            <img src={st.url} alt={st.title} className="w-full h-full object-cover select-none pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-1 flex flex-col justify-end">
                              <span className="text-[9px] font-bold text-white truncate">{st.title}</span>
                            </div>
                            <button 
                              onClick={() => {
                                setStories916(stories916.filter(s => s.id !== st.id));
                                setNotification('Mídia 9:16 removida.');
                              }}
                              className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white shadow"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.8 BANNERS DO CARROSSEL */}
              {adminTab === 'carousel' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Gerenciamento de Banners do Carrossel</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Criar Novo Banner para o Topo da Home:</h4>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Título do Banner" 
                        value={newBannerTitle} 
                        onChange={(e) => setNewBannerTitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                      <input 
                        type="text" 
                        placeholder="Subtítulo ou mensagem de impacto" 
                        value={newBannerSubtitle} 
                        onChange={(e) => setNewBannerSubtitle(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                      <input 
                        type="text" 
                        placeholder="Tag / Badge (Ex: Solidariedade)" 
                        value={newBannerBadge} 
                        onChange={(e) => setNewBannerBadge(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" 
                      />
                      <label htmlFor="banner-upload" className="block py-3 rounded-xl bg-pink-600 text-white font-bold text-center cursor-pointer active:scale-[0.98] shadow">
                        + Subir Foto do Banner da Galeria
                      </label>
                      <input id="banner-upload" type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </div>

                    <div className="pt-3 border-t border-purple-900/50 space-y-2">
                      <h4 className="font-bold text-amber-300">Banners Ativos ({banners.length}):</h4>
                      <div className="space-y-2">
                        {banners.map((bn, idx) => (
                          <div key={bn.id} className="p-2.5 rounded-xl bg-[#1A1033] border border-purple-500/30 flex items-center justify-between">
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <img src={bn.image} alt="Banner" className="w-14 h-9 object-cover rounded-lg shrink-0" />
                              <div className="overflow-hidden">
                                <h5 className="font-bold text-white truncate">{bn.title}</h5>
                                <p className="text-[10px] text-purple-300 truncate">{bn.subtitle}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                if (banners.length <= 1) {
                                  setNotification('Mantenha pelo menos um banner ativo.');
                                  return;
                                }
                                setBanners(banners.filter((_, i) => i !== idx));
                                setNotification('Banner removido.');
                              }}
                              className="p-1.5 rounded-lg bg-red-600 text-white ml-2 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.9 PIX & MENSAGEM DE DOAÇÃO */}
              {adminTab === 'pix' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Configuração de Doações & Texto Personalizado</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <div>
                      <label className="text-amber-200 font-bold block mb-1">Texto Personalizado da Doação:</label>
                      <textarea 
                        value={donationCustomMessage} 
                        onChange={(e) => setDonationCustomMessage(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl p-3 text-white h-24 resize-none text-xs" 
                      />
                    </div>
                    <div>
                      <label className="text-amber-200">Chave PIX (Copia e Cola)</label>
                      <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2.5 text-white mt-1" />
                    </div>
                    <div>
                      <label className="text-amber-200">Nome do Banco / Instituição</label>
                      <input type="text" value={pixBankName} onChange={(e) => setPixBankName(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2.5 text-white mt-1" />
                    </div>
                    <div>
                      <label className="text-amber-200">URL do QR Code PIX</label>
                      <input type="text" value={pixQrCode} onChange={(e) => setPixQrCode(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2.5 text-white mt-1" />
                    </div>
                    <button onClick={() => setNotification('Dados do PIX e mensagem atualizados!')} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-white shadow active:scale-[0.98]">
                      Salvar Alterações do PIX
                    </button>
                  </div>
                </div>
              )}

              {/* 4.10 CONFIGURAÇÃO DO ÍCONE PWA & LOGO DO MENU */}
              {adminTab === 'settings' && (
                <div className="space-y-4 text-xs">
                  {/* Ordenação da Tela Inicial */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-purple-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Ordem da Tela Inicial</h4>
                    <p className="text-purple-200 text-[10px]">Arraste e solte para reordenar os blocos da tela inicial.</p>
                    <div className="space-y-1.5">
                      {homeCardOrder.map((cardId, index) => {
                        const icons: Record<string, string> = {
                          banner: '🖼️',
                          search_filters: '🔍',
                          stories: '📹',
                          festive: '🎄',
                          evangelical: '📖',
                          children_list: '💖',
                          access_cards: '👥',
                          gallery: '🖼️'
                        };
                        return (
                          <div key={cardId} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1033] border border-purple-500/20">
                            <span className="text-[11px] text-white font-medium flex items-center gap-2">
                              {icons[cardId] || '◻️'} {cardId.replace('_', ' ').toUpperCase()}
                            </span>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => {
                                  if (index > 0) {
                                    const newOrder = [...homeCardOrder];
                                    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                    setHomeCardOrder(newOrder);
                                  }
                                }}
                                className="p-1 rounded bg-purple-900 text-purple-200"
                              >▲</button>
                              <button 
                                onClick={() => {
                                  if (index < homeCardOrder.length - 1) {
                                    const newOrder = [...homeCardOrder];
                                    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                    setHomeCardOrder(newOrder);
                                  }
                                }}
                                className="p-1 rounded bg-purple-900 text-purple-200"
                              >▼</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Foto do Botão PWA */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Ícone do Botão PWA</h4>
                    <p className="text-purple-200 text-[10px]">A foto enviada aqui é aplicada ao botão/ícone de instalação PWA.</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500 select-none pointer-events-none shadow-lg">
                        <img src={pwaCustomIcon} alt="PWA" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label htmlFor="pwa-upload-btn" className="block px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold cursor-pointer active:scale-[0.98] text-center text-[10px] shadow">
                          + Alterar Ícone PWA
                        </label>
                        <input id="pwa-upload-btn" type="file" accept="image/*" onChange={handlePwaIconUpload} className="hidden" />
                      </div>
                    </div>
                  </div>

                  {/* Segurança do Painel */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-red-500/30 space-y-4 shadow">
                    <h4 className="font-bold text-white flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        <span>Segurança do Painel</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-purple-300">Novo E-mail do Administrador</label>
                        <input type="email" placeholder="admin@lar.org" className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-purple-300">Nova Senha</label>
                        <input type="password" placeholder="********" className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl px-3 py-2 text-white text-xs" />
                      </div>
                      <button onClick={() => setNotification('Credenciais de acesso atualizadas!')} className="w-full py-2 rounded-xl bg-red-600 text-white font-bold text-xs">
                        Salvar Credenciais
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1033] border border-red-500/20">
                      <span className="text-[10px] text-white">Bloqueio por Biometria (Mock)</span>
                      <button onClick={() => setBiometricLockEnabled(!biometricLockEnabled)} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${biometricLockEnabled ? 'bg-red-600' : 'bg-purple-800'}`}>
                        {biometricLockEnabled ? 'Ativado' : 'Desativado'}
                      </button>
                    </div>
                  </div>

                  {/* Foto do Menu Lateral */}
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-pink-500/30 space-y-3 shadow">
                    <h4 className="font-bold text-white">Foto do Menu Lateral</h4>
                    <p className="text-purple-200 text-[10px]">Altere a foto que aparece no cabeçalho do menu lateral (área segura).</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 select-none pointer-events-none shadow-lg">
                        <img src={homeMenuAvatar} alt="Menu Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label htmlFor="home-menu-avatar-upload" className="block px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold cursor-pointer active:scale-[0.98] text-center text-[10px] shadow">
                          + Alterar Foto do Menu
                        </label>
                        <input id="home-menu-avatar-upload" type="file" accept="image/*" onChange={handleHomeMenuAvatarUpload} className="hidden" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.11 PERFIL DO GESTOR */}
              {adminTab === 'profile' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm">Foto de Perfil do Gestor</h3>
                    <button onClick={() => setAdminTab('dashboard')} className="text-[10px] text-purple-300 underline">Voltar</button>
                  </div>

                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-4 shadow">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 mb-3 shadow select-none pointer-events-none">
                        <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover select-none pointer-events-none" />
                      </div>
                      <label htmlFor="admin-avatar-upload" className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98] shadow text-xs">
                        + Trocar Foto de Perfil (Galeria)
                      </label>
                      <input id="admin-avatar-upload" type="file" accept="image/*" onChange={handleAdminAvatarUpload} className="hidden" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-amber-200">Nome do Gestor / Responsável</label>
                      <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" />
                      
                      <label className="text-amber-200">Cargo / Função</label>
                      <input type="text" value={adminRole} onChange={(e) => setAdminRole(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" />
                    </div>

                    <button onClick={() => setNotification('Perfil atualizado com sucesso!')} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-white shadow active:scale-[0.98]">
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              )}

              {/* 4.12 CRIANÇAS */}
              {adminTab === 'children' && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-amber-300">Cadastrar Nova Criança & Carta</h3>
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <input type="text" placeholder="Nome da Criança" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2 text-white" />
                    <textarea placeholder="Carta com os desejos da criança..." value={newChildLetter} onChange={(e) => setNewChildLetter(e.target.value)} className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl p-3 text-white h-20 resize-none" />
                    <button 
                      onClick={() => {
                        if (!newChildName) return;
                        setChildrenList([...childrenList, {
                          id: Date.now().toString(),
                          name: newChildName,
                          age: 8,
                          gender: 'Menino',
                          status: 'Aguardando Apadrinhamento',
                          likes: 'brinquedos, escola',
                          dream: 'ser feliz',
                          address: 'Jardim Esperança - SP',
                          image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop',
                          letter: newChildLetter || 'Quero muito um presente especial!',
                          wishlist: [{ name: 'Brinquedo', price: 79.90 }]
                        }]);
                        setNewChildName('');
                        setNewChildLetter('');
                        setNotification('Criança cadastrada com sucesso!');
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-white shadow active:scale-[0.98]"
                    >
                      Adicionar Criança
                    </button>
                  </div>
                </div>
              )}

              {/* 4.13 GALERIA GERAL */}
              {adminTab === 'gallery' && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-amber-300">Gerenciamento de Galeria & Vídeos</h3>
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <label htmlFor="admin-gallery-upload" className="block py-3 rounded-xl bg-pink-600 text-white font-bold text-center cursor-pointer active:scale-[0.98]">
                      + Enviar Foto ou Vídeo da Galeria
                    </label>
                    <input id="admin-gallery-upload" type="file" accept="image/*,video/*" onChange={handleGalleryUpload} className="hidden" />
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {galleryItems.map((item, idx) => (
                        <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-amber-500/30 group">
                          {item.toLowerCase().endsWith('.mp4') || item.includes('video') ? (
                            <video src={item} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={item} alt="Media" className="w-full h-full object-cover select-none pointer-events-none" />
                          )}
                          <button 
                            onClick={() => {
                              const updated = galleryItems.filter((_, i) => i !== idx);
                              setGalleryItems(updated);
                              setNotification('Mídia excluída com sucesso!');
                            }} 
                            className="absolute top-1 right-1 p-1.5 rounded-lg bg-red-600 text-white shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4.14 SEGURANÇA */}
              {adminTab === 'security' && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-amber-300">Segurança & Senha do Painel</h3>
                  <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow">
                    <input type="password" placeholder="Nova Senha de Acesso ao Painel" className="w-full bg-[#1A1033] border border-amber-500/30 rounded-xl px-3 py-2.5 text-white" />
                    <button onClick={() => setNotification('Senha de segurança atualizada com sucesso!')} className="w-full py-3.5 rounded-xl bg-amber-600 font-bold text-white shadow active:scale-[0.98]">
                      Atualizar Senha
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. ÁREA DA FAMÍLIA (COM CADASTRO, LOGIN E EDIÇÃO PRÓPRIOS) */}
        {/* ==================================================== */}
        {currentScreenObj.id === 'family_profile' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 justify-between overflow-y-auto">
            
            {/* SE NÃO ESTIVER LOGADO COMO FAMÍLIA: MOSTRA CADASTRO OU LOGIN PERSONALIZADO */}
            {!familyUser.isLoggedIn ? (
              <div className="space-y-4 my-auto">
                <div className="flex items-center mb-2">
                  <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-lg font-bold ml-4">
                    {familyAuthMode === 'login' ? 'Área da Família: Acesso' : 'Cadastro da Família Acolhedora'}
                  </h2>
                </div>

                {/* Alternador de Modo: Login ou Cadastro */}
                <div className="flex bg-[#2A1840] p-1 rounded-2xl border border-purple-500/30 text-xs font-bold">
                  <button 
                    onClick={() => setFamilyAuthMode('login')} 
                    className={`flex-1 py-2 rounded-xl transition ${familyAuthMode === 'login' ? 'bg-amber-500 text-black shadow' : 'text-purple-300'}`}
                  >
                    Fazer Login
                  </button>
                  <button 
                    onClick={() => setFamilyAuthMode('register')} 
                    className={`flex-1 py-2 rounded-xl transition ${familyAuthMode === 'register' ? 'bg-amber-500 text-black shadow' : 'text-purple-300'}`}
                  >
                    Cadastrar Família
                  </button>
                </div>

                {familyAuthMode === 'login' ? (
                  <div className="space-y-3 bg-[#2A1840] p-5 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <p className="text-purple-200">Acesse com seus dados para gerenciar as cartas e acompanhar os padrinhos das crianças.</p>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail da Família</label>
                      <input 
                        type="email" 
                        placeholder="familia@larespereanca.org" 
                        value={familyLoginEmail} 
                        onChange={(e) => setFamilyLoginEmail(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-3 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Senha de Acesso</label>
                      <input 
                        type="password" 
                        placeholder="Senha" 
                        value={familyLoginPassword} 
                        onChange={(e) => setFamilyLoginPassword(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-3 text-white" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setFamilyUser({ ...familyUser, isLoggedIn: true, email: familyLoginEmail });
                        setNotification(`Bem-vinda de volta, Família!`);
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-xs shadow-xl active:scale-[0.98] text-white"
                    >
                      Entrar na Área da Família
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#2A1840] p-5 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <p className="text-purple-200">Cadastre sua família acolhedora no Lar Esperança com seus dados e história:</p>
                    
                    {/* Upload de Foto de Perfil da Família no Cadastro */}
                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400 select-none pointer-events-none shrink-0">
                        <img src={familyUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <label htmlFor="family-reg-avatar" className="px-3 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98] text-[11px]">
                        + Foto da Família (Galeria)
                      </label>
                      <input id="family-reg-avatar" type="file" accept="image/*" onChange={handleFamilyAvatarUpload} className="hidden" />
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome da Família / Responsáveis</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Família Silva e Souza" 
                        value={familyUser.name} 
                        onChange={(e) => setFamilyUser({ ...familyUser, name: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp / Telefone</label>
                      <input 
                        type="text" 
                        placeholder="(11) 98765-4321" 
                        value={familyUser.phone} 
                        onChange={(e) => setFamilyUser({ ...familyUser, phone: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        placeholder="familia@email.com" 
                        value={familyUser.email} 
                        onChange={(e) => setFamilyUser({ ...familyUser, email: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Senha</label>
                      <input 
                        type="password" 
                        placeholder="Crie sua senha de acesso" 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Sobre a Família (Descrição / Bio)</label>
                      <textarea 
                        placeholder="Fale um pouco sobre a sua família acolhedora e as crianças..." 
                        value={familyUser.bio} 
                        onChange={(e) => setFamilyUser({ ...familyUser, bio: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-20 resize-none text-xs" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setFamilyUser({ ...familyUser, isLoggedIn: true });
                        setNotification('Cadastro da família concluído com sucesso!');
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-xs shadow-xl active:scale-[0.98] text-white"
                    >
                      Concluir Cadastro & Entrar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* SE ESTIVER LOGADO COMO FAMÍLIA: MOSTRA ESPAÇO DEDICADO COM EDIÇÃO COMPLETA */
              <div className="space-y-4">
                
                {/* Header da Área da Família com Botão de Sair Ajustado */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow" title="Voltar ao Início">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold">Área da Família</h2>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => handleFamilyLogout(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 text-[10px] font-bold active:scale-[0.98] flex items-center space-x-1"
                      title="Sair da Conta"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>

                {/* BOTÃO DE DOAÇÃO NA PARTE DE CIMA DO PERFIL DA FAMÍLIA */}
                <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-600/30 to-amber-500/30 border border-amber-500/40 shadow">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Apoiar Lar com Doação</h4>
                      <p className="text-[10px] text-purple-200">Contribua via PIX direto para o Lar Esperança</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDonationClick}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-white font-bold text-[11px] shadow active:scale-[0.98]"
                  >
                    Doar Agora
                  </button>
                </div>

                {/* Card de Perfil da Família */}
                <div className="flex flex-col items-center bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow">
                  <div 
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500 mb-2 relative select-none pointer-events-auto cursor-pointer shadow group" 
                    onClick={() => setZoomedImage(familyUser.avatar)}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img src={familyUser.avatar} alt="Família" className="w-full h-full object-cover select-none pointer-events-none" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold">{familyUser.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-pink-300 text-[10px] mt-1 font-semibold">Família Acolhedora Cadastrada</span>
                  <p className="text-xs text-purple-200 text-center mt-2 px-2 italic">"{familyUser.bio}"</p>
                </div>

                {/* Navegação Interna da Família */}
                <div className="grid grid-cols-3 gap-1 bg-[#2A1840] p-1 rounded-2xl border border-purple-500/30 text-[10px] font-bold">
                  <button 
                    onClick={() => setFamilyTab('children')} 
                    className={`py-2 rounded-xl transition ${familyTab === 'children' ? 'bg-pink-600 text-white' : 'text-purple-300'}`}
                  >
                    Crianças
                  </button>
                  <button 
                    onClick={() => setFamilyTab('edit_profile')} 
                    className={`py-2 rounded-xl transition ${familyTab === 'edit_profile' ? 'bg-amber-600 text-white' : 'text-purple-300'}`}
                  >
                    Editar Perfil
                  </button>
                  <button 
                    onClick={() => setFamilyTab('account_settings')} 
                    className={`py-2 rounded-xl transition ${familyTab === 'account_settings' ? 'bg-red-600 text-white' : 'text-purple-300'}`}
                  >
                    Exclusão
                  </button>
                </div>

                {/* Aba 1: Crianças e Padrinhos Vinculados com Mensagem Visível do Padrinho */}
                {familyTab === 'children' && (
                  <div className="space-y-3">
                    <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow text-xs">
                      <h4 className="font-bold text-amber-300">Padrinhos das suas Crianças:</h4>
                      {childrenList.map((c, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-[#1A1033] border border-purple-500/30 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-xs">{c.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${c.status === 'Apadrinhado' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-amber-500/20 text-amber-300'}`}>
                              {c.status}
                            </span>
                          </div>

                          {c.sponsorName ? (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-center space-x-2.5">
                                <div 
                                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 select-none pointer-events-auto cursor-pointer shrink-0"
                                  onClick={() => setZoomedImage(sponsorUser.avatar)}
                                  onContextMenu={(e) => e.preventDefault()}
                                >
                                  <img src={sponsorUser.avatar} alt="Padrinho" className="w-full h-full object-cover select-none pointer-events-none" />
                                </div>
                                <div>
                                  <p className="text-pink-300 font-bold text-xs">Padrinho: {c.sponsorName}</p>
                                  <p className="text-[9px] text-purple-300">Apoio com carinho e proteção</p>
                                </div>
                              </div>

                              {/* MENSAGEM DO PADRINHO VISÍVEL PARA A FAMÍLIA */}
                              <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/70 to-purple-950/70 border border-pink-500/40 shadow space-y-1">
                                <div className="flex items-center space-x-1.5 text-pink-300 font-bold text-[11px]">
                                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                                  <span>Mensagem Especial do Padrinho {c.sponsorName}:</span>
                                </div>
                                <p className="text-purple-100 italic text-xs leading-relaxed pl-5">
                                  "{sponsorUser.familyMessage || 'Muito feliz em fazer parte da história desta criança e desta família abençoada! Que Deus cubra todos de paz e alegria.'}"
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[10px] text-purple-400 italic">Aguardando padrinho escolher esta criança...</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-pink-300">Cartas e Desejos das Crianças (Edição Direta da Família)</h3>
                      {childrenList.map((c, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-xs space-y-2 shadow">
                          <span className="font-bold text-white">{c.name}</span>
                          <textarea 
                            value={c.letter} 
                            onChange={(e) => {
                              const updated = [...childrenList];
                              updated[idx].letter = e.target.value;
                              setChildrenList(updated);
                            }}
                            className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-20 resize-none text-xs" 
                          />
                          <button 
                            onClick={() => setNotification(`Carta de ${c.name} atualizada com sucesso!`)}
                            className="w-full py-2 rounded-xl bg-pink-600 font-bold text-[10px] text-white shadow active:scale-[0.98]"
                          >
                            Salvar Carta de {c.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aba 2: Editar Dados da Família (Autonomia Total) */}
                {familyTab === 'edit_profile' && (
                  <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <h4 className="font-bold text-amber-300">Editar Cadastro da Minha Família:</h4>
                    
                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <img src={familyUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-pink-500 object-cover" />
                      <label htmlFor="family-avatar-upload" className="px-3 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98]">
                        + Trocar Foto da Galeria
                      </label>
                      <input id="family-avatar-upload" type="file" accept="image/*" onChange={handleFamilyAvatarUpload} className="hidden" />
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome da Família / Responsáveis</label>
                      <input 
                        type="text" 
                        value={familyUser.name} 
                        onChange={(e) => setFamilyUser({ ...familyUser, name: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp / Telefone</label>
                      <input 
                        type="text" 
                        value={familyUser.phone} 
                        onChange={(e) => setFamilyUser({ ...familyUser, phone: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        value={familyUser.email} 
                        onChange={(e) => setFamilyUser({ ...familyUser, email: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Sobre Nós / Mensagem da Família</label>
                      <textarea 
                        value={familyUser.bio} 
                        onChange={(e) => setFamilyUser({ ...familyUser, bio: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-20 resize-none text-xs" 
                      />
                    </div>

                    <button 
                      onClick={() => setNotification('Cadastro da família salvo com sucesso!')}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 font-bold text-white shadow-xl active:scale-[0.98]"
                    >
                      Salvar Informações
                    </button>
                  </div>
                )}

                {/* Aba 3: Exclusão / Cancelamento de Conta da Família */}
                {familyTab === 'account_settings' && (
                  <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-red-500/40 shadow text-xs">
                    <h4 className="font-bold text-red-300 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>Exclusão e Cancelamento de Cadastro</span>
                    </h4>
                    <p className="text-purple-200 leading-relaxed">
                      Caso não queira mais fazer parte do projeto, você pode solicitar a exclusão do cadastro da sua família acolhedora. Seus dados e históricos serão encerrados com total privacidade.
                    </p>
                    <button 
                      onClick={() => setShowFamilyExcludeConfirm(true)}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>Pedir Exclusão da Minha Conta de Família</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* RODAPÉ DEDICADO DA ÁREA DA FAMÍLIA: APENAS DOAÇÃO PIX (SEM A BARRA GERAL) */}
            <div className="pt-3 mt-4 border-t border-purple-900/60 flex flex-col items-center space-y-2">
              <button 
                onClick={handleDonationClick}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs shadow-xl flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <Gift className="w-4 h-4 text-white" />
                <span>Fazer Doação PIX ao Lar Esperança</span>
              </button>
              <button 
                onClick={() => setCurrentScreenIndex(0)} 
                className="text-[11px] text-purple-300 hover:text-white underline"
              >
                ← Voltar para a Tela Inicial
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. ÁREA DO PADRINHO (COM CADASTRO, LOGIN, SAÍDA PERFEITA E MENSAGEM PARA A FAMÍLIA) */}
        {/* ==================================================== */}
        {currentScreenObj.id === 'sponsor_profile' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 justify-between overflow-y-auto">
            
            {/* SE NÃO ESTIVER LOGADO COMO PADRINHO: MOSTRA CADASTRO OU LOGIN PERSONALIZADO */}
            {!sponsorUser.isLoggedIn ? (
              <div className="space-y-4 my-auto">
                <div className="flex items-center mb-2">
                  <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-lg font-bold ml-4">
                    {sponsorAuthMode === 'login' ? 'Área do Padrinho: Acesso' : 'Cadastro de Novo Padrinho'}
                  </h2>
                </div>

                {/* Alternador de Modo: Login ou Cadastro */}
                <div className="flex bg-[#2A1840] p-1 rounded-2xl border border-purple-500/30 text-xs font-bold">
                  <button 
                    onClick={() => setSponsorAuthMode('login')} 
                    className={`flex-1 py-2 rounded-xl transition ${sponsorAuthMode === 'login' ? 'bg-pink-600 text-white shadow' : 'text-purple-300'}`}
                  >
                    Fazer Login
                  </button>
                  <button 
                    onClick={() => setSponsorAuthMode('register')} 
                    className={`flex-1 py-2 rounded-xl transition ${sponsorAuthMode === 'register' ? 'bg-pink-600 text-white shadow' : 'text-purple-300'}`}
                  >
                    Cadastrar Padrinho
                  </button>
                </div>

                {sponsorAuthMode === 'login' ? (
                  <div className="space-y-3 bg-[#2A1840] p-5 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <p className="text-purple-200">Entre para gerenciar seus apadrinhamentos e acompanhar as cartinhas das crianças.</p>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail do Padrinho</label>
                      <input 
                        type="email" 
                        placeholder="carlos@email.com" 
                        value={sponsorLoginEmail} 
                        onChange={(e) => setSponsorLoginEmail(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-3 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Senha de Acesso</label>
                      <input 
                        type="password" 
                        placeholder="Senha" 
                        value={sponsorLoginPassword} 
                        onChange={(e) => setSponsorLoginPassword(e.target.value)} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-3 text-white" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setSponsorUser({ ...sponsorUser, isLoggedIn: true, email: sponsorLoginEmail });
                        setNotification('Bem-vindo, Padrinho!');
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98] text-white"
                    >
                      Entrar na Área do Padrinho
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#2A1840] p-5 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <p className="text-purple-200">Cadastre-se para apadrinhar uma ou mais crianças com facilidade:</p>
                    
                    {/* Upload de Foto de Perfil no Cadastro */}
                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-pink-500 select-none pointer-events-none shrink-0">
                        <img src={sponsorUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <label htmlFor="sponsor-reg-avatar" className="px-3 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98] text-[11px]">
                        + Foto de Perfil (Galeria)
                      </label>
                      <input id="sponsor-reg-avatar" type="file" accept="image/*" onChange={handleSponsorAvatarUpload} className="hidden" />
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome Completo</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Carlos Henrique" 
                        value={sponsorUser.name} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, name: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp</label>
                      <input 
                        type="text" 
                        placeholder="(11) 91234-5678" 
                        value={sponsorUser.phone} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, phone: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        placeholder="carlos@email.com" 
                        value={sponsorUser.email} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, email: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Senha</label>
                      <input 
                        type="password" 
                        placeholder="Crie sua senha de acesso" 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Sobre Você (Descrição / Bio do Padrinho)</label>
                      <textarea 
                        placeholder="Fale um pouco sobre você e sua motivação para apadrinhar..." 
                        value={sponsorUser.bio} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, bio: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-16 resize-none text-xs" 
                      />
                    </div>
                    <div>
                      <label className="text-pink-300 block mb-1 font-bold">Mensagem Especial para a Família (Visível na Área da Família)</label>
                      <textarea 
                        placeholder="Deixe uma palavra de carinho e esperança para a família da criança..." 
                        value={sponsorUser.familyMessage || ''} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, familyMessage: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-pink-500/40 rounded-xl p-2.5 text-white h-20 resize-none text-xs" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setSponsorUser({ ...sponsorUser, isLoggedIn: true });
                        setNotification('Cadastro de padrinho concluído!');
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98] text-white"
                    >
                      Concluir Cadastro & Apadrinhar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* SE ESTIVER LOGADO COMO PADRINHO: ESPAÇO DEDICADO COM SAÍDA PERFEITA */
              <div className="space-y-4">
                
                {/* Header do Padrinho com Saída Perfeita (Logout e Voltar ao Início) */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentScreenIndex(0)} 
                      className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"
                      title="Voltar para a Tela Inicial"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold">Área do Padrinho</h2>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => handleSponsorLogout(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 text-[10px] font-bold active:scale-[0.98] flex items-center space-x-1 shadow"
                      title="Desconectar / Sair da Conta"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>

                {/* BOTÃO DE DOAÇÃO NA PARTE DE CIMA DO PERFIL DO PADRINHO */}
                <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-600/30 to-amber-500/30 border border-amber-500/40 shadow">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Apoiar Lar com Doação</h4>
                      <p className="text-[10px] text-purple-200">Doe via PIX direto para o Lar Esperança</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDonationClick}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-white font-bold text-[11px] shadow active:scale-[0.98]"
                  >
                    Fazer Doação
                  </button>
                </div>

                {/* Card de Perfil do Padrinho com Foto da Galeria */}
                <div className="flex flex-col items-center bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow">
                  <div 
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500 mb-2 relative select-none pointer-events-auto cursor-pointer shadow group" 
                    onClick={() => setZoomedImage(sponsorUser.avatar)}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img src={sponsorUser.avatar} alt="Carlos" className="w-full h-full object-cover select-none pointer-events-none" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold">{sponsorUser.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-pink-300 text-[10px] mt-1 font-semibold">Padrinho Voluntário</span>
                  <p className="text-xs text-purple-200 text-center mt-2 px-2 italic">"{sponsorUser.bio}"</p>
                </div>

                {/* Navegação Interna do Padrinho */}
                <div className="grid grid-cols-4 gap-1 bg-[#2A1840] p-1 rounded-2xl border border-purple-500/30 text-[9px] font-bold">
                  <button 
                    onClick={() => setSponsorTab('my_children')} 
                    className={`py-2 rounded-xl transition ${sponsorTab === 'my_children' ? 'bg-pink-600 text-white' : 'text-purple-300'}`}
                  >
                    Apadrinhadas
                  </button>
                  <button 
                    onClick={() => setSponsorTab('sponsor_more')} 
                    className={`py-2 rounded-xl transition ${sponsorTab === 'sponsor_more' ? 'bg-amber-600 text-white' : 'text-purple-300'}`}
                  >
                    + Apadrinhar
                  </button>
                  <button 
                    onClick={() => setSponsorTab('edit_profile')} 
                    className={`py-2 rounded-xl transition ${sponsorTab === 'edit_profile' ? 'bg-pink-600 text-white' : 'text-purple-300'}`}
                  >
                    Meu Perfil
                  </button>
                  <button 
                    onClick={() => setSponsorTab('account_settings')} 
                    className={`py-2 rounded-xl transition ${sponsorTab === 'account_settings' ? 'bg-red-600 text-white' : 'text-purple-300'}`}
                  >
                    Exclusão
                  </button>
                </div>

                {/* Aba 1: Crianças Apadrinhadas (com botão de Remover / Tirar Apadrinhamento) */}
                {sponsorTab === 'my_children' && (
                  <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <h4 className="font-bold text-pink-400">
                      Crianças que você apadrinhou ({childrenList.filter(c => c.status === 'Apadrinhado').length}):
                    </h4>

                    {childrenList.filter(c => c.status === 'Apadrinhado').length === 0 ? (
                      <div className="text-center p-4 bg-[#1A1033] rounded-2xl border border-purple-500/20 space-y-2">
                        <p className="text-purple-300 italic">Você não tem crianças apadrinhadas no momento.</p>
                        <button 
                          onClick={() => setSponsorTab('sponsor_more')} 
                          className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs shadow active:scale-[0.98]"
                        >
                          Escolher Criança para Apadrinhar
                        </button>
                      </div>
                    ) : (
                      childrenList.filter(c => c.status === 'Apadrinhado').map((c, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-[#1A1033] border border-purple-500/30 space-y-2 shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-12 h-12 rounded-xl overflow-hidden border border-pink-500 select-none pointer-events-auto cursor-pointer"
                                onClick={() => setZoomedImage(c.image)}
                                onContextMenu={(e) => e.preventDefault()}
                              >
                                <img src={c.image} alt={c.name} className="w-full h-full object-cover select-none pointer-events-none" />
                              </div>
                              <div>
                                <span className="font-bold text-white block">{c.name}</span>
                                <span className="text-[10px] text-amber-300">Apadrinhamento Ativo</span>
                              </div>
                            </div>
                            <button onClick={() => { setSelectedChild(c); setCurrentScreenIndex(6); }} className="px-2.5 py-1.5 rounded-xl bg-purple-900/80 text-pink-300 text-[10px] font-semibold active:scale-[0.98]">
                              Ver Carta
                            </button>
                          </div>

                          {/* Opção para tirar apadrinhamento se desejar */}
                          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between">
                            <span className="text-[9px] text-purple-400">Deseja desvincular?</span>
                            <button 
                              onClick={() => handleRemoveSponsorship(c.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 text-[10px] font-semibold active:scale-[0.98] transition border border-red-500/30"
                            >
                              Cancelar Apadrinhamento desta Criança
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Aba 2: Apadrinhar Mais Crianças */}
                {sponsorTab === 'sponsor_more' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-amber-300">Escolha Crianças para Apadrinhar (Clique para Apoiar):</h3>
                    {childrenList.filter(c => c.status !== 'Apadrinhado').length === 0 ? (
                      <p className="text-xs text-purple-300 italic p-3 bg-[#2A1840] rounded-2xl">Todas as crianças já foram apadrinhadas! Muito obrigado pelo carinho.</p>
                    ) : (
                      childrenList.filter(c => c.status !== 'Apadrinhado').map((c, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-[#2A1840] border border-purple-500/30 flex items-center justify-between shadow">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl overflow-hidden border border-pink-500 select-none pointer-events-auto cursor-pointer group"
                              onClick={() => setZoomedImage(c.image)}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              <img src={c.image} alt={c.name} className="w-full h-full object-cover select-none pointer-events-none" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{c.name}</h4>
                              <p className="text-[10px] text-purple-300">{c.age} anos • {c.gender}</p>
                              <p className="text-[10px] text-amber-300">Sonho: {c.dream}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSponsorChild(c.id)}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white text-[10px] font-bold shadow active:scale-[0.98]"
                          >
                            Quero Apadrinhar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Aba 3: Editar Cadastro do Padrinho & Mensagem para a Família */}
                {sponsorTab === 'edit_profile' && (
                  <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 shadow text-xs">
                    <h4 className="font-bold text-amber-300">Editar Meus Dados de Padrinho:</h4>
                    
                    <div className="flex items-center space-x-3 pb-2 border-b border-purple-900/50">
                      <img src={sponsorUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-pink-500 object-cover" />
                      <label htmlFor="sponsor-avatar-upload" className="px-3 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer active:scale-[0.98]">
                        + Trocar Foto da Galeria
                      </label>
                      <input id="sponsor-avatar-upload" type="file" accept="image/*" onChange={handleSponsorAvatarUpload} className="hidden" />
                    </div>

                    <div>
                      <label className="text-purple-300 block mb-1">Nome Completo</label>
                      <input 
                        type="text" 
                        value={sponsorUser.name} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, name: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">WhatsApp de Contato</label>
                      <input 
                        type="text" 
                        value={sponsorUser.phone} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, phone: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">E-mail</label>
                      <input 
                        type="email" 
                        value={sponsorUser.email} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, email: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Minha Descrição / Bio (Fale um pouco sobre você)</label>
                      <textarea 
                        value={sponsorUser.bio} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, bio: e.target.value })} 
                        className="w-full bg-[#1A1033] border border-purple-500/30 rounded-xl p-2.5 text-white h-16 resize-none text-xs" 
                      />
                    </div>

                    {/* CAMPO DE MENSAGEM DO PADRINHO VISÍVEL PARA A FAMÍLIA */}
                    <div className="p-3 rounded-2xl bg-[#1A1033] border border-pink-500/40 space-y-1">
                      <label className="text-pink-300 block font-bold flex items-center space-x-1.5">
                        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                        <span>Mensagem para a Família da Criança (Visível na Área da Família)</span>
                      </label>
                      <textarea 
                        placeholder="Deixe uma mensagem de amor e incentivo para a família acolhedora e as crianças que você apadrinhou..." 
                        value={sponsorUser.familyMessage || ''} 
                        onChange={(e) => setSponsorUser({ ...sponsorUser, familyMessage: e.target.value })} 
                        className="w-full bg-[#2A1840] border border-pink-500/40 rounded-xl p-2.5 text-white h-24 resize-none text-xs" 
                      />
                      <p className="text-[10px] text-purple-300">
                        Essa mensagem será exibida na tela da Família Acolhedora ao lado do seu nome!
                      </p>
                    </div>

                    <button 
                      onClick={() => setNotification('Cadastro de padrinho salvo com sucesso!')}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-white shadow-xl active:scale-[0.98]"
                    >
                      Salvar Informações
                    </button>

                    {/* Botão claro para Desconectar / Sair */}
                    <div className="pt-2 border-t border-purple-900/50 flex space-x-2">
                      <button 
                        onClick={() => handleSponsorLogout(false)}
                        className="flex-1 py-2.5 rounded-xl bg-red-600/30 text-red-200 font-bold text-xs border border-red-500/30 active:scale-[0.98] flex items-center justify-center space-x-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Desconectar Conta</span>
                      </button>
                      <button 
                        onClick={() => handleSponsorLogout(true)}
                        className="flex-1 py-2.5 rounded-xl bg-purple-900/80 text-purple-200 font-bold text-xs border border-purple-500/30 active:scale-[0.98]"
                      >
                        Sair e Ir para Início
                      </button>
                    </div>
                  </div>
                )}

                {/* Aba 4: Exclusão / Cancelamento de Participação */}
                {sponsorTab === 'account_settings' && (
                  <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-red-500/40 shadow text-xs">
                    <h4 className="font-bold text-red-300 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>Exclusão e Cancelamento de Padrinho</span>
                    </h4>
                    <p className="text-purple-200 leading-relaxed">
                      Caso não queira mais fazer parte do projeto como padrinho, você pode solicitar o encerramento do cadastro. Suas crianças apadrinhadas serão disponibilizadas novamente para outros padrinhos com total segurança.
                    </p>
                    <button 
                      onClick={() => setShowSponsorExcludeConfirm(true)}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>Pedir Exclusão da Minha Conta de Padrinho</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* RODAPÉ DEDICADO DA ÁREA DO PADRINHO: APENAS DOAÇÃO PIX (SEM A BARRA GERAL) */}
            <div className="pt-3 mt-4 border-t border-purple-900/60 flex flex-col items-center space-y-2">
              <button 
                onClick={handleDonationClick}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs shadow-xl flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <Gift className="w-4 h-4 text-white" />
                <span>Fazer Doação PIX ao Lar Esperança</span>
              </button>
              <button 
                onClick={() => setCurrentScreenIndex(0)} 
                className="text-[11px] text-purple-300 hover:text-white underline"
              >
                ← Voltar para a Tela Inicial
              </button>
            </div>
          </div>
        )}

        {/* 7. CHILD PROFILE */}
        {currentScreenObj.id === 'child_profile' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-base font-bold">Cartinha de {selectedChild.name}</h2>
                <div />
              </div>

              <div 
                className="w-full h-48 rounded-3xl overflow-hidden border border-pink-500 mb-4 select-none pointer-events-auto cursor-pointer relative group shadow-xl"
                onClick={() => setZoomedImage(selectedChild.image)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img src={selectedChild.image} alt={selectedChild.name} className="w-full h-full object-cover select-none pointer-events-none" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-3 bg-[#2A1840] p-4 rounded-3xl border border-purple-500/30 text-xs shadow">
                <div>
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">Sonho</span>
                  <p className="text-sm font-bold text-white">{selectedChild.dream}</p>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Carta do Lar</span>
                  <p className="text-purple-200 italic leading-relaxed">"{selectedChild.letter}"</p>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Lista de Desejos</span>
                  {selectedChild.wishlist.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-purple-900/40 text-purple-100">
                      <span>{item.name}</span>
                      <span className="font-bold text-amber-300">R$ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => { handleSponsorChild(selectedChild.id); setCurrentScreenIndex(5); }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98]"
            >
              Apadrinhar esta Criança Agora
            </button>
          </div>
        )}

        {/* 8. APPROVAL WORKFLOW */}
        {currentScreenObj.id === 'approval_workflow' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 justify-between">
            <div>
              <div className="flex items-center mb-4">
                <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-lg font-bold ml-4">Processo de Aprovação</h2>
              </div>
              <div className="space-y-3 my-4 text-xs">
                <div className="bg-[#2A1840] p-4 rounded-2xl border border-pink-500/30 shadow">
                  <h4 className="font-bold text-pink-300 mb-1">1. Escolha do Padrinho</h4>
                  <p className="text-purple-200">O padrinho seleciona a criança diretamente na sua área.</p>
                </div>
                <div className="bg-[#2A1840] p-4 rounded-2xl border border-amber-500/30 shadow">
                  <h4 className="font-bold text-amber-300 mb-1">2. Validação da Família</h4>
                  <p className="text-purple-200">A família acolhedora visualiza e confirma o apadrinhamento.</p>
                </div>
                <div className="bg-[#2A1840] p-4 rounded-2xl border border-purple-500/30 shadow">
                  <h4 className="font-bold text-purple-300 mb-1">3. Validação do Projeto</h4>
                  <p className="text-purple-200">Nossa equipe valida o processo com total segurança.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setCurrentScreenIndex(0)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98]">
              Voltar ao Início
            </button>
          </div>
        )}

        {/* 9. WAITING AREA */}
        {currentScreenObj.id === 'waiting_area' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
              <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-lg font-bold ml-4">Área de Espera</h2>
            </div>
            <div className="space-y-3">
              {childrenList.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#2A1840] border border-purple-500/30 flex items-center justify-between shadow">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-xl overflow-hidden border border-pink-500 select-none pointer-events-auto cursor-pointer"
                      onClick={() => setZoomedImage(c.image)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover select-none pointer-events-none" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <span className="text-[10px] text-amber-300">{c.status}</span>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedChild(c); setCurrentScreenIndex(6); }} className="px-3 py-1.5 rounded-xl bg-purple-900/80 text-pink-300 text-xs font-semibold active:scale-[0.98]">Ver</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. GALLERY */}
        {currentScreenObj.id === 'gallery' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-lg font-bold">Galeria</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {galleryItems.map((img, idx) => (
                <div 
                  key={idx} 
                  className="h-36 rounded-2xl overflow-hidden border border-purple-500/30 relative select-none pointer-events-auto cursor-pointer group shadow"
                  onClick={() => setZoomedImage(img)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img src={img} alt="Gallery" className="w-full h-full object-cover select-none pointer-events-none" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11, 12, 13: SETTINGS */}
        {currentScreenObj.id === 'settings' && (
          <div className="flex-1 flex flex-col bg-[#1A1033] p-6 justify-between">
            <div>
              <div className="flex items-center mb-6">
                <button onClick={() => setCurrentScreenIndex(0)} className="p-2 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-lg font-bold ml-4">Configurações</h2>
              </div>
              <p className="text-xs text-purple-300">Todas as configurações avançadas estão disponíveis na Área do Painel de Gestão.</p>
            </div>
            <button onClick={() => setCurrentScreenIndex(0)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-xs shadow-xl active:scale-[0.98]">
              Voltar ao Início
            </button>
          </div>
        )}

        {/* MENU DRAWER (SIDEBAR DA HOME) */}
        {isHomeMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHomeMenuOpen(false)} />
            <div className="relative w-72 bg-[#1C1233] h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r border-purple-900 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-purple-900/60 mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <div 
                        className="w-13 h-13 rounded-full border-2 border-pink-500 overflow-hidden shadow-lg relative bg-purple-950 flex items-center justify-center transition"
                        onClick={() => setZoomedImage(homeMenuAvatar)}
                        title="Ver foto em tamanho real"
                      >
                        <img 
                          src={homeMenuAvatar} 
                          alt="Avatar Lar Esperança" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">Menu Lar Esperança</h4>
                      <p className="text-[10px] text-purple-300">
                        {familyUser.isLoggedIn ? familyUser.name : (sponsorUser.isLoggedIn ? sponsorUser.name : 'Meu Lar Esperança')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsHomeMenuOpen(false)} className="p-1.5 rounded-xl bg-purple-900/60 text-purple-200 hover:bg-purple-800 transition active:scale-[0.98]">
                    <ChevronLeft className="w-5 h-5 text-pink-400" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs font-medium">
                  <button onClick={() => { setCurrentScreenIndex(0); setIsHomeMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl bg-pink-600/20 border border-pink-500/30 text-pink-300 font-semibold active:scale-[0.98] shadow">
                    <Home className="w-4 h-4 text-pink-400" />
                    <span>Início</span>
                  </button>
                  <button onClick={() => { setCurrentScreenIndex(4); setIsHomeMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow">
                    <Heart className="w-4 h-4 text-purple-400" />
                    <span>Área da Família</span>
                  </button>
                  <button onClick={() => { setCurrentScreenIndex(5); setIsHomeMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Área do Padrinho</span>
                  </button>
                  <button onClick={() => { handleDonationClick(); setIsHomeMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-pink-600/30 to-amber-500/30 border border-amber-500/30 text-amber-200 font-semibold active:scale-[0.98] shadow">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Doação (PIX)</span>
                  </button>
                  <button onClick={() => { setCurrentScreenIndex(9); setIsHomeMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 active:scale-[0.98] shadow">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Galeria</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-900/60 space-y-2">
                <button onClick={() => { setCurrentScreenIndex(14); setIsHomeMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-3.5 py-3 rounded-2xl bg-[#2A1840] border border-purple-500/30 text-purple-200 text-xs font-semibold shadow active:scale-[0.98]">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span>Instalar Aplicativo (PWA)</span>
                </button>
                <button onClick={() => { setCurrentScreenIndex(3); setIsHomeMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-3.5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold shadow-xl active:scale-[0.98]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Painel de Gestão</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIDE MENU DRAWER DO PAINEL */}
        {isAdminMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdminMenuOpen(false)} />
            <div className="relative w-80 bg-[#1B1429] h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r border-amber-900/50 animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-amber-900/40 mb-6">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden select-none pointer-events-auto cursor-pointer shadow"
                      onClick={() => setZoomedImage(adminAvatar)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover select-none pointer-events-none" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">Menu de Gestão</h4>
                      <p className="text-[10px] text-amber-400">{adminName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAdminMenuOpen(false)} 
                    className="p-1.5 rounded-xl bg-amber-900/40 text-amber-200 hover:bg-amber-800 transition active:scale-[0.98]"
                    title="Fechar Menu"
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-400" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs font-medium">
                  <button onClick={() => { setAdminTab('dashboard'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-300 font-semibold active:scale-[0.98] shadow">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Visão Geral</span>
                  </button>
                  <button onClick={() => { setAdminTab('evangelical'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-200 font-bold active:scale-[0.98] shadow">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Temas Evangélicos & Versículos</span>
                  </button>
                  <button onClick={() => { setAdminTab('sponsors_families'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 font-semibold active:scale-[0.98] shadow">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>Gerenciar Padrinhos & Famílias</span>
                  </button>
                  <button onClick={() => { setAdminTab('festive'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-300 font-bold active:scale-[0.98] shadow">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>Natal, Neve & Fogos</span>
                  </button>
                  <button onClick={() => { setAdminTab('splash3d'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <Cloud className="w-4 h-4 text-pink-400" />
                    <span>Abertura 3D (Nuvem)</span>
                  </button>
                  <button onClick={() => { setAdminTab('buttons'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Gerenciar Botões</span>
                  </button>
                  <button onClick={() => { setAdminTab('media916'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Mídias 9:16 (Reels)</span>
                  </button>
                  <button onClick={() => { setAdminTab('carousel'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Banners do Carrossel</span>
                  </button>
                  <button onClick={() => { setAdminTab('children'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Gerenciar Crianças</span>
                  </button>
                  <button onClick={() => { setAdminTab('pix'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>PIX & Mensagem Doação</span>
                  </button>
                  <button onClick={() => { setAdminTab('settings'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span>Ícone / Botão PWA</span>
                  </button>
                  <button onClick={() => { setAdminTab('profile'); setIsAdminMenuOpen(false); }} className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl bg-[#2A1840] border border-amber-500/30 text-amber-100 active:scale-[0.98] shadow">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Meu Perfil</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/40 space-y-2">
                <button 
                  onClick={() => { setCurrentScreenIndex(0); setIsAdminMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-2 px-3.5 py-3 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold shadow active:scale-[0.98]"
                >
                  <Home className="w-4 h-4 text-pink-400" />
                  <span>Voltar para a Tela Inicial</span>
                </button>
                <button 
                  onClick={() => { setCurrentScreenIndex(1); setIsAdminMenuOpen(false); setNotification('Sessão encerrada.'); }}
                  className="w-full flex items-center justify-center space-x-2 px-3.5 py-3 rounded-2xl bg-red-600/30 text-red-200 text-xs font-bold shadow active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PWA INSTALL SCREEN */}
        {currentScreenObj.id === 'pwa_install' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#1A1033] via-[#2a1642] to-[#140b26] text-center">
            <div className="pt-8">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-pink-500 to-amber-400 p-1 mx-auto flex items-center justify-center mb-6 shadow-xl select-none pointer-events-none" onContextMenu={(e) => e.preventDefault()}>
                <img src={pwaCustomIcon} alt="PWA Icon" className="w-full h-full object-cover rounded-3xl select-none pointer-events-none" />
              </div>
              <h2 className="text-xl font-bold">Corações que Acolhe</h2>
              <span className="text-xs text-pink-400 font-medium">Instalação PWA</span>
            </div>

            <div className="my-auto space-y-4">
              <h4 className="text-base font-bold text-white">Instale nosso aplicativo no seu celular!</h4>
              <button onClick={() => setNotification('Instalando PWA...')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 font-bold text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-[0.98]">
                <Download className="w-5 h-5" />
                <span>Instalar Agora</span>
              </button>
            </div>

            <button onClick={() => setCurrentScreenIndex(0)} className="text-xs text-purple-300 underline">
              Voltar à Tela Inicial
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

