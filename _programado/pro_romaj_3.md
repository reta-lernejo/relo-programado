---
layout: laborfolio
title: Romaj ciferoj per Prologo 3
js:
    - tau-prolog
    - tau-prolog-util
---

* Enhavo
{:toc}

### Gramatikoj


```prolog

:- use_module(library(dom)).

% 1..9
i(1) --> "I".
i(2) --> "II".
i(3) --> "III".

r1_9(N) --> i(N). % 1..3
r1_9(4) --> "IV". 
r1_9(5) --> "V".
r1_9(N) --> "V", i(Ni), { N is 5+Ni }. % 6..8
r1_9(9) --> "IX".

% 1..99
x(10) --> "X".
x(20) --> "XX".
x(30) --> "XXX".

r1_39(NN) --> r1_9(NN). % 1..9
r1_39(NN) --> x(NN).    % 10, 20, 30
r1_39(NN) --> x(Nx), r1_9(N), { NN is Nx+N }.

r1_99(NN) --> r1_39(NN). % 1..39
r1_99(40) --> "XL".
r1_99(NN) --> "XL", r1_9(N),   { NN is 40+N }.  % 41..49
r1_99(50) --> "L".
r1_99(NN) --> "L",  r1_39(N_), { NN is 50+N_ }. % 51..89
r1_99(90) --> "XC".
r1_99(NN) --> "XC", r1_9(N),   { NN is 90+N }.  % 91..99

% 1..999
c(100) --> "C".
c(200) --> "CC".
c(300) --> "CCC".

r1_399(NNN) --> r1_99(NNN).
r1_399(NNN) --> c(NNN).
r1_399(NNN) --> c(Nc), r1_99(NN), { NNN is Nc+NN }.

r1_999(NNN) --> r1_399(NNN).
r1_999(400) --> "CD".
r1_999(NNN) --> "CD", r1_99(NN),   { NNN is 400+NN }.  % 401..499
r1_999(500) --> "D".
r1_999(NNN) --> "D",  r1_399(NN_), { NNN is 500+NN_ }. % 501..899
r1_999(900) --> "CM".
r1_999(NNN) --> "CM", r1_99(NN),   { NNN is 900+NN }.  % 901..999

% 1..3999
m(1000) --> "M".
m(2000) --> "MM".
m(3000) --> "MMM".

r1_3999(NNNN) --> r1_999(NNNN).
r1_3999(NNNN) --> m(NNNN).
r1_3999(NNNN) --> m(Nm), r1_999(NNN), { NNNN is Nm+NNN }.

roma_nombro(Rom,Dec) :-
    number(Dec),
    phrase(r1_3999(Dec),RC),
    atom_chars(Rom,RC).

roma_nombro(Rom,Dec) :-
    atomic(Rom),
    atom_chars(Rom,RC),
    phrase(r1_3999(Dec),RC).

eligo_al(Id) :-
    get_by_id(Id,Elemento),
    open(Elemento,write,Fluo),
    set_output(Fluo).

nombru(De,Ghis) :-
    between(De,Ghis,N),
    roma_nombro(Roma,N),
    write(Roma),write(','),fail.
%nombru(_,_).    

renombru(De,Ghis) :-
    between(De,Ghis,N),
    romia(N,Roma),
    write(Roma),
    write(' --> '),
    roma_nombro(Roma,N1),
    write(N1),
    nl,fail.

```
{: #romaj_ciferoj}


---


```prolog
?- roma_nombro('MCMXCIV',Valoro).
```
{: #demando_1}

respondo: <code id='respondo_1'></code>

--- 


```prolog
?- roma_nombro(R,1887).
```
{: #demando_2}

respondo: <code id='respondo_2'></code>

---

```prolog
?- eligo_al(eligo_3),nombru(1,10).
```
{: #demando_3}
eligo: <code id="eligo_3" style="display: flex; flex-direction: column-reverse; white-space: pre-wrap;"></code>
respondo: <code id='respondo_3'></code>

<script>

    async function prologo() {
        const programo = document.querySelector('#romaj_ciferoj code').textContent;
        console.log(programo);

        const seanco = await konsultu(pl,programo);
        await demando_respondo(seanco,'demando_1','respondo_1');
        await demando_respondo(seanco,'demando_2','respondo_2');
        await demando_respondo(seanco,'demando_3','respondo_3',999);
        //await demando_respondo(seanco,'demando_4','respondo_4');
    }

    prologo();
</script>
