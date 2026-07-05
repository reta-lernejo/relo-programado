---
layout: laborfolio
title: Romaj ciferoj per Prologo 1
js:
    #- folio-0c
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog    
---

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

1\. Kiom valoras la roma cifero 'C'? (kun variablo Valoro)

{% include prolog-ekzerco.html id="e1" query="roma_cifero('C',Valoro)." %}

2\. Kiu roma cifero havas la valoron kvindek?

{% include prolog-ekzerco.html id="e2" query="roma_cifero(Roma,50)." %}

3\. Ĉu la roma cifero 'D' havas la valoron mil?

{% include prolog-ekzerco.html id="e3" query="roma_cifero('D',1000)." %}

*Tasko*: Ĉu vi povas ŝanĝi la supran demandon tiel, ke la respondo estos 'jes'?

4\. Kiuj romaj ciferoj havas valoron pli grandan ol 50?

{% include prolog-ekzerco.html id="e4" n="9" query="roma_cifero(Roma,Valoro), Valoro>50." %}

5\. Kiuj romaj ciferoj havas valoron 50 aŭ 500?

{% include prolog-ekzerco.html id="e5" n="9" query="roma_cifero(Roma,Valoro), (Valoro=50;Valoro=500)." %}

*Tasko*: Demandu pri ĉiuj romaj ciferoj, kies valoro estas cent aŭ pli malalta ol cent!
(Vi povas uzi punktokomon kiel 'aŭ', sed ankaŭ rilaton '=<')

<script>

    async function prologo(demando,respondo,maks_respondoj) {
        const programo = document.querySelector('#romaj_ciferoj code').innerText;

        const seanco = await konsultu(programo);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
    }

    preparu_ekzercojn(prologo);

</script>
