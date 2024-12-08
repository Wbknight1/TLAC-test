
class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="footer">
                <img id="footerimage" src="../assets/images/logo.png" alt="TLAC">
                <div class="copyright">@Group 8 - TLAC - MIS321</div>
            </div>`;
    }
}

customElements.define('footer-component', Footer);