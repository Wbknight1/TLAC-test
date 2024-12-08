class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="footer">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <img id="footerimage" src="/TLAC-test/assets/images/logo.png" alt="TLAC">
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="social-links mb-3">
                                <a href="#" class="mx-2"><i class="ri-facebook-circle-fill"></i></a>
                                <a href="#" class="mx-2"><i class="ri-twitter-fill"></i></a>
                                <a href="#" class="mx-2"><i class="ri-instagram-fill"></i></a>
                                <a href="#" class="mx-2"><i class="ri-youtube-fill"></i></a>
                                <a href="#" class="mx-2"><i class="ri-linkedin-box-fill"></i></a>
                            </div>
                            <p class="mb-0">
                                <i class="ri-map-pin-fill me-1"></i>
                                Hewson Hall Study Room 2001
                            </p>
                            <p>The University of Alabama, Tuscaloosa 35401</p>
                        </div>
                        <div class="col-md-4">
                            <div class="copyright">@Group 8 - TLAC - MIS321</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

customElements.define('footer-component', Footer);