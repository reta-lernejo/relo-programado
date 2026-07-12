---
layout: laborfolio
title: Romaj ciferoj per Prologo 2 - termoj
chapter: "2. kombinoj, listoj"
next_ch: pro_romaj_3
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog    
---

### Termoj, kombinoj kaj operatoroj

Antaŭ trakti romajn nombrojn, t.e. kunmetitajn el ciferoj, per Prologo, ni devas iom profundigi nian scion pri *termo*j*.
Ni jam vidis kiel uzi termojn (datumtipojn) *nombro* kaj *atomo*. Sed oni povas ilin kombini en esprimoj kiel `k(e,5)`. 
Tion oni kosekvence nomas *kombino*:

{% include pl-demando.html query=
 "Kombino_1 = k(e,5), Kombino_2 = +(1,2), 
  Kombino_3 = roma_cifero('X',10)." %}

Kombinoj aspektas iom kiel funkcioj aŭ esprimoj en aliaj programlingvoj, sed ili ne aŭtomete kalkuliĝas. 
Uzataj kiel datumtipo, ili simple reprezentas sin mem - kvazaŭ formulo.

Kelkajn specialajn kombinojn oni povas skribi alternative per operatoro kiel en aritmetiko. Interne ili transformiĝas al
sia kombina formo. Ni elprovu tion per operatoro `+` kaj `=`:

{% include pl-demando.html query=
 "Kombino = +(1,2), Kombino = A+B." %}

Do, la egalsigno ne servas por aritmetika kalkulo, sed nur por egaligi du esprimojn. Sed ja ekzistas ankaŭ operatoro por aritmetiko:`is`:

{% include pl-demando.html query=
 "Sumo is +(1,2), Kombino = 1+2, 
  Diferenco is Sumo - Kombino." %}

'Sumo' kalkuliĝas tuj pro uzo de 'is', sed 'Kombino' kalkuliĝas nur kiam ni uzas ĝin por kalkuli 'Diferenco'n.

### Listoj

Kombinoj kun punkto `.` estas specialaj: oni konstruas per ĝi *listo*jn: 
la unua argumento estas la *kapo*, kaj la dua argumento estas la resto,
kiu siavice povas esti listo. Ĉar tiu ingigo kondukus al multaj malfacile legeblaj krampoj oni pli pratike skribas
listojn per angulaj krampoj. La fino der ĉiu listo estas la *malplena listo* `[]`:

{% include pl-demando.html query=
 "Fino = [], Listo1 = .(1,[]), Listo1 = .(1,Fino), Listo1 = [1],
  Listo123 = .(1,.(2,.(3,[]))), Listo123 = [1,2,3]." %}

Por analizi signarojn, kiel romaj nombroj, ni traktos ilin kiel listoj de signoj. Se ni havas roman nombron kiel atomo ni povas tiel transformi ĝin en liston de signoj:

{% include pl-demando.html query=
 "Nombro = 'MMXXVI', atom_chars(Nombro,Signoj)." %}

Sed ekzistas eĉ pli eleganta maniero: se oni uzas duoblajn citilojn vorto aŭ teksto estas aŭtomate traktata kiel
signolisto.

{% include pl-demando.html query=
 "Signoj = \"MMXXVI\"." %}

Liston oni povas ĉiam apartigi en kapon kaj reston per vertikala streko `|`. La unua, resp. duan kaj trian elementon do oni ricevas tiel:

{% include pl-demando.html query=
 "Signoj = \"MMXXVI\", Signoj = [Unua|Resto], 
  Signoj = [_,Dua,Tria|Ceteraj]." %}

La substreko `_` uziĝas kiel ĵokera variablo, kiam oni devas meti ion en konkretan pozicion de kombino, kies konkretan valoron oni nek scias, nek bezonas scii.

La longecon de listo oni ricevas per la predikato `length/2`. Se oni donas la longecon kiel nombro, oni 
ricevas ŝablonan liston kun tiom da variablaj elementoj. Per `maplist` ni povas apliki predikaton al ĉiu
listero, ekzemple egaligante ilin al steleto `*`.

```prolog
:- use_module(library(lists)).
```
{:.programo}

{% include pl-demando.html query=
 "length(Listo,3), maplist(=(*),Listo)." %}

Sed ni tiel ankaŭ povus ĵeti kvazaŭ tri ludkubojn:

```prolog
:- use_module(library(random)).
```
{:.programo}

{% include pl-demando.html query=
 "length(Listo,3), maplist(random_between(1,6),Listo)." %}

<!-- tio cikliĝas tro longe, kial?

Oni same povas krei listojn de diversaj longecoj ĝis 4-elementan tiel:

{ % include pl-demando.html n=10 query=
 "length(Listo,L), L<5." % }
-->

<script>
    const limo = 10000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
    preparu_programojn();
    preparu_demandojn(() => {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });
        return programo;
    }, limo);
</script>