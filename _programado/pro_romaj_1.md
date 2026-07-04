---
layout: laborfolio
title: Romaj ciferoj per Prologo 1
js:
    - folio-0c
    - tau-prolog
    - tau-prolog-util
---

<style>
    hr {
        border: none;
        border-top: 2px dotted cornflowerblue;
        margin-bottom: 1ex;
    }
    .demando code::before {
        content: "?-"
    }
</style>

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
{: #romaj_ciferoj contenteditable="true"}

### Demandoj kaj variabloj

Poste ni povas pridemandi la donitajn faktojn pri romaj ciferoj laŭ diversaj manieroj. Ĉe tio ni uzas *variablojn*.
Variabloj devas esti majusklaj (sen citiloj).

---

1\. Kion valoras la roma cifero 'C'? (kun variablo Valoro)

```prolog
roma_cifero('C',Valoro).
```
{:.demando #demando_1 contenteditable="true"}
[respondu]
{: .butonoj #resp_1}
<code id='respondo_1'></code>


---

2\. Kiu roma cifero havas la valoron kvindek?

```prolog
roma_cifero(Roma,50).
```
{:.demando #demando_2 contenteditable="true"}
[respondu]
{: .butonoj #resp_2}
<code id='respondo_2'></code>

---

3\. Ĉu la roma cifero 'D' havas la valoron mil?

```prolog
roma_cifero('D',1000).
```
{:.demando #demando_3 contenteditable="true"}
[respondu]
{: .butonoj #resp_3}
<code id='respondo_3'></code>

---

4\. Ĉu la roma cifero 'D' havas la valoron kvincent?

```prolog
roma_cifero('D',500).
```
{:.demando #demando_4 contenteditable="true"}
[respondu]
{: .butonoj #resp_4}
<code id='respondo_4'></code>

---

5\. Kiuj romaj ciferoj havas la valoron pli grandan ol 50?

```prolog
roma_cifero(Roma,Valoro), Valoro>50.
```
{:.demando #demando_5 contenteditable="true"}
[respondu]
{:.demando .butonoj #resp_5}
<code id='respondo_5'></code>

<script>


    butone((tasko) => {
        console.log(tasko);

        const nro = tasko.split('_')[1];
        const maks_respondoj = nro==5? 9:1;
        prologo('demando_'+nro,'respondo_'+nro,maks_respondoj);
    });

    async function prologo(id_demando,id_respondo,maks_respondoj) {
        const programo = document.querySelector('#romaj_ciferoj code').innerText;
        // console.log(programo);

        const seanco = await konsultu(programo);
        await demando_respondo(seanco,id_demando,id_respondo,maks_respondoj);
    }

</script>
