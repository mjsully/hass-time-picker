import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

function getMinutes(time) {
    let hours = parseInt(parseFloat(time) % 60);
    if (hours < 10) {
        hours = `0${hours}`
    }
    return String(hours)
    
}
function getHours(time) {
    let minutes = parseInt(parseFloat(time) / 60);
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return String(minutes)
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");

class WiredToggleCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    return html`
      <ha-card header="Example card">
        ${this.config.entities.map((ent) => {
          const stateObj = this.hass.states[ent];
          return stateObj
            ? html`
                <div class="state">
                    <div class="button-div">
                    <button
                        @click="${(ev) => this._toggle(stateObj, 60)}"
                    > ++ </button>
                    </div>
                    <div class="button-div">
                    <button
                        @click="${(ev) => this._toggle(stateObj, 1)}"
                    > + </button>
                    </div>
                </div>
                <div class="state">
                    <p> ${getHours(stateObj.state)}:${getMinutes(stateObj.state)} </p>
                </div>
                <div class="state">
                    <div class="button-div">
                    <button
                        @click="${(ev) => this._toggle(stateObj, -60)}"
                    > -- </button>
                    </div>
                    <div class="button-div">
                    <button
                        @click="${(ev) => this._toggle(stateObj, -1)}"
                    > - </button>
                    </div>
                </div>
              `
            : html` <div class="not-found">Entity ${ent} not found.</div> `;
        })}
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }

  _toggle(state, direction) {
    if (direction > 0) {
        for (let i = 0; i < direction; i++) {
            this.hass.callService("input_number", "increment", {
                entity_id: state.entity_id
              });
        }
        
    }
    else if (direction < 0) {
        for (let i = 0; i < (-1*direction); i++) {
            this.hass.callService("input_number", "decrement", {
                entity_id: state.entity_id
              });
        }
    }
  }

  static get styles() {
    return css`
      wired-card {
        background-color: var(--bg-color);
        padding: 16px;
        display: block;
        font-size: 18px;
      }
      .state {
        display: flex;
        justify-content: space-evenly;
        padding: 8px;
        align-items: center;
      }
      .button-div {
        width: 40%;
      }
      button {
        width: 100%;
      }
      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }
      wired-toggle {
        margin-left: 8px;
      }
    `;
  }
}
customElements.define("wired-toggle-card", WiredToggleCard);