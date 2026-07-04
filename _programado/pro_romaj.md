---
layout: page
title: Romaj ciferoj per Prologo 1
---


<script src="https://cdn.jsdelivr.net/npm/tau-prolog@0.3.2/modules/core.min.js"></script>

* Enhavo
{:toc}

### Faktoj kaj atomoj

Ni unue difinu la romajn ciferojn kiel *faktoj*, 
indikante ankaŭ ilian valoron en arabaj ciferoj. 
La ciferojn mem ni esprimas per *atomoj* (tio estas nomoj de niaj scieroj). Atomoj
devas aŭ esti minusklaj aŭ donitaj en citiloj.

```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).
```
{: #romaj_ciferoj}

### Demandoj kaj variabloj

Poste ni povas pridemandi la donitajn faktojn pri romaj ciferoj laŭ diversaj manieroj. Ĉe tio ni uzas *variablojn*.
Variabloj devas esti majusklaj (sen citiloj).

---

Kion valoras la roma cifero 'C'? (kun variablo V)

```prolog
?- roma_cifero('C',V).
```
{: #demando_1}

respondo: <code id='respondo_1'></code>

---

Kiu roma cifero havas la valoron kvindek?

```prolog
?- roma_cifero(R,50).
```
{: #demando_2}

respondo: <code id='respondo_2'></code>

---

Ĉu la roma cifero 'D' havas la valoron mil?

```prolog
?- roma_cifero('D',1000).
```
{: #demando_3}

respondo: <code id='respondo_3'></code>

---

Ĉu la roma cifero 'D' havas la valoron kvincent?

```prolog
?- roma_cifero('D',500).
```
{: #demando_4}

respondo: <code id='respondo_4'></code>

---

Kiuj romaj ciferoj havas la valoron pli grandan ol 50?

```prolog
?- roma_cifero(R,V), V>50.
```
{: #demando_5}

respondo: <code id='respondo_5'></code>



<script>

    function konsultu(programo) {
        
        return new Promise((resolve, reject) => {
            const seanco = pl.create();
            seanco.consult(programo, {
                success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
                error: (err) => reject(new Error(`erara programo: ${err}`))
            });
        });
    }

    function demandu(seanco, demando) {
        return new Promise((resolve, reject) => {
            seanco.query(demando, {
                success: () => resolve(seanco), // redonu la seancon por la sekva paŝo
                error: (err) => reject(new Error(`erara demando: ${err}`))
            });
        });
    }

    function sekva_respondo(seanco) {
        return new Promise((resolve, reject) => {
            seanco.answer({
                success: (respondo) => resolve(respondo),
                fail: () => resolve(null), // ne (plu) troviĝas respondoj
                error: (err) => reject(new Error(`responderaro: ${err}`)),
                limit: () => reject(new Error("tro longa kalkulado"))
            });
        });
    }
    // retrovu ĉiujn respondojn al demando
    async function pridemandu(seanco,id_demando,id_respondo) {
        try {
            const demando = document.querySelector(`#${id_demando} code`)
                .textContent
                .replace(/^\s*\?\-/,'');
            // forigu evtl. antaŭajn respondojn
            document.getElementById(id_respondo).textContent ='';

            await demandu(seanco, demando);
            //console.log("✓ Demando sukcese kompreniĝis.");
            console.log('demando: '+demando)

            // ricevu unua respondon
            //let respondo = await sekva_respondo(seanco);
            let kiom = 0;

            let respondo;
            while( respondo = await sekva_respondo(seanco) ) {
                kiom += 1;

                if (respondo) {
                    // Antwort lesbar formatieren
                    //console.log("Respondo:", respondo)
                    //console.log("Belaranĝite:", pl.format_answer(respondo));
                    document.getElementById(id_respondo).append(pl.format_answer(respondo)+' ');
                } else {
                    console.log("Neniu solvo trovita (false).");
                }
                //respondo = await sekva_respondo(seanco);
            }

            // montru "false." se neniu respondo troviĝis
            if(!kiom) document.getElementById(id_respondo).append('false.');

        } catch (error) {
            console.error("Ĝenerala eraro:", error.message);
        }
    }

    async function prologo() {
        const programo = document.querySelector('#romaj_ciferoj code').textContent;
        console.log(programo);

        const seanco = await konsultu(programo);
        await pridemandu(seanco,'demando_1','respondo_1');
        await pridemandu(seanco,'demando_2','respondo_2');
        await pridemandu(seanco,'demando_3','respondo_3');
        await pridemandu(seanco,'demando_4','respondo_4');
        await pridemandu(seanco,'demando_5','respondo_5');
    }

    prologo();
</script>
