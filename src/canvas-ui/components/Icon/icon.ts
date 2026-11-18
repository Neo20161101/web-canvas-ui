import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export const ICON_NAMES = [
    'home',
    'house',
    'building',
    'apartment',
    'store',
    'mapPin',
    'map',
    'globe',
    'compass',
    'navigation',
    'flag',
    'mountain',
    'tree',
    'leaf',
    'flower',
    'sun',
    'moon',
    'cloud',
    'rain',
    'snow',
    'fire',
    'water',
    'wind',
    'car',
    'bus',
    'train',
    'plane',
    'bicycle',
    'ship',
    'rocket',
    'truck',
    'walk',
    'phone',
    'message',
    'mail',
    'bell',
    'calendar',
    'clock',
    'alarm',
    'camera',
    'image',
    'video',
    'music',
    'microphone',
    'headphones',
    'play',
    'pause',
    'stop',
    'record',
    'volume',
    'wifi',
    'bluetooth',
    'battery',
    'signal',
    'power',
    'monitor',
    'laptop',
    'tablet',
    'keyboard',
    'mouse',
    'printer',
    'folder',
    'file',
    'document',
    'download',
    'upload',
    'share',
    'link',
    'search',
    'settings',
    'sliders',
    'menu',
    'close',
    'check',
    'plus',
    'minus',
    'edit',
    'trash',
    'copy',
    'save',
    'lock',
    'unlock',
    'key',
    'user',
    'users',
    'heart',
    'star',
    'bookmark',
    'cart',
    'bag',
    'gift',
    'creditCard',
    'wallet',
    'chart',
    'pieChart',
    'barChart',
    'analytics',
    'shield',
    'warning',
    'info',
    'help',
    'question',
    'tag',
    'puzzle',
    'code',
    'database',
    'cloudDownload',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
export type IconVariant = 'outline' | 'solid';

export interface IconProps extends TransformProps {
    name: IconName;
    size?: number;
    color?: string;
    variant?: IconVariant;
    strokeWidth?: number;
}

interface IconGlyph {
    paths: readonly string[];
    circles?: readonly (readonly [number, number, number])[];
    filled?: readonly number[];
}

const ICON_GLYPHS: Record<IconName, IconGlyph> = {
    home: { paths: ['M3 10 L12 3 L21 10 M5 9 V21 H19 V9 M9 21 V14 H15 V21'] },
    house: {
        paths: ['M2 11 L12 2 L22 11 M4 10 V21 H20 V10 M9 21 V14 H15 V21', 'M3 11 H6 M18 11 H21'],
    },
    building: {
        paths: [
            'M4 21 V4 H16 V21 M16 9 H21 V21 M2 21 H22',
            'M7 7 H9 M12 7 H14 M7 11 H9 M12 11 H14 M7 15 H9 M12 15 H14 M18 12 H19 M18 16 H19',
        ],
    },
    apartment: {
        paths: [
            'M3 21 V3 H21 V21 M2 21 H22',
            'M7 7 H9 M15 7 H17 M7 11 H9 M15 11 H17 M7 15 H9 M15 15 H17 M10 21 V18 H14 V21',
        ],
    },
    store: {
        paths: [
            'M4 10 V21 H20 V10 M2 10 L4 3 H20 L22 10 M2 10 Q5 14 8 10 Q11 14 14 10 Q17 14 22 10',
            'M8 21 V14 H16 V21',
        ],
    },
    mapPin: {
        paths: ['M12 22 C9 18 4 13 4 9 A8 8 0 0 1 20 9 C20 13 15 18 12 22 Z'],
        circles: [[12, 9, 2.5]],
    },
    map: { paths: ['M3 6 L9 3 L15 6 L21 3 V18 L15 21 L9 18 L3 21 Z', 'M9 3 V18 M15 6 V21'] },
    globe: {
        paths: [
            'M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 Z',
            'M2 12 H22 M12 2 C7 7 7 17 12 22 M12 2 C17 7 17 17 12 22 M4 7 H20 M4 17 H20',
        ],
    },
    compass: {
        paths: [
            'M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 Z',
            'M15.5 8.5 L13 13 L8.5 15.5 L11 11 Z M12 2 V4 M22 12 H20',
        ],
    },
    navigation: { paths: ['M12 2 L21 21 L12 17 L3 21 Z M12 17 V9'] },
    flag: { paths: ['M5 22 V3 M5 4 C10 1 14 8 20 4 V15 C14 19 10 12 5 15'] },
    mountain: { paths: ['M2 21 L8 9 L11 14 L16 5 L22 21 Z M6 21 L10 14 M13 11 L16 15'] },
    tree: { paths: ['M12 22 V15 M5 15 L12 4 L19 15 Z M7 10 L12 2 L17 10 Z M8 22 H16'] },
    leaf: {
        paths: [
            'M21 3 C10 3 4 6 4 14 C4 18 7 21 11 20 C19 18 21 11 21 3 Z M3 21 L14 10 M8 16 L8 12 M12 12 L16 12',
        ],
    },
    flower: {
        paths: ['M12 13 V22 M12 18 C8 16 7 19 6 21 M12 18 C16 16 17 19 18 21'],
        circles: [
            [12, 7, 2],
            [12, 3, 2],
            [16, 7, 2],
            [12, 11, 2],
            [8, 7, 2],
        ],
    },
    sun: {
        paths: [
            'M12 7 A5 5 0 1 0 12 17 A5 5 0 1 0 12 7 Z',
            'M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M5 5 L6.5 6.5 M17.5 17.5 L19 19 M19 5 L17.5 6.5 M6.5 17.5 L5 19',
        ],
    },
    moon: { paths: ['M20 15 A8 8 0 0 1 9 4 A9 9 0 1 0 20 15 Z'] },
    cloud: { paths: ['M7 18 H18 A4 4 0 0 0 18 10 A7 7 0 0 0 5 11 A3.5 3.5 0 0 0 7 18 Z'] },
    rain: {
        paths: [
            'M7 14 H18 A4 4 0 0 0 18 6 A7 7 0 0 0 5 7 A3.5 3.5 0 0 0 7 14 Z',
            'M8 17 L7 20 M13 17 L12 20 M18 17 L17 20',
        ],
    },
    snow: {
        paths: [
            'M12 2 V22 M3.3 7 L20.7 17 M3.3 17 L20.7 7',
            'M9 4 L12 7 L15 4 M9 20 L12 17 L15 20 M4 10 L8 9 L7 5 M20 14 L16 15 L17 19 M4 14 L8 15 L7 19 M20 10 L16 9 L17 5',
        ],
    },
    fire: {
        paths: [
            'M12 22 C5 22 4 16 7 11 C8 9 9 7 9 4 C13 7 14 10 13 12 C16 11 17 8 17 7 C23 15 19 22 12 22 Z',
            'M12 19 C9 19 9 16 11 14 C12 13 13 12 13 11 C17 14 16 19 12 19 Z',
        ],
    },
    water: {
        paths: [
            'M12 2 C9 7 4 12 4 16 A8 8 0 0 0 20 16 C20 12 15 7 12 2 Z',
            'M8 17 C9 19 11 20 13 20',
        ],
    },
    wind: {
        paths: [
            'M3 8 H16 C20 8 20 3 17 3 C15 3 14 4 14 5 M2 12 H20 C23 12 23 17 20 17 C18 17 17 16 17 15 M4 16 H11',
        ],
    },
    car: {
        paths: [
            'M3 16 L5 8 H19 L21 16 V20 H3 Z M5 8 L7 4 H17 L19 8 M3 13 H21 M6 20 V22 M18 20 V22',
        ],
        circles: [
            [7, 17, 1],
            [17, 17, 1],
        ],
    },
    bus: {
        paths: [
            'M5 3 H19 A2 2 0 0 1 21 5 V19 H3 V5 A2 2 0 0 1 5 3 Z M3 12 H21 M6 6 H10 V10 H6 Z M14 6 H18 V10 H14 Z M6 19 V22 M18 19 V22',
        ],
        circles: [
            [7, 16, 1],
            [17, 16, 1],
        ],
    },
    train: {
        paths: [
            'M7 3 H17 A3 3 0 0 1 20 6 V16 A3 3 0 0 1 17 19 H7 A3 3 0 0 1 4 16 V6 A3 3 0 0 1 7 3 Z M4 12 H20 M8 22 L10 19 M16 22 L14 19',
        ],
        circles: [
            [8, 7, 1],
            [16, 7, 1],
        ],
    },
    plane: {
        paths: [
            'M2 13 L10 11 L14 3 L17 3 L16 10 L22 12 L22 14 L15 14 L12 21 L10 21 L10 14 L3 16 Z',
        ],
    },
    bicycle: {
        paths: [
            'M5 18 A3 3 0 1 0 5 24 A3 3 0 1 0 5 18 Z M19 18 A3 3 0 1 0 19 24 A3 3 0 1 0 19 18 Z M5 21 L9 13 L13 21 H5 L11 16 L15 11 L19 21 M13 11 H17 M9 13 H6',
        ],
    },
    ship: {
        paths: [
            'M3 14 L6 8 H18 L21 14 L19 19 H5 Z M8 8 V4 H15 V8 M2 21 Q6 19 10 21 Q14 19 18 21 Q20 20 22 21',
        ],
    },
    rocket: {
        paths: [
            'M12 2 C17 5 19 10 19 16 L12 21 L5 16 C5 10 7 5 12 2 Z M8 16 L4 20 V14 M16 16 L20 20 V14 M9 22 H15',
        ],
        circles: [[12, 9, 2]],
    },
    truck: {
        paths: ['M2 6 H15 V18 H2 Z M15 11 H19 L22 14 V18 H15 Z M5 18 V21 M19 18 V21 M15 14 H21'],
        circles: [
            [6, 18, 1.5],
            [18, 18, 1.5],
        ],
    },
    walk: {
        paths: [
            'M12 3 A2 2 0 1 0 12 7 A2 2 0 1 0 12 3 Z M11 9 L8 14 L4 16 M10 12 L15 14 L18 19 M8 14 L10 18 L8 22 M15 14 L14 18 L17 22',
        ],
    },
    phone: {
        paths: [
            'M7 2 H17 A2 2 0 0 1 19 4 V20 A2 2 0 0 1 17 22 H7 A2 2 0 0 1 5 20 V4 A2 2 0 0 1 7 2 Z M5 18 H19 M10 5 H14',
        ],
        circles: [[12, 20, 0.6]],
    },
    message: { paths: ['M3 4 H21 V17 H11 L5 21 V17 H3 Z M7 9 H17 M7 13 H14'] },
    mail: { paths: ['M3 5 H21 V19 H3 Z M3 6 L12 13 L21 6'] },
    bell: { paths: ['M5 17 H19 L17 14 V9 A5 5 0 0 0 7 9 V14 Z M10 20 H14'], circles: [[12, 3, 1]] },
    calendar: {
        paths: [
            'M3 5 H21 V21 H3 Z M3 9 H21 M7 2 V7 M17 2 V7 M7 13 H9 M12 13 H14 M17 13 H19 M7 17 H9 M12 17 H14',
        ],
    },
    clock: { paths: ['M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 Z M12 6 V12 L16 14'] },
    alarm: {
        paths: [
            'M12 22 A8 8 0 1 0 12 6 A8 8 0 1 0 12 22 Z M12 10 V14 L15 16 M4 3 L2 6 M20 3 L22 6 M8 22 L6 24 M16 22 L18 24',
        ],
    },
    camera: {
        paths: ['M3 7 H7 L9 4 H15 L17 7 H21 V20 H3 Z'],
        circles: [
            [12, 13, 4],
            [12, 13, 2],
        ],
    },
    image: {
        paths: ['M3 4 H21 V20 H3 Z M4 18 L10 11 L14 15 L17 12 L21 17'],
        circles: [[8, 8, 1.5]],
    },
    video: { paths: ['M3 6 H15 V18 H3 Z M15 10 L21 7 V17 L15 14 Z'] },
    music: {
        paths: ['M10 17 V5 L21 3 V15 M10 8 L21 6'],
        circles: [
            [7, 18, 3],
            [18, 16, 3],
        ],
    },
    microphone: {
        paths: [
            'M12 15 A3 3 0 0 0 15 12 V5 A3 3 0 0 0 9 5 V12 A3 3 0 0 0 12 15 Z M5 11 A7 7 0 0 0 19 11 M12 18 V22 M8 22 H16',
        ],
    },
    headphones: {
        paths: [
            'M3 13 V11 A9 9 0 0 1 21 11 V13 M3 13 H7 V20 H5 A2 2 0 0 1 3 18 Z M21 13 H17 V20 H19 A2 2 0 0 0 21 18 Z',
        ],
    },
    play: { paths: ['M6 3 L21 12 L6 21 Z'], filled: [0] },
    pause: { paths: ['M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z'], filled: [0, 1] },
    stop: { paths: ['M5 5 H19 V19 H5 Z'], filled: [0] },
    record: { paths: ['M3 12 A9 9 0 1 0 21 12 A9 9 0 1 0 3 12 Z'], circles: [[12, 12, 3]] },
    volume: { paths: ['M3 9 H7 L13 4 V20 L7 15 H3 Z M17 9 Q21 12 17 15 M19 6 Q25 12 19 18'] },
    wifi: {
        paths: ['M2 8 Q12 0 22 8 M5 12 Q12 6 19 12 M8 16 Q12 12 16 16'],
        circles: [[12, 20, 1]],
    },
    bluetooth: { paths: ['M12 2 L18 7 L12 12 L18 17 L12 22 V2 M5 7 L18 17 M5 17 L18 7'] },
    battery: { paths: ['M3 7 H20 V19 H3 Z M20 10 H22 V16 H20 M6 10 V16 M10 10 V16 M14 10 V16'] },
    signal: {
        paths: ['M3 20 V16 H6 V20 Z M9 20 V12 H12 V20 Z M15 20 V8 H18 V20 Z M21 20 V4 H24 V20 Z'],
    },
    power: { paths: ['M12 2 V12 M6 5 A9 9 0 1 0 18 5'] },
    monitor: { paths: ['M2 4 H22 V18 H2 Z M8 22 H16 M12 18 V22'] },
    laptop: { paths: ['M4 4 H20 V16 H4 Z M2 20 H22 L20 17 H4 Z'] },
    tablet: {
        paths: [
            'M6 2 H18 A2 2 0 0 1 20 4 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 V4 A2 2 0 0 1 6 2 Z M4 18 H20',
        ],
        circles: [[12, 20, 0.6]],
    },
    keyboard: {
        paths: [
            'M2 6 H22 V18 H2 Z M5 9 H6 M9 9 H10 M13 9 H14 M17 9 H18 M5 12 H6 M9 12 H10 M13 12 H14 M17 12 H18 M7 15 H17',
        ],
    },
    mouse: {
        paths: ['M12 22 A8 8 0 0 0 20 14 V10 A8 8 0 0 0 4 10 V14 A8 8 0 0 0 12 22 Z M12 3 V11'],
    },
    printer: {
        paths: [
            'M6 8 V3 H18 V8 M6 17 H4 A2 2 0 0 1 2 15 V10 A2 2 0 0 1 4 8 H20 A2 2 0 0 1 22 10 V15 A2 2 0 0 1 20 17 H18 M6 14 H18 V21 H6 Z',
        ],
        circles: [[18, 11, 0.8]],
    },
    folder: { paths: ['M2 6 H10 L12 9 H22 V20 H2 Z M2 9 H22'] },
    file: { paths: ['M5 2 H15 L20 7 V22 H5 Z M15 2 V7 H20 M8 12 H17 M8 16 H17'] },
    document: { paths: ['M4 3 H17 L21 7 V21 H4 Z M17 3 V7 H21 M8 11 H17 M8 15 H17 M8 18 H14'] },
    download: { paths: ['M12 2 V16 M6 10 L12 16 L18 10 M4 20 H20'] },
    upload: { paths: ['M12 16 V2 M6 8 L12 2 L18 8 M4 20 H20'] },
    share: {
        paths: ['M6 12 L18 5 M6 12 L18 19'],
        circles: [
            [5, 12, 3],
            [19, 4, 3],
            [19, 20, 3],
        ],
    },
    link: {
        paths: [
            'M9 15 L15 9 M7 17 L5 19 A4 4 0 0 1 2 13 L7 8 A4 4 0 0 1 13 8 M17 7 L19 5 A4 4 0 0 1 22 11 L17 16 A4 4 0 0 1 11 16',
        ],
    },
    search: { paths: ['M15 15 L22 22'], circles: [[10, 10, 7]] },
    settings: {
        paths: [
            'M12 2 L14 4 L17 4 L18 7 L21 9 L20 12 L21 15 L18 17 L17 20 L14 20 L12 22 L10 20 L7 20 L6 17 L3 15 L4 12 L3 9 L6 7 L7 4 L10 4 Z',
        ],
        circles: [[12, 12, 3]],
    },
    sliders: {
        paths: ['M3 6 H21 M3 12 H21 M3 18 H21'],
        circles: [
            [8, 6, 2],
            [15, 12, 2],
            [10, 18, 2],
        ],
    },
    menu: { paths: ['M3 6 H21 M3 12 H21 M3 18 H21'] },
    close: { paths: ['M5 5 L19 19 M19 5 L5 19'] },
    check: { paths: ['M3 12 L9 18 L21 5'] },
    plus: { paths: ['M12 3 V21 M3 12 H21'] },
    minus: { paths: ['M3 12 H21'] },
    edit: { paths: ['M4 16 L15 5 L19 9 L8 20 L3 21 Z M13 7 L17 11 M3 21 L4 16'] },
    trash: { paths: ['M4 7 H20 M10 3 H14 M6 7 L7 21 H17 L18 7 M10 11 V17 M14 11 V17'] },
    copy: { paths: ['M8 8 H20 V21 H8 Z M5 16 H3 V3 H15 V5'] },
    save: { paths: ['M3 3 H18 L21 6 V21 H3 Z M7 3 V9 H16 V3 M7 21 V14 H17 V21'] },
    lock: { paths: ['M5 11 H19 V21 H5 Z M8 11 V7 A4 4 0 0 1 16 7 V11'] },
    unlock: { paths: ['M5 11 H19 V21 H5 Z M8 11 V7 A4 4 0 0 1 15 4'] },
    key: { paths: ['M14 10 L22 2 M18 6 L21 9 M15 9 L18 12'], circles: [[8, 14, 6]] },
    user: { paths: ['M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21'], circles: [[12, 7, 4]] },
    users: {
        paths: [
            'M2 21 C2 17 5 15 9 15 M22 21 C22 17 19 15 15 15 M8 21 C8 16 11 14 15 14 C19 14 22 16 22 21',
        ],
        circles: [
            [8, 7, 3],
            [17, 7, 3],
        ],
    },
    heart: { paths: ['M12 21 L4 13 C-1 7 7 1 12 7 C17 1 25 7 20 13 Z'], filled: [0] },
    star: {
        paths: ['M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z'],
        filled: [0],
    },
    bookmark: { paths: ['M6 3 H18 V22 L12 18 L6 22 Z'] },
    cart: {
        paths: ['M2 3 H5 L8 17 H19 L22 7 H6 M9 21 H9.1 M18 21 H18.1'],
        circles: [
            [10, 21, 1.5],
            [18, 21, 1.5],
        ],
    },
    bag: { paths: ['M3 8 H21 L19 21 H5 Z M8 8 V6 A4 4 0 0 1 16 6 V8'] },
    gift: {
        paths: [
            'M3 10 H21 V21 H3 Z M2 6 H22 V10 H2 Z M12 6 V21 M12 6 C5 7 5 2 8 2 C11 2 12 6 12 6 C12 6 13 2 16 2 C19 2 19 7 12 6 Z',
        ],
    },
    creditCard: { paths: ['M2 5 H22 V19 H2 Z M2 10 H22 M6 15 H11'] },
    wallet: {
        paths: [
            'M3 6 H19 A2 2 0 0 1 21 8 V20 H3 A2 2 0 0 1 1 18 V6 A3 3 0 0 1 4 3 H18 V6 M15 12 H21 V17 H15 A2 2 0 0 1 15 12 Z',
        ],
        circles: [[17, 14.5, 0.7]],
    },
    chart: { paths: ['M3 21 V3 M3 21 H22 M7 17 L11 12 L15 15 L21 7'] },
    pieChart: { paths: ['M12 2 V12 H22 A10 10 0 1 1 12 2 Z M14 2 A8 8 0 0 1 22 10 H14 Z'] },
    barChart: { paths: ['M3 21 H22 M5 18 V11 H9 V18 Z M12 18 V5 H16 V18 Z M19 18 V8 H22 V18 Z'] },
    analytics: { paths: ['M3 21 V3 M3 21 H22 M6 17 L10 13 L13 15 L19 7 M16 7 H19 V10'] },
    shield: {
        paths: ['M12 2 L21 6 V12 C21 17 17 20 12 22 C7 20 3 17 3 12 V6 Z M8 12 L11 15 L17 9'],
    },
    warning: { paths: ['M12 3 L22 21 H2 Z M12 9 V14'], circles: [[12, 18, 0.8]] },
    info: {
        paths: ['M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 M12 11 V17'],
        circles: [[12, 7, 0.8]],
    },
    help: {
        paths: [
            'M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 M9 9 A3 3 0 1 1 14 12 C12 13 12 14 12 15',
        ],
        circles: [[12, 18, 0.7]],
    },
    question: {
        paths: [
            'M12 22 A10 10 0 1 0 12 2 A10 10 0 1 0 12 22 M9 9 A3 3 0 1 1 14 12 C12 13 12 14 12 15',
        ],
        circles: [[12, 18, 0.7]],
    },
    tag: { paths: ['M3 4 H13 L22 13 L13 22 L3 12 Z'], circles: [[8, 9, 1]] },
    puzzle: {
        paths: [
            'M3 3 H9 A3 3 0 1 0 15 3 H21 V9 A3 3 0 1 1 21 15 V21 H15 A3 3 0 1 0 9 21 H3 V15 A3 3 0 1 1 3 9 Z',
        ],
    },
    code: { paths: ['M8 5 L2 12 L8 19 M16 5 L22 12 L16 19 M14 3 L10 21'] },
    database: {
        paths: [
            'M3 5 C3 1 21 1 21 5 V19 C21 23 3 23 3 19 Z M3 5 C3 9 21 9 21 5 M3 12 C3 16 21 16 21 12',
        ],
    },
    cloudDownload: {
        paths: [
            'M7 15 H17 A4 4 0 0 0 17 7 A7 7 0 0 0 4 8 A3.5 3.5 0 0 0 7 15 Z M12 12 V21 M8 17 L12 21 L16 17',
        ],
    },
};

export const Icon = createComponent<IconProps>('icon');

export function drawIcon(context: CanvasRenderingContext2D, props: IconProps): void {
    const name = props.name;
    if (typeof name !== 'string' || !Object.prototype.hasOwnProperty.call(ICON_GLYPHS, name)) {
        throw new Error(`Unknown Canvas UI icon: ${String(name)}.`);
    }

    const glyph = ICON_GLYPHS[name as IconName];
    const size = number(props.size, 24);
    if (size <= 0) throw new RangeError('Icon size must be greater than zero.');
    if (props.variant !== undefined && props.variant !== 'outline' && props.variant !== 'solid') {
        throw new TypeError(`Unknown Canvas UI icon variant: ${String(props.variant)}.`);
    }
    const variant: IconVariant = props.variant === 'solid' ? 'solid' : 'outline';
    const baseWidth = number(props.strokeWidth, 2);
    if (baseWidth <= 0) throw new RangeError('Icon strokeWidth must be greater than zero.');
    context.save();
    context.translate(size / 2, size / 2);
    context.scale(size / 24, size / 24);
    context.translate(-12, -12);
    context.strokeStyle = string(
        props.color,
        themeColor(context, '--canvas-ui-icon-color', '#333'),
    );
    context.fillStyle = context.strokeStyle;
    context.lineWidth = ((variant === 'solid' ? Math.max(baseWidth, 4) : baseWidth) * 24) / size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    for (let index = 0; index < glyph.paths.length; index++) {
        context.beginPath();
        tracePath(context, glyph.paths[index]);
        if (variant === 'solid' && glyph.filled?.includes(index)) context.fill();
        context.stroke();
    }
    for (const [x, y, radius] of glyph.circles ?? []) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        if (variant === 'solid') context.fill();
        else context.stroke();
    }
    context.restore();
}

