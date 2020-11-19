class TOCElement extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
    <style>
      :host {
        display: block;
        position: relative;
        width: 200px;
        font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Ubuntu, Roboto, Noto, "Segoe UI", Arial, sans-serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.4;
      }
      ol {
        padding: 0 0 0 15px;
        margin: 0;
      }
      li {
        margin-bottom: 8px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.18s ease;
      }
      li.selected {
        color: var(--title-color,#000);
        opacity: 1;
        font-weight: 600;
      }
      label {
        margin-bottom: 8px;
        opacity: 0.6;
        display: block;
        letter-spacing: 0.5px;
      }
      @media(hover: hover) {
        li:hover {
          opacity: 1;
        }
      }
    </style>
    <div id="container">
      <label>Contents</label>
      <ol></ol>
    </div>
    `;
  }

  connectedCallback() {
    this.linkMap = new Map();
    this.reverseMap = new Map();

    const ol = this.root.querySelector('ol');

    const hs = document.querySelectorAll('h2');
    hs.forEach((h) => {
      const li = this._createItem(h.textContent);
      ol.appendChild(li);
      this.linkMap.set(li, h);
      this.reverseMap.set(h, li);

      li.addEventListener('click', (event) => {
        event.stopPropagation();
        const node = this.linkMap.get(li);
        if (node) {
          node.scrollIntoView({ block: "start", inline: "nearest", behavior: 'smooth' });
          setTimeout(() => this._resetHighlight(), 500);
          setTimeout(() => this._resetHighlight(), 1000);
        }
      });

      const observer = new IntersectionObserver((entries) => {
        this._resetHighlight();
      }, {
        rootMargin: '0px 0px -65% 0px'
      });
      observer.observe(h);
    });
  }

  _resetHighlight() {
    if (this._resetPending) {
      return;
    }
    this._resetPending = true;
    setTimeout(() => {
      this._resetPending = false;
      const cutOff = window.innerHeight * 0.35;
      const negatives = [];
      const positives = [];
      for (const hNode of this.reverseMap.keys()) {
        const top = hNode.getBoundingClientRect().top
        if (top < cutOff) {
          if (top < 0) {
            negatives.push({ hNode, top });
          } else {
            positives.push({ hNode, top });
          }
        }
        this.reverseMap.get(hNode).classList.remove('selected');
      }
      if (positives.length) {
        positives.sort((a, b) => {
          return a.top - b.top;
        });
        this.reverseMap.get(positives[0].hNode).classList.add('selected');
      } else if (negatives.length) {
        negatives.sort((a, b) => {
          return b.top - a.top;
        });
        this.reverseMap.get(negatives[0].hNode).classList.add('selected');
      }
    }, 200);
  }

  _createItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }
}

customElements.define('table-of-contents', TOCElement);