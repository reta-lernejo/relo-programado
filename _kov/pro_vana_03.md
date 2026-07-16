---
layout: laborfolio
title: Vortanalizo 1 - termtransformo
next_ch: pro_vana_2
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog
---

## Operatoroj kaj termtransormo


```prolog
% helpilo por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}

Oni povus daŭrigi simile kiel ni jam faris por derivado de radikoj per sufiksoj kaj
finaĵoj. Sed la reguloj estas iom malfacile legeblaj kaj oni rapide perus la superrigardon kun
kreskanta gramatiko. Ni serĉas rimedon koncize noti vortforman regulon.

```prolog
vorto('Df',Spc) <= 
  &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs),  % la finaĵo estu aplikebla al tiu vortspeco...
       Spc=Vs 
     ; Spc=Fs).

% radiko 
rv_sen_fin(r,Spc) <= 
  r(_,Spc,_). 
% radika vorto kun sufiksoj
rv_sen_fin('Ds',Spc) <= 
  &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).

```
{:.ignoru}

Ni bezonos tri apartajn signojn (operatorojn) por tio ĉi:

| `<=` | (= konstituiĝas el) apartigas regulkapon de regulkorpo |
| `&`  | referencas alian regulon |
| `~>` | enkondukas post la ĉefa parto de la regulo aldonajn kondiĉojn en normala sintakso de Prologo |

Ni unue rigardu la simplan regulon `rv_sen_fin(r,Spc) <= r(_,Spc,_).` antaŭ pluiri al la kmplikaĵoj.
Operatorojn oni povas difini per `op/3`, kies lasta argumento estas la koncerna signo (`<=`),
la unua la prioritato, kiu por `<=` estu inter tiu de `:-` (1200) kaj `;` (1100) - ĉar ni ja volas miksi
konvene nian vortforman sintakson kun ordinara Prologo. 

La dua argumento esprimas kiel la operatoro `f` situu kompare kun siaj unu (fx) aŭ du (xfx) argumentoj.

```prolog
:- op( 1120, xfx, '<=' ).
```
{:.programo}

{% include pl-demando.html n=99 query=
  'Regulo = (rv_sen_fin(r,Spc) <= r(_,Spc,_)).' %}

Por transformi termojn - laŭ nia propra sintakso - Prologo ofertas predikaton `term_expansion/2`, kies
unua argumento estas termo, kiu, se renkontata en la fontkodo, transformiĝos al la formo de la dua argumento.
Do la unua argumento respondos al nia regulsintakso kaj la dua estos ordinara Prolog-predikato, kian
ni en la antaŭaj lekcioj difinis por analizo de derivitaj vortoj. La korpo de `term_expansion` priskribas
la transformon mem.

Ni celas transformon de vortforma regulo al prologa regulo.

```prolog
term_expansion(
  <=(Regulkapo, Regulkorpo),ReguloTradukita) :-
    regul_kapo(Regulkapo,KapoTradukita),
    regul_korpo(Regulkorpo,KorpoTradukita),
    ReguloTradukita = (KapoTradukita :- KorpoTradukita).

% ankoraŭ konvene difinenda
regul_kapo(Kapo,Kapo).
regul_korpo(Korpo,Korpo).

% regulo por elprovi
vorto(Vrt,Fs,Rad/Fin) <= 
  r(Rad,Rs,Ofc),
  f(Fin,Fs),
  atom_concat(Rad,Fin,Vrt).

r(san,adj,'*').
f(o,subst).
```
{:.programo}

{% include pl-demando.html n=99 query=
  'vorto(sano,Spc,Ana).' %}

Do, tio jam funkcias, sed efektive tradukas nur `<=` al `:-`, do ankoraŭ ne tre utila.
En la sekva ĉapitro ni do plibonigos la tuton ellaborante la transformilojn `regul_kapo/2` kaj
`regul_korpo/2`.

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
