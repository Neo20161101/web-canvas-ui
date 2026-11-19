import { StrictMode, useRef,useState,useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../canvas-ui/theme.css';
import {
    Canvas, Group,
    Input, Rect, Text, Dropdown, Slider, Textarea, Switch,
    Button, Grid, GridItem, Collapse, CollapseItem, Dialog,
    Tabs, TabItem, Progress, Image, DatePicker, Radio, Checkbox,
    Upload, Carousel, CarouselItem, CustomDraw,Icon,Circle
} from '../canvas-ui/react';
import type { CanvasExportOptions, CanvasHandle } from '../canvas-ui/canvas-handle';

function DemoApp() {
    const [count, setCount] = useState(0);
    const [volume, setVolume] = useState(40);
    const [dark, setDark] = useState(false);
    const [name, setName] = useState('canvas-ui');

    const bg = dark ? '#1f1f1f' : '#fafafa';
    const border = dark ? '#444' : '#e5e5e5';
    const fg = dark ? '#f5f5f5' : '#222';
    const muted = dark ? '#aaa' : '#666';
    const width = 1200;
    const height = 800;
    const canvasRef = useRef<CanvasHandle>(null);
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState('theme-blue');
    const [span2Width, setSpan2Width] = useState(100);
    const [radioValue, setRadioValue] = useState('Medium');
    const [checkboxValues, setCheckboxValues] = useState<string[]>(['SMS']);

    const getGridItemWidth = ({ width, columns, gap, columnSpan }: {
        width: number;
        columns: number;
        gap: number;
        columnSpan: number;
    }) => {
        const cellWidth = (width - gap * (columns - 1)) / columns;
        return cellWidth * columnSpan + gap * (columnSpan - 1);
    }

    useEffect(() => {
        const w = getGridItemWidth({ width: 395, columns: 3, gap: 8, columnSpan: 2 });
        setSpan2Width(w);
    },[])

    const onCanvasEvent = (event:any) => {
        console.log('Canvas event:', event);
    }

    const onBtnClick = () => {
        console.log('Name:', name);
        setOpen(!open);
    }
    const exportPng = () => {
        console.log(canvasRef.current)
        const dataUrl = canvasRef.current?.toDataURL({
            type: 'image/png',
            pixelRatio: 2,
        });
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'profile.png';
        link.click();
    };
    const handleFiles = (files: File[]) => {
        console.log('Selected files:', files);
    }
    const setActiveIndex = (index: number) => {
        console.log('Active carousel index:', index);
    }

    const onThemeClick = (bool: boolean) => {
        setTheme(bool ? 'dark' : 'theme-light');
        setDark(bool);
    }

    return (
        <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
            <h1 style={{ marginBottom: 4 }}>Canvas UI · React Demo</h1>
            <p style={{ marginTop: 0, color: '#666' }}>
                Everything below is rendered onto a single HTML5 <code>&lt;canvas&gt;</code> by the
                engine — try the button, slider, switch and input.
            </p>
            <Canvas
                width={width}
                height={height}
                ariaLabel="React canvas demo"
                style={{ border: '1px solid #ddd', borderRadius: 12 }}
                className={theme}
            >
                <Group x={16} y={16}>
                    <Rect
                        width={width - 32}
                        height={height - 32}
                        color={bg}
                        radius={12}
                        stroke={border}
                    />
                    <Text x={40} y={44} fontSize={24} width={250} maxLines={1} color={fg} text={`${name || 'world'}!`} />
                    <Text
                        x={40}
                        y={82}
                        fontSize={14}
                        color={muted}
                        text={`Clicks: ${count}   ·   Volume: ${volume}`}
                    />

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

                    <Switch x={40} y={260} checked={dark} onChange={onThemeClick} />
                    <Text x={96} y={264} fontSize={14} color={fg} text="Dark mode" />

                    <Circle x={96} y={364} radius={30} color="#1677ff" />
                    <Tabs x={16} y={424} width={320} height={180} defaultActiveKey="profile">
                        <TabItem id="profile" title="Profile">
                            <Text x={12} y={12}>Profile content</Text>
                        </TabItem>
                        <TabItem id="settings" title="Settings">
                            <Text x={12} y={12}>Settings content</Text>
                        </TabItem>
                    </Tabs>
                    <Textarea x={16} y={524} width={280} height={96} value={name} onChange={setName} />
                </Group>
                <Progress x={425} y={50} value={56} borderRadius={6} showText/>
                <Image x={425} y={130} src={'https://image.taixg.cn/202603/1772683098734.jpg'} width={320} height={100} />
                <Collapse x={425} y={240} width={320} defaultActiveKeys={['details']} accordion>
                    <CollapseItem id="details" title="Details" height={72}>
                        <Text x={12} y={8}>Panel content</Text>
                    </CollapseItem>
                    <CollapseItem id="more" title="More">
                        <Text x={12} y={8}>Another panel</Text>
                    </CollapseItem>
                </Collapse>
                <DatePicker x={425} y={400} />
                <Radio x={425} y={440} options={['Small', 'Medium', 'Large']} value={radioValue} onChange={setRadioValue} />
                <Checkbox x={425} y={480} options={['Email', 'SMS']} value={checkboxValues} onChange={setCheckboxValues} />
                <Upload x={425} y={510} height={60} accept="image/*" icon={'search'} text={'上传'} multiple onChange={files => handleFiles(files)} />
                <Carousel x={425} y={580} width={320} height={180} onChange={setActiveIndex} autoplay={false}>
                    <CarouselItem>
                        <Image width={320} height={180} src='https://image.taixg.cn/202506/1750046321943.jpg' objectFit="cover" />
                    </CarouselItem>
                    <CarouselItem>
                        <Image width={320} height={180} src="https://image.taixg.cn/202603/1772683098734.jpg" objectFit="cover" />
                    </CarouselItem>
                </Carousel>
                <CustomDraw
                    x={825}
                    y={24}
                    key={'custom-draw'}
                    width={160}
                    height={100}
                    onClick={onCanvasEvent}
                    draw={(ctx, { width, height }) => {
                        ctx.strokeStyle = '#1668dc';
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(width, height);
                        ctx.stroke();
                    }}
                />
                <Icon name="search" x={825} y={104} size={24} color="#1677ff" />
                <Icon name="heart" x={825} y={134} variant="solid" color="#e74c3c" />


                <Grid x={760} y={280} columns={3} width={395} cellHeight={150} gap={8}>
                    <GridItem columnSpan={2} backgroundColor={'#ccc'}>
                        <Rect width={span2Width} height={40} color="red" />
                        <Text y={6} width={span2Width}>跨两列的内容组</Text>
                        <Text y={24} textAlign={'center'} width={span2Width}>跨两列的内容组</Text>
                    </GridItem>
                    <GridItem backgroundColor={'#ddd'}>
                        <Rect width={80} height={40} color="#d5e5ff" />
                        <Text y={6}>1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组1列的内容组</Text>
                    </GridItem>
                    <GridItem backgroundColor={'#ddd'}>
                        <Rect width={80} height={40} color="#d5e5ff" />
                    </GridItem>
                    <GridItem backgroundColor={'#ddd'}>
                        <Rect width={80} height={40} color="#d5e5ff" />
                    </GridItem>
                    <GridItem backgroundColor={'#ddd'}>
                        <Rect width={80} height={40} color="#d5e5ff" />
                    </GridItem>
                </Grid>
            </Canvas>
        </div>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DemoApp />
    </StrictMode>,
);
