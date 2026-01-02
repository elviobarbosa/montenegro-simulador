export default class Tabs {

    constructor() {
        this.selector = '[data-js="tabs"]';
        this.init();
    }

    init() {
        const selectors = document.querySelectorAll(this.selector);

        if (selectors.length > 0) {
            this.start(selectors);
        }
    }

    start(elements) {
        elements.forEach(el => {
            console.log(el);
            const tabs = el.querySelectorAll('.tablinks');
            const showTab = (ev) => {
                const { tab } = ev.currentTarget.dataset;
                let i, tabcontent, tablinks;
            
                tabcontent = el.getElementsByClassName('tabcontent');
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = 'none';
                }
            
                // Get all elements with class="tablinks" and remove the class "active"
                tablinks = el.getElementsByClassName('tablinks');
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(' active', '');
                }
            
                // Show the current tab, and add an "active" class to the button that opened the tab
                document.getElementById(tab).style.display = "block";
                ev.currentTarget.className += " active";
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', showTab )
            });
        });
    }
}
