---
layout: laborfolio
title: Romaj ciferoj per Prologo 3
next_ch: pro_romaj_4
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog   
---

### Kombinoj, operatoroj kaj listoj

Ni jam vidis kiel uzi datumtipojn *nombro* kaj *atomo*. Sed oni povas ilin kombini en esprimoj kiel 'k(e,5)'. 
Tion oni kosekvence nomas *kombino*:

{% include prolog-ekzerco.html id="e1" query=
 "Kombino_1 = k(e,5), Kombino_2 = +(1,2), 
  Kombino_3 = roma_cifero('X',10)." %}

Kombinoj aspektas iom kiel funkcioj aŭ esprimoj en aliaj programlingvoj, sed ili ne aŭtomete kalkuliĝas. 
Uzataj kiel datumtipo, ili simple staras por si mem.

Kelkajn specialajn kombinojn oni povas skribi alternative per operatoro kiel en aritmetiko. Interne ili transformiĝas al
sia kombina formo. Ni elprovu tion per operatoro '+' kaj '=':

{% include prolog-ekzerco.html id="e2" query=
 "Kombino_1 = +(1,2), Kombino_2 = 1+2, 
  Egala = (Kombino_1 = Kombino_2)." %}

Do, la egalsigno ne servas por aritmetika kalkulo, sed nur por egaligi du esprimojn. Sed ja ekzistas ankaŭ operatoro por aritmetiko: 'is':

{% include prolog-ekzerco.html id="e2" query=
 "Sumo is +(1,2), Kombino = 1+2, 
  Diferenco is Sumo - Kombino." %}

'Sumo' kalkuliĝas tuj pro uzo de 'is', sed 'Kombino' kalkuliĝas nur kiam ni uzas ĝin por kalkuli 'Diferenco'n.

Kombinoj kun '.' estas specialaj: oni konstruas per ĝi *listo*jn: la unua argumento estas la *kapo*, kaj la dua argumento estas la resto,
kiu siavice povas esti listo. Ĉar tiu ingigo kondukus al multaj malfacile legeblaj krampoj oni pli pratike skribas
listojn per angulaj krampoj. La fino der ĉiu listo estas la *malplena listo* []:

{% include prolog-ekzerco.html id="e2" query=
 "Fino = [], Listo1 = .(1,[]), Listo1 = .(1,Fino), Listo1 = [1],
  Listo123 = .(1,.(2,.(3,[]))), Listo123 = [1,2,3]." %}



L = .(1,.(2,.(3,4)))

### Predikatoj, klaŭzoj, reguloj.


```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).

roma_nombro(Roma,Valoro) :- 
    atom(Roma),!,
    atom_chars(Roma,Signoj),
    roma_sumo(Signoj,Valoro).

%roma_nombro(Roma,Valoro) :- 
%    integer(Valoro),!,
%    roma_sumo(Signoj,Valoro),
%    atom_chars(Roma,Signoj).


roma_sumo([],0).
roma_sumo([Cifero],Valoro) :- roma_cifero(Cifero,Valoro).

roma_sumo([Granda,Malgranda|Resto],Valoro) :-
    roma_cifero(Malgranda,MgVal),
    roma_cifero(Granda,GrVal),
    GrVal>=MgVal,!,
    roma_sumo([Malgranda|Resto],RestValoro),
    Valoro is GrVal + RestValoro.

roma_sumo([Malgranda,Granda|Resto],Valoro) :-
    roma_cifero(Malgranda,MgVal),
    roma_cifero(Granda,GrVal),
    (GrVal is MgVal * 5; GrVal is MgVal * 10),!,
    roma_sumo([Granda|Resto],RestValoro),
    Valoro is - MgVal + RestValoro.

roma_sumo([_,_|_],_) :- throw(malvalida).

```
{: #romaj_ciferoj contenteditable="true"}


---


```prolog
roma_nombro('MCMXCIV',Valoro).
```
{:.demando #demando_1 contenteditable="true"}
[respondu]
{: .butonoj #resp_1}
<code id='respondo_1'></code>

--- 


```prolog
roma_nombro('MXMIV',Valoro).
```
{:.demando #demando_2 contenteditable="true"}
[respondu]
{: .butonoj #resp_2}
<code id='respondo_2'></code>

---

```prolog
roma_nombro('MMXXVI',2026).
```
{:.demando #demando_3 contenteditable="true"}
[respondu]
{: .butonoj #resp_3}
<code id='respondo_3'></code>

---

Bedaŭrinde tiu realigo havas limigojn. Unue ĝi permesas ankaŭ nevalidajn nombrojn, 
kiel ekzemple IXV.

```prolog
roma_nombro('IXV',A). 
```
{:.demando #demando_4 contenteditable="true"}
[respondu]
{: .butonoj #resp_4}
<code id='respondo_4'></code>

---

Alia problemo estas, ke ĝi ne funkcias en la kontraŭa direkto, t.e. traduki araban nombron en roman:

```prolog
roma_nombro(R,3). % 1887
```
{:.demando #demando_5 contenteditable="true"}
[respondu]
{: .butonoj #resp_5}
<code id='respondo_5'></code>

Por propre solvi tiujn mankojn ni povas eluzi la eblecon difini gramatikon en Prologo.

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


