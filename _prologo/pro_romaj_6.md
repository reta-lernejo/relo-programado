---
layout: laborfolio
title: Romaj ciferoj per Prologo 4
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog
---

### Rapidigo


```prolog
:- use_module(library(statistics)).

baza_nombro(1000) --> "M".
baza_nombro(900)  --> "CM".
baza_nombro(500)  --> "D".
baza_nombro(400) --> "CD".
baza_nombro(100) --> "C".
baza_nombro(90) --> "XC".
baza_nombro(50) --> "L".
baza_nombro(40) --> "XL".
baza_nombro(10) --> "X".
baza_nombro(9) --> "IX".
baza_nombro(5) --> "V".
baza_nombro(4) --> "IV".
baza_nombro(1)    --> "I".

% dismeto de roma nombro en la suprajn bazajn unuojn
roma_dec([]) --> [].
roma_dec([V|Vs]) -->
    baza_nombro(V),!,
    roma_dec(Vs).

% dismeto de decimala nombro en la bazajn nombrojn
dec_roma(0) --> [].
dec_roma(Dec) -->
    { Dec > 0 },
    % trovu bazan nombron egalan aŭ malpli grandan ol Dec
    baza_nombro(Valoro),
    { Valoro =< Dec,       
      !, % tranĉo: ni ne testu ankoraŭ pli malgrandajn bazajn nombrojn
      Resto is Dec - Valoro 
    },
    dec_roma(Resto).

sum([],0).
sum([X|Xs],N) :-
    sum(Xs,R),
    N is X+R.

roma_nombro(Roma,Dec) :-
  ground(Roma),
  phrase(roma_dec(RL), Roma), sum(RL,Dec).

roma_nombro(Roma,Dec) :-
    number(Dec),
    phrase(dec_roma(Dec),Ciferoj),
    atom_chars(Roma,Ciferoj).

```
{:.programo contenteditable="true"}

---


{% include prolog-ekzerco.html n=3 query=
  "roma_nombro(\"MCMXCIV\",Valoro)." %}

{% include prolog-ekzerco.html query=
  "roma_nombro(\"IXV\",Valoro)." %}  

{% include prolog-ekzerco.html query=
  "roma_nombro(Roma,1887)." %}

{% include prolog-ekzerco.html query=
  "roma_nombro(Roma,8)." %}

```prolog
nombru(De,Ghis,Roma) :-
    between(De,Ghis,N),
    roma_nombro(Roma,N).
```
{:.programo contenteditable="true"}  

{% include prolog-ekzerco.html n=1000 query=
  "nombru(777,999,R)." %}



<script>

    const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)

    function informo(seanco,respondo) {
      const thread = seanco.thread;
      const msg = 
        `${thread.cpu_time}ms, ` +
        `${thread.total_steps} penseroj`;
      tau_info(respondo,msg);
    };

    async function prologo(demando,respondo,maks_respondoj) {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });

        const seanco = pl.create(limo);
        tau_info(respondo,'');
        await konsultu(programo,seanco);
        const penseroj = await demando_respondo(seanco,demando,respondo,maks_respondoj);
        console.log("penseroj: "+penseroj);
        informo(seanco,respondo);
    };

    preparu_ekzercojn(prologo);
</script>