---
layout: laborfolio
title: Romaj ciferoj per Prologo
js:
    - tau-prolog
    - tau-prolog-util
---

* Enhavo
{:toc}

### Predikatoj


```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).

roma_nombro(Roma,Valoro) :- 
    atom_chars(Roma,Signoj),
    roma_sumo(Signoj,Valoro).

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
{: #romaj_ciferoj}


---


```prolog
?- roma_nombro('MCMXCIV',Valoro).
```
{: #demando_1}

respondo: <code id='respondo_1'></code>


```prolog
?- roma_nombro('MXMIV',Valoro).
```
{: #demando_2}

respondo: <code id='respondo_2'></code>

<script>

    async function prologo() {
        const programo = document.querySelector('#romaj_ciferoj code').textContent;
        console.log(programo);

        const seanco = await konsultu(pl,programo);
        await demando_respondo(seanco,'demando_1','respondo_1',1);
        await demando_respondo(seanco,'demando_2','respondo_2');
        //await pridemandu(seanco,'demando_3','respondo_3');
        //await pridemandu(seanco,'demando_4','respondo_4');
        //await pridemandu(seanco,'demando_5','respondo_5');
    }

    prologo();
</script>
