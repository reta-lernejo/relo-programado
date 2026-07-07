---
layout: laborfolio
title: Romaj ciferoj per Prologo 4
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog
---

* Enhavo
{:toc}

### Gramatikoj


```prolog
% 1..9
i(1) --> "I".
i(2) --> "II".
i(3) --> "III".

r1_9(N) --> i(N). % 1..3
r1_9(4) --> "IV". 
r1_9(5) --> "V".
r1_9(N) --> "V", i(Ni), { N is 5+Ni }. % 6..8
r1_9(9) --> "IX".
```
{:.programo contenteditable="true"}

```prolog
% 1..39
x(10) --> "X".
x(20) --> "XX".
x(30) --> "XXX".

r1_39(NN) --> r1_9(NN). % 1..9
r1_39(NN) --> x(NN).    % 10, 20, 30
r1_39(NN) --> x(Nx), r1_9(N), { NN is Nx+N }.
```
{:.programo contenteditable="true"}

```prolog
% 1..99
r1_99(NN) --> r1_39(NN). % 1..39
r1_99(40) --> "XL".
r1_99(NN) --> "XL", r1_9(N),   { NN is 40+N }.  % 41..49
r1_99(50) --> "L".
r1_99(NN) --> "L",  r1_39(N_), { NN is 50+N_ }. % 51..89
r1_99(90) --> "XC".
r1_99(NN) --> "XC", r1_9(N),   { NN is 90+N }.  % 91..99
```
{:.programo contenteditable="true"}

```prolog
% 1..999
c(100) --> "C".
c(200) --> "CC".
c(300) --> "CCC".

r1_399(NNN) --> r1_99(NNN).
r1_399(NNN) --> c(NNN).
r1_399(NNN) --> c(Nc), r1_99(NN), { NNN is Nc+NN }.
```
{:.programo contenteditable="true"}

```prolog
% 1..999
r1_999(NNN) --> r1_399(NNN).
r1_999(400) --> "CD".
r1_999(NNN) --> "CD", r1_99(NN),   { NNN is 400+NN }.  % 401..499
r1_999(500) --> "D".
r1_999(NNN) --> "D",  r1_399(NN_), { NNN is 500+NN_ }. % 501..899
r1_999(900) --> "CM".
r1_999(NNN) --> "CM", r1_99(NN),   { NNN is 900+NN }.  % 901..999
```
{:.programo contenteditable="true"}

```prolog
% 1..3999
m(1000) --> "M".
m(2000) --> "MM".
m(3000) --> "MMM".

r1_3999(NNNN) --> r1_999(NNNN).
r1_3999(NNNN) --> m(NNNN).
r1_3999(NNNN) --> m(Nm), r1_999(NNN), { NNNN is Nm+NNN }.
```
{:.programo contenteditable="true"}

```prolog
roma_nombro(Roma,Valoro) :-
    number(Valoro),
    phrase(r1_3999(Valoro),RL),
    atom_chars(Roma,RL).

roma_nombro(Roma,Valoro) :-
    is_list(Roma),
    phrase(r1_3999(Valoro),Roma).

tempo(Celo,T) :- 
  get_time(T0),
  call(Celo),
  get_time(T1),!,
  T is T1-T0.    
```
{:.programo contenteditable="true"}



{% include prolog-ekzerco.html query=
  "tempo(roma_nombro(\"MCMXCIV\",Valoro),Tempo)." %}

{% include prolog-ekzerco.html query=
  "roma_nombro(\"IXV\",Valoro)." %}  

{% include prolog-ekzerco.html query=
  "tempo(roma_nombro(Roma,1887),Tempo)." %}

{% include prolog-ekzerco.html query=
  "roma_nombro(Roma,8)." %}

```prolog
nombru(De,Ghis,Roma) :-
    between(De,Ghis,N),
    phrase(r1_999(N),RL),
    atom_chars(Roma,RL).

```
{:.programo contenteditable="true"}  

{% include prolog-ekzerco.html n=1000 query=
  "tempo(findall(R,nombru(777,999,R),Romaj),Tempo)." %}



<script>

    async function prologo(demando,respondo,maks_respondoj) {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });
        
        const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
        const seanco = pl.create(limo);
        await konsultu(programo,seanco);
        const penseroj = await demando_respondo(seanco,demando,respondo,maks_respondoj);        
        console.log("penseroj: "+penseroj);
        informo(respondo,`penseroj: ${penseroj}/${limo}`);
    }

    preparu_ekzercojn(prologo);
</script>