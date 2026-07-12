---
layout: laborfolio
title: Romaj ciferoj per Prologo 6 - sintezo
js:
    - tau-prolog
    - taupl-util-0b
css:
    - tau-prolog
---

### Ellaboro de bona gramatiko de romaj nombroj

Unue ni aldonu la decimalajn valorojn kiel argumento de la gramatikaj elementoj 
kaj ni ankaŭ aldonas apartajn regulojn por la duciferaj 
nombreroj, kie la maldekstra subtahiĝas de la dekstra.

```prolog
:- use_module(library(statistics)).

nombrero(1000) --> "M".
nombrero(900)  --> "CM".
nombrero(500)  --> "D".
nombrero(400)  --> "CD".
nombrero(100)  --> "C".
nombrero(90)   --> "XC".
nombrero(50)   --> "L".
nombrero(40)   --> "XL".
nombrero(10)   --> "X".
nombrero(9)    --> "IX".
nombrero(5)    --> "V".
nombrero(4)    --> "IV".
nombrero(1)    --> "I".
```
{:.programo}

Krome ni donas regulon `roma_dec` kiu dismetas roman nombron en la
suprajn nombrerojn, kaj redonas ilin kiel listo. Ni uzas `!` por eviti, ke
du apudaj ciferoj reporve misinterpretiĝu. Ĉar ni ordigis la nombrerojn 
laŭ malkreska ordo, ni ekzemple trovos `IV` antaŭ `I` kaj ĉi-lastan tiam 
ne plu elprovos.
La predikato `sumo`simple adicias ĉiujn trovitajn valorojn por ricevi
la decimalan valoron de la tuta nombro.

```prolog
roma_dec([])     --> [].
roma_dec([V|Vj]) --> nombrero(V), !, roma_dec(Vj).

sumo([],0).
sumo([V|Vj],S) :-
    sumo(Vj,S1),
    S is V + S1.
```
{:.programo}

{% include pl-demando.html query=
  "phrase(roma_dec(Valoroj),\"MCMXCIV\"), sumo(Valoroj,Sumo)." %}

Nun ni ankoraŭ bezonas regulon por la alia direkto: kiam ni volas
scii kiel skribi decimalan nombron laŭ la roma. Por tio ni devos
kelkajn ordinarajn Prolog-termojn en la dekstran flankon de la gramatika
regulo. Ni atingos tion metante ilin en kunigajn krampojn `{...}`.


```prolog
dec_roma(0)   --> [].
dec_roma(Dec) --> { Dec > 0 },
    % trovu nomberon malpli grandan aŭ egalan al Dec
    nombrero(Valoro),
    { Valoro =< Dec,       
      !, % tranĉo: ni ne testu ankoraŭ pli malgrandajn nombrerojn
      Resto is Dec - Valoro 
    },
    % la restvaloron ni traktu laŭ la sama regulo
    dec_roma(Resto).
```
{:.programo}


{% include pl-demando.html query=
  "phrase(dec_roma(1887),Ciferoj), atom_chars(Roma,Ciferoj)." %}


Fine, pro komforto ni difinas ordinaran predikaton, kiu mem decidas,
kiun el la du gramatikreguloj `roma_dec`aŭ `dec_roma` necesas apliki.

Ĉe tio `ground(Termo)` testas, ke Termo ne plu enhavas liberan variablon.
Testi pri listo per `is_list/1`, ne sufiĉus, ĉar la listeroj ja povus esti variabloj
anstataŭ difinitaj ciferoj.


```prolog
roma_nombro(Roma,Dec) :-
  ground(Roma),
  phrase(roma_dec(RL), Roma), sumo(RL,Dec).

roma_nombro(Roma,Dec) :-
    number(Dec),
    phrase(dec_roma(Dec),Ciferoj),
    atom_chars(Roma,Ciferoj).
```
{:.programo}


{% include pl-demando.html query=
  "roma_nombro(\"MCMXCIV\",Valoro)." %}

{% include pl-demando.html query=
  "roma_nombro(\"IXV\",Valoro)." %}  

{% include pl-demando.html query=
  "roma_nombro(Roma,1887)." %}

{% include pl-demando.html query=
  "roma_nombro(Roma,8)." %}

Sed ve, malĝusta roma nombro tamen akceptiĝas:

{% include pl-demando.html query=
  'roma_nombro("VXI",Dec).' %}

Se ni ne volos akcepti tion, ni simple povus aldoni
pruvon, ke ĉiuj parta valoro en la intera listo,
estu pli granda ol la sekva.

```prolog

listo_ordigita([]).
listo_ordigita([_]).

listo_ordigita([Unua,Dua|Cetero]) :-
  % Tasko: aldonu teston pri listoj
  % de almenaŭ du elementoj
  true.

strikta_roma_nombro(Roma,Dec) :-
  ground(Roma),
  phrase(roma_dec(RL), Roma), 
  listo_ordigita(RL),
  sumo(RL,Dec).
```
{:.programo}  

Kiel tasko mi lasos al vi kompletigi la predikaton strikta_roma_nombro,
tiel, ke ĝi ne plu permesas nevalidan ciferordon.

{% include pl-demando.html query=
  'strikta_roma_nombro("VXI",Dec).' %}

Fine, ni nun povas nombri per romaj ciferoj. Eble vi volas
provizi vian liston de XCIX tezoj pri la reformo de la esperanta nombrosistemo
per romaj ciferoj.

```prolog
nombru(De,Ghis,Roma) :-
    between(De,Ghis,N),
    roma_nombro(Roma,N).
```
{:.programo}  

{% include pl-demando.html n=3999 query=
  "nombru(1,99,R)." %}

Se vi volas kolekti ĉiujn nombrojn anstataŭ trovi ilin unu post la alia. Vi atingos tion jene:

{% include pl-demando.html query=
  "findall(R,nombru(1,99,R),Romaj)." %}

Cetere, se vi volas plu elprovi tie ĉi la eblecojn de Prologo, vi povas rigardi en la
[referenco-paĝo de τ-Prologo](https://tau-prolog.org/documentation) pri diversaj uzeblaj predikatoj.


<script>
    const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
    preparu_programojn();
    preparu_demandojn(() => {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });
        return programo;
    }, limo);
</script>