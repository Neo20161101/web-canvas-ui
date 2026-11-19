import './style.css';
import Logo from './assets/web-canvas-ui-logo-bright.svg';
import LogoBright from './assets/web-canvas-ui-logo-bright.png';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header>
    <div class="logo">
        <img src="${Logo}" alt="TypeScript logo"/>
    </div>
</header>
<section id="center">
  <div class="hero">
    <img src="${LogoBright}" class="base" alt="TypeScript logo"/>
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
        <nav
            style="
                display: flex;
                gap: 16px;
                font-family: sans-serif;
                font-size: 14px;
            "
        >
            <a href="/react.html" style="color: #1677ff; text-decoration: none">React Demo →</a>
            <a href="/vue.html" style="color: #42b883; text-decoration: none">Vue Demo →</a>
            <a href="/svelte.html" style="color: #ff3e00; text-decoration: none">Svelte Demo →</a>
        </nav>
</section>
`;