function tracePath(context: CanvasRenderingContext2D, path: string): void {
    const tokens = path.match(/[A-Z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    for (let index = 0; index < tokens.length;) {
        const command = tokens[index++];
        const read = (): number => Number(tokens[index++]);
        switch (command) {
            case 'M':
                x = read();
                y = read();
                startX = x;
                startY = y;
                context.moveTo(x, y);
                break;
            case 'L':
                x = read();
                y = read();
                context.lineTo(x, y);
                break;
            case 'H':
                x = read();
                context.lineTo(x, y);
                break;
            case 'V':
                y = read();
                context.lineTo(x, y);
                break;
            case 'C': {
                const controlX1 = read();
                const controlY1 = read();
                const controlX2 = read();
                const controlY2 = read();
                x = read();
                y = read();
                context.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, y);
                break;
            }
            case 'Q': {
                const controlX = read();
                const controlY = read();
                x = read();
                y = read();
                context.quadraticCurveTo(controlX, controlY, x, y);
                break;
            }
            case 'A': {
                const radiusX = read();
                const radiusY = read();
                const rotation = read();
                const largeArc = read() !== 0;
                const sweep = read() !== 0;
                const endX = read();
                const endY = read();
                traceArc(context, x, y, radiusX, radiusY, rotation, largeArc, sweep, endX, endY);
                x = endX;
                y = endY;
                break;
            }
            case 'Z':
                context.closePath();
                x = startX;
                y = startY;
                break;
            default:
                throw new Error(`Unsupported path command: ${command}.`);
        }
    }
}

function traceArc(
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    largeArc: boolean,
    sweep: boolean,
    endX: number,
    endY: number,
): void {
    let rx = Math.abs(radiusX);
    let ry = Math.abs(radiusY);
    if (rx === 0 || ry === 0 || (startX === endX && startY === endY)) {
        context.lineTo(endX, endY);
        return;
    }

    const angle = (rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const halfX = (startX - endX) / 2;
    const halfY = (startY - endY) / 2;
    const primeX = cos * halfX + sin * halfY;
    const primeY = -sin * halfX + cos * halfY;
    const scale = primeX ** 2 / rx ** 2 + primeY ** 2 / ry ** 2;
    if (scale > 1) {
        const factor = Math.sqrt(scale);
        rx *= factor;
        ry *= factor;
    }

    const numerator = Math.max(
        0,
        rx ** 2 * ry ** 2 - rx ** 2 * primeY ** 2 - ry ** 2 * primeX ** 2,
    );
    const denominator = rx ** 2 * primeY ** 2 + ry ** 2 * primeX ** 2;
    const direction = largeArc === sweep ? -1 : 1;
    const coefficient = denominator === 0 ? 0 : direction * Math.sqrt(numerator / denominator);
    const centerPrimeX = (coefficient * rx * primeY) / ry;
    const centerPrimeY = (coefficient * -ry * primeX) / rx;
    const centerX = cos * centerPrimeX - sin * centerPrimeY + (startX + endX) / 2;
    const centerY = sin * centerPrimeX + cos * centerPrimeY + (startY + endY) / 2;
    const startVectorX = (primeX - centerPrimeX) / rx;
    const startVectorY = (primeY - centerPrimeY) / ry;
    const endVectorX = (-primeX - centerPrimeX) / rx;
    const endVectorY = (-primeY - centerPrimeY) / ry;
    const startAngle = Math.atan2(startVectorY, startVectorX);
    const cross = startVectorX * endVectorY - startVectorY * endVectorX;
    const dot = startVectorX * endVectorX + startVectorY * endVectorY;
    let delta = Math.atan2(cross, dot);
    if (sweep && delta < 0) delta += Math.PI * 2;
    if (!sweep && delta > 0) delta -= Math.PI * 2;
    context.ellipse(centerX, centerY, rx, ry, angle, startAngle, startAngle + delta, !sweep);
}
