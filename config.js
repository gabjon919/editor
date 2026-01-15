(function() {
    const defaultConfig = {
        colorPrimary: '#2E86AB',
        colorBg: '#FAF8F6',
        siteName: 'Tumbergia Azul',
        siteSlogan: 'Bem-vindo ao',
        contactWhatsapp: '5535998425147',
        contactPhone: '(35) 99842-5147',
        contactEmail: 'tumbergiaazul@gmail.com',
        rulesHours: 'Check-in após 16h e check-out até 12h sendo ambos flexiveis. Silêncio após 22h para respeitar vizinhos.',
        rulesCapacity: 'O chalé acomoda até 2 pessoas. Visitas devem ser autorizadas previamente.',
        wifiSsid: 'Tumbergia Azul',
        wifiPassword: 'alameda561'
    };

    const config = JSON.parse(localStorage.getItem('chalet_config')) || defaultConfig;

    function applyConfig() {
        // Apply CSS Variables
        document.documentElement.style.setProperty('--primary', config.colorPrimary);
        document.documentElement.style.setProperty('--bg-main', config.colorBg);

        // Update site name in common places
        const titles = document.querySelectorAll('h1, .logo, .footer-content h3');
        titles.forEach(el => {
            if (el.textContent.includes('Tumbergia Azul') || el.classList.contains('logo') || el.tagName === 'H1') {
                el.innerHTML = el.innerHTML.replace('Tumbergia Azul', config.siteName);
            }
        });

        const footerSlogan = document.querySelector('.footer-content p');
        if (footerSlogan && footerSlogan.textContent.includes('Tumbergia Azul')) {
             footerSlogan.textContent = footerSlogan.textContent.replace('Tumbergia Azul', config.siteName);
        }

        // Page specific logic
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            const slogan = document.querySelector('.header-home p');
            if (slogan) slogan.textContent = config.siteSlogan;
        }

        if (path.includes('regras.html')) {
            const rules = document.querySelectorAll('.card p');
            rules.forEach(p => {
                if (p.textContent.includes('Check-in')) p.textContent = config.rulesHours;
                if (p.textContent.includes('acomoda até')) p.textContent = config.rulesCapacity;
            });
        }

        if (path.includes('contato.html') || path.includes('emergencia.html')) {
            const links = document.querySelectorAll('a');
            links.forEach(a => {
                if (a.href.startsWith('tel:') && !path.includes('emergencia.html')) {
                    a.href = 'tel:' + config.contactPhone.replace(/\D/g, '');
                    a.textContent = config.contactPhone;
                }
                if (a.href.startsWith('mailto:')) {
                    a.href = 'mailto:' + config.contactEmail;
                    a.textContent = config.contactEmail;
                }
                if (a.href.includes('wa.me')) {
                    a.href = `https://wa.me/${config.contactWhatsapp}?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20${encodeURIComponent(config.siteName)}`;
                }
            });
        }

        if (path.includes('wifi.html')) {
            const ssid = document.querySelector('.card-title');
            if (ssid) ssid.textContent = 'Rede:' + config.wifiSsid;
            
            // Update wifi script if exists
            const wifiScript = document.querySelector('script:not([src])');
            if (wifiScript && wifiScript.textContent.includes('senha =')) {
                // This is a bit hacky but works for pure JS
                window.conectarWifi = function(e) {
                    e.preventDefault();
                    const senha = config.wifiPassword;
                    const btn = document.getElementById('btn-conectar');
                    const label = document.getElementById('label-conectar');
                    navigator.clipboard.writeText(senha).then(() => {
                        label.innerText = "Senha Copiada!";
                        setTimeout(() => {
                            window.location.href = "intent://wifi/#Intent;scheme=android.settings.WIFI_SETTINGS;action=android.settings.WIFI_SETTINGS;end";
                            setTimeout(() => {
                                alert(`Senha copiada! Escolha a rede '${config.wifiSsid}' e cole a senha.`);
                                label.innerText = "Copiar senha";
                            }, 1500);
                        }, 800);
                    });
                };
            }
        }
        
        if (path.includes('bem-vindos.html')) {
             const wifiText = document.querySelectorAll('.info-text p');
             wifiText.forEach(p => {
                 if (p.innerHTML.includes('Rede:')) {
                     p.innerHTML = `Rede: <strong>${config.wifiSsid}</strong><br>Senha: <strong>${config.wifiPassword}</strong>`;
                 }
             });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyConfig);
    } else {
        applyConfig();
    }
})();
