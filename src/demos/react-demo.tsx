import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'web-canvas-ui/theme.css';
import { Button, Canvas, Circle, Input, Rect, Slider, Switch, Text } from 'web-canvas-ui/react';

function DemoApp() {
    const [count, setCount] = useState(0);
    const [volume, setVolume] = useState(40);
    const [dark, setDark] = useState(false);
    const [name, setName] = useState('canvas-ui');

    const bg = dark ? '#1f1f1f' : '#fafafa';
    const border = dark ? '#444' : '#e5e5e5';
    const fg = dark ? '#f5f5f5' : '#222';
    const muted = dark ? '#aaa' : '#666';

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 720 }}>
            <h1 style={{ marginBottom: 4 }}>Canvas UI · React Demo</h1>
            <p style={{ marginTop: 0, color: '#666' }}>
                Everything below is rendered onto a single HTML5 <code>&lt;canvas&gt;</code> by the
                engine — try the button, slider, switch and input.
            </p>
            <Canvas
                width={680}
                height={420}
                ariaLabel="React canvas demo"
                style={{ border: '1px solid #ddd', borderRadius: 12 }}
            >
                <Rect
                    x={16}
                    y={16}
                    width={648}
                    height={388}
                    color={bg}
                    radius={12}
                    stroke={border}
                />
                <Text x={40} y={44} fontSize={24} color={fg} text={`Hello, ${name || 'world'}!`} />
                <Text
                    x={40}
                    y={82}
                    fontSize={14}
                    color={muted}
                    text={`Clicks: ${count}   ·   Volume: ${volume}`}
                />

                <Circle x={600} y={70} radius={30} color="#e74c3c" />

                <Input
                    x={40}
                    y={130}
                    width={280}
                    placeholder="Type a name…"
                    value={name}
                    onChange={setName}
                />
                <Button x={360} y={128} text="Click me" onClick={() => setCount((c) => c + 1)} />

                <Slider
                    x={40}
                    y={196}
                    width={280}
                    min={0}
                    max={100}
                    value={volume}
                    onChange={setVolume}
                />

                <Switch x={40} y={260} checked={dark} onChange={setDark} />
                <Text x={96} y={264} fontSize={14} color={fg} text="Dark mode" />
            </Canvas>
        </div>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DemoApp />
    </StrictMode>,
);
