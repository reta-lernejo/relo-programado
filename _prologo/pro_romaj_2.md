---
layout: laborfolio
title: Romaj ciferoj per Prologo 2
chapter: "2. kombinoj, listoj"
next_ch: pro_romaj_3
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog    
---

### Kombinoj kaj operatoroj

Antaŭ trakti romajn nombrojn, t.e. kunmetitajn el ciferoj, per Prologo, ni devas iom profundigi nian scion pri datumtipoj.
Ni jam vidis kiel uzi datumtipojn *nombro* kaj *atomo*. Sed oni povas ilin kombini en esprimoj kiel 'k(e,5)'. 
Tion oni kosekvence nomas *kombino*:

{% include prolog-ekzerco.html id="e1" query=
 "Kombino_1 = k(e,5), Kombino_2 = +(1,2), 
  Kombino_3 = roma_cifero('X',10)." %}

Kombinoj aspektas iom kiel funkcioj aŭ esprimoj en aliaj programlingvoj, sed ili ne aŭtomete kalkuliĝas. 
Uzataj kiel datumtipo, ili simple reprezentas sin mem - kvazaŭ formulo.

Kelkajn specialajn kombinojn oni povas skribi alternative per operatoro kiel en aritmetiko. Interne ili transformiĝas al
sia kombina formo. Ni elprovu tion per operatoro '+' kaj '=':

{% include prolog-ekzerco.html id="e2" query=
 "Kombino = +(1,2), Kombino = A+B." %}

Do, la egalsigno ne servas por aritmetika kalkulo, sed nur por egaligi du esprimojn. Sed ja ekzistas ankaŭ operatoro por aritmetiko: 'is':

{% include prolog-ekzerco.html id="e3" query=
 "Sumo is +(1,2), Kombino = 1+2, 
  Diferenco is Sumo - Kombino." %}

'Sumo' kalkuliĝas tuj pro uzo de 'is', sed 'Kombino' kalkuliĝas nur kiam ni uzas ĝin por kalkuli 'Diferenco'n.

### Listoj

Kombinoj kun '.' estas specialaj: oni konstruas per ĝi *listo*jn: la unua argumento estas la *kapo*, kaj la dua argumento estas la resto,
kiu siavice povas esti listo. Ĉar tiu ingigo kondukus al multaj malfacile legeblaj krampoj oni pli pratike skribas
listojn per angulaj krampoj. La fino der ĉiu listo estas la *malplena listo* []:

{% include prolog-ekzerco.html id="e4" query=
 "Fino = [], Listo1 = .(1,[]), Listo1 = .(1,Fino), Listo1 = [1],
  Listo123 = .(1,.(2,.(3,[]))), Listo123 = [1,2,3]." %}

Por analizi signarojn, kiel romaj nombroj, ni traktos ilin kiel listoj de signoj. Se ni havas roman nombron kiel atomo ni povas tiel transformi ĝin en liston de signoj:

{% include prolog-ekzerco.html id="e5" query=
 "Nombro = 'MMXXVI', atom_chars(Nombro,Signoj)." %}

Sed ekzistas eĉ pli eleganta maniero: se oni uzas duoblajn citilojn vorto aŭ teksto estas aŭtomate trakta kiel
signolisto.

{% include prolog-ekzerco.html id="e6" query=
 "Signoj = \"MMXXVI\"." %}

<script>

    async function prologo(demando,respondo,maks_respondoj) {
        //const programo = document.querySelector('#romaj_ciferoj code').innerText;
        // console.log(programo);
        const programo = '';

        const seanco = await konsultu(programo);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
    }

    preparu_ekzercojn(prologo);
</script>


