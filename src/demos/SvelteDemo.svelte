<script lang="ts">
    import { Button, Canvas, Circle, Input, Rect, Slider, Switch, Text } from '../canvas-ui/svelte';

    let count = $state(0);
    let volume = $state(40);
    let dark = $state(false);
    let name = $state('canvas-ui');

    const bg = $derived(dark ? '#1f1f1f' : '#fafafa');
    const borderColor = $derived(dark ? '#444' : '#e5e5e5');
    const fg = $derived(dark ? '#f5f5f5' : '#222');
    const muted = $derived(dark ? '#aaa' : '#666');
</script>

<div style="font-family: sans-serif; padding: 24px; max-width: 720px">
    <h1 style="margin-bottom: 4px">Canvas UI · Svelte Demo</h1>
    <p style="margin-top: 0; color: #666">
        Everything below is rendered onto a single HTML5 &lt;canvas&gt; by the engine.
    </p>
    <Canvas
        width={680}
        height={420}
        ariaLabel="Svelte canvas demo"
        style="border:1px solid #ddd;border-radius:12px"
    >
        <Rect x={16} y={16} width={648} height={388} color={bg} radius={12} stroke={borderColor} />
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
            onChange={(v: string) => (name = v)}
        />
        <Button x={360} y={128} text="Click me" onClick={() => (count += 1)} />
        <Slider
            x={40}
            y={196}
            width={280}
            min={0}
            max={100}
            value={volume}
            onChange={(v: number) => (volume = v)}
        />
        <Switch x={40} y={260} checked={dark} onChange={(v: boolean) => (dark = v)} />
        <Text x={96} y={264} fontSize={14} color={fg} text="Dark mode" />
    </Canvas>
</div>
