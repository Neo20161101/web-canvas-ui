import { createApp, defineComponent, h, ref } from 'vue';
import 'web-canvas-ui/theme.css';
import { Button, Canvas, Circle, Input, Rect, Slider, Switch, Text } from 'web-canvas-ui/vue';

const DemoApp = defineComponent({
    name: 'VueCanvasDemo',
    setup() {
        const count = ref(0);
        const volume = ref(40);
        const dark = ref(false);
        const name = ref('canvas-ui');
        const theme = ref('theme-blue')

        const bg = () => (dark.value ? '#1f1f1f' : '#fafafa');
        const border = () => (dark.value ? '#444' : '#e5e5e5');
        const fg = () => (dark.value ? '#f5f5f5' : '#222');
        const muted = () => (dark.value ? '#aaa' : '#666');

        return () => {
            const currentCount = count.value;
            const currentVolume = volume.value;
            const currentDark = dark.value;
            const currentName = name.value;
            return h('div', { style: { fontFamily: 'sans-serif', padding: '24px', maxWidth: '720px' } }, [
                h('h1', { style: { marginBottom: '4px' } }, 'Canvas UI · Vue Demo'),
                h(
                    'p',
                    { style: { marginTop: '0', color: '#666' } },
                    'Everything below is rendered onto a single HTML5 <canvas> by the engine.',
                ),
                h(
                    Canvas,
                    {
                        width: 680,
                        height: 420,
                        ariaLabel: 'Vue canvas demo',
                        style: { border: '1px solid #ddd', borderRadius: '12px' },
                        class: theme.value,
                    },
                    {
                        default: () => [
                            h(Rect, {
                                x: 16,
                                y: 16,
                                width: 648,
                                height: 388,
                                color: bg(),
                                radius: 12,
                                stroke: border(),
                            }),
                            h(Text, {
                                x: 40,
                                y: 44,
                                fontSize: 24,
                                color: fg(),
                                text: `Hello, ${currentName || 'world'}!`,
                            }),
                            h(Text, {
                                x: 40,
                                y: 82,
                                fontSize: 14,
                                color: muted(),
                                text: `Clicks: ${currentCount}   ·   Volume: ${currentVolume}`,
                            }),
                            h(Circle, { x: 600, y: 70, radius: 30, color: '#e74c3c' }),
                            h(Input, {
                                x: 40,
                                y: 130,
                                width: 280,
                                placeholder: 'Type a name…',
                                value: currentName,
                                onChange: (v: string) => {
                                    name.value = v;
                                },
                            }),
                            h(Button, {
                                x: 360,
                                y: 128,
                                text: 'Click me',
                                onClick: () => {
                                    count.value += 1;
                                },
                            }),
                            h(Slider, {
                                x: 40,
                                y: 196,
                                width: 280,
                                min: 0,
                                max: 100,
                                value: currentVolume,
                                onChange: (v: number) => {
                                    volume.value = v;
                                },
                            }),
                            h(Switch, {
                                x: 40,
                                y: 260,
                                checked: currentDark,
                                onChange: (v: boolean) => {
                                    dark.value = v;
                                    theme.value = v?'theme-green':'theme-blue'
                                },
                            }),
                            h(Text, {
                                x: 96,
                                y: 264,
                                fontSize: 14,
                                color: fg(),
                                text: 'Dark mode',
                            }),
                        ],
                    },
                ),
            ]);
        };
    },
});

createApp(DemoApp).mount('#root');
