// language=CSS
export const CARD_STYLE = `
    .card {
        padding: 0.5rem;
        outline-offset: 4px;
        outline: var(--card-outline);
        border-radius: 5px;
        background: var(--card-bg);
        color: var(--card-fc);

    & .title {
        margin: 0;
        border-bottom: 1px solid #9fadd0;
        padding-bottom: 0.6rem;
    }

    }`;

// language=CSS
export const BUTTON_STYLE = `
    button {
        padding: 0 15px;
        height: 44px;
        display: flex;
        background: none;
        color: var(--content-fg);
        align-items: center;
        border: 1px solid cyan;
        border-radius: 6px;
    }
`
