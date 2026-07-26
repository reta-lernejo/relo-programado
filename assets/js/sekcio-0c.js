/**
 * Se funkcio "lanĉe" estas difinita (uzante folio-*.js). Ni aldonas taskon por prepari la sekciojn.
 * Alternative vi povus mem voko Sekcio.aranĝo() en la evento window.onload() tiel:
 * window.onload = () => {
 *   Sekcio.aranĝo();
 * }
 */

if (typeof lanĉe === "function") {
    lanĉe(()=>Sekcio.aranĝo());
}

/**
 * subtenas faledeblajn sekciojn en laborfolioj
 * marku ilin per klaso sub la titoloj
 * {: .sekcio}
 * kaj voku tiel:
 *   window.onload = () => {
 *      Sekcio.aranĝo()
 *      // ... aliaj faraĵoj en via laborfolioj
 *   }
 */

class Sekcio {
    static aranĝo() {
        for (const s_titolo of document.querySelectorAll(".sekcio")) {
            const titolo = document.createTextNode(s_titolo.textContent);
            const details = document.createElement("details");
            details.id = s_titolo.id;
            details.classList.add("sekcio");
            const summary = document.createElement("summary");
            summary.setAttribute("markdown","span");
            summary.append(titolo);
            details.append(summary);

            // aldonu ĉiujn sekvantajn p-elementojn
            let sekva = s_titolo.nextElementSibling;

            while (sekva 
                && !sekva.classList.contains("sekcio")
                && sekva.tagName.toLowerCase() != s_titolo.tagName.toLowerCase()) // permesu ekz-e h3 sub h2.sekcio!
            {                
                details.append(sekva); // tio ankaŭ forigos ilin el la dokumento...
                sekva = s_titolo.nextElementSibling;
            }

            // anstataŭigu  malnovan titolon per la nova sekcio
            s_titolo.parentElement.replaceChild(details,s_titolo);
        }

        // kiam ni klakas ligon al unu el la sekcioj, la celata sekcio devos malfermiĝi
        // Ni limigas al "p a", por eviti "svg a"-elementojn, bedaŭrinde
        // querySelector ne subtenas elekton de nomspaco per sintakso "html|a"
        for (const a of document.querySelectorAll("p a")) {
            a.addEventListener("click", (event) => {
                const ct = event.currentTarget;
                const href = ct.getAttribute("href");
                if (href[0] == '#')
                    Sekcio.malfermu(href.substring(1));
            });
        }
        
    }

    static malfermu(s_id,fermu_aliajn) {
        //const sekcio = document.getElementById(s_id);
        for (const d of document.querySelectorAll(".sekcio")) {
          //  malfermu la celitan...
          if (d.id == s_id) {
              d.setAttribute("open","open");
          } else if (fermu_aliajn) {
            // fermu aliajn sekciojn 
              d.removeAttribute("open");
          }
        }
    }
}

/**
 * Subtenas aliajn faldeblajn elementoj, aparte kod-eltiroj.
 * Marku per klaso "faldebla"
 */
class Faldajho {
    static aranĝo(klasoj) {
        for (const faldajho of document.querySelectorAll("div.faldebla")) {
            const titolo = document.createTextNode(faldajho.getAttribute("title"));
            const details = document.createElement("details");
            details.id = faldajho.id;
            details.classList.add("faldebla",...klasoj.split());
            const summary = document.createElement("summary");
            //summary.setAttribute("markdown","span");
            summary.append(titolo);
            details.append(summary,faldajho.cloneNode(true));

            // anstataŭigu  malnovan titolon per la nova sekcio
            faldajho.parentElement.replaceChild(details,faldajho);
        }

        /*
        // kiam ni klakas ligon al unu el la sekcioj, la celata sekcio devos malfermiĝi
        // Ni limigas al "p a", por eviti "svg a"-elementojn, bedaŭrinde
        // querySelector ne subtenas elekton de nomspaco per sintakso "html|a"
        for (const a of document.querySelectorAll("p a")) {
            a.addEventListener("click", (event) => {
                const ct = event.currentTarget;
                const href = ct.getAttribute("href");
                if (href[0] == '#')
                    Faldajho.malfermu(href.substring(1));
            });
        }
        */
    }

    static malfermu(s_id) {
        for (const d of document.querySelectorAll(".faldebla")) {
          //  malfermu la celitan...
          if (d.id == s_id) {
              d.setAttribute("open","open");
          }
        }
    }
}

