---
layout: laborfolio
title: 4.3 Vortanalizo - termtransformo
next_ch: pro_vana_04
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---

## Operatoroj

<!--
```prolog
% helpilo por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}
-->

Oni povus daŭrigi simile kiel ni jam faris por derivado de radikoj per sufiksoj kaj
finaĵoj. Sed la reguloj estas iom malfacile legeblaj kaj oni rapide perdus la superrigardon kun
kreskanta gramatiko. Ni serĉas do rimedon koncize noti vortfarajn regulojn.

La ideo estas formulado de reguloj, kiuj same kiel ordinaraj prologaj reguloj konsistas el kapo kaj korpo,
apartigitaj per speciala operatorsigno (ni uzos `<=`), sed kiuj kaŝas la ripetajn komplikaĵojn: 
ĉiu regulo havas la du argumentojn: analizenda vorto kaj
analizrezulto. Do ni povas forlasi ilin en la formulo. Sama la splitado de la vorto por analizi la
partojn estas komuna, ni forabstraktu tion en la regulkorpo: ĝi montru simple la sintezon de la
partoj, referencante al la antaŭa paŝo, ekzemple `rv_sen_fin` (radikvorto sen finaĵo kaj finaĵo).
Aldonajn kondiĉojn plenumendajn por ke la regulo estu aplikebla ni metu en apartan parton de la korpo,
jen post `~>`:


```prolog
% kunmeto de radikvorto kaj finaĵo. La finaĵo 
% difinas la rezultan vortspecon, sed konservas eventualan
% subspecon: speco 'best' estas konservata de finaĵo '-o'
vorto('Df',Spc) <= 
  &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs),  % la finaĵo estu aplikebla al tiu vortspeco...
       Spc=Vs 
     ; Spc=Fs).

% simpla radiko 
rv_sen_fin(r,Spc) <= 
  r(_,Spc,_). 

% radika vorto kun sufikso(j), la sufikso
% estu aplikebla al la vortspeco
rv_sen_fin('Ds',Spc) <= 
  &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).
```
{:.ignoru}

Ni bezonos tri apartajn signojn (*operatorojn*) por tio ĉi:

| `<=` | = konstituiĝas el, ĝi apartigas regulkapon de regulkorpo |
| `&`  | referencas alian regulon |
| `~>` | enkondukas post la ĉefa parto de la regulo aldonajn kondiĉojn en normala sintakso de Prologo |

Ni unue rigardu la simplan regulon `rv_sen_fin(r,Spc) <= r(_,Spc,_)`, antaŭ pluiri al la komplikaĵoj.
Operatorojn en Prologo oni povas difini per `op/3`, kies lasta argumento estas la koncerna signo (`<=`).

La unua estas la prioritato, kiu por `<=` estu inter tiu de `:-` (1200) kaj `;` (1100) - ĉar ni ja volas miksi
konvene nian vortfaran sintakson kun ordinara Prologo.

La dua argumento esprimas kiel la operatoro `f` situu kompare kun siaj unu (fx) aŭ du (xfx) argumentoj.

```prolog
:- op( 1120, xfx, '<=' ).
```
{:.programo}

Tiel Prologo rekonos la novan signon `<=` kiel operatoron inter du aliaj termoj, sed interne tradukos tion al la norma
formo `<=(Arg1,Arg2)`. Ĉe tio ĝi atentas la difinitan prioritaton: Se aperas `;` en la antaŭa aŭ posta termparto, ĝi apartenos
al la koncerna argumento, ĉar ĝi havas pli altan prioritaton (malpli altan rangon). Se aperos `:-` ĝi estos ekster la termo
pro pli alta rango.

{% include pl-demando.html query=
  'Regulo = (rv_sen_fin(r,Spc) <= r(_,Spc,_)).' %}

# Termtransformo

Por *transformi* termojn - laŭ nia propra sintakso - Prologo ofertas predikaton `term_expansion/2`, kies
unua argumento estas termo, kiu, se renkontata en la fontkodo, transformiĝos al la formo de la dua argumento.
Do la unua argumento respondos al nia regulsintakso kaj la dua estos ordinara Prolog-predikato, kian
ni en la antaŭaj lecionoj difinis por analizo de derivitaj vortoj. La korpo de `term_expansion` priskribas
la transformon mem.

Ni celas transformon de vortfara regulo al prologa regulo.

```prolog
term_expansion(
  <=(Regulkapo, Regulkorpo),ReguloTradukita) :-
    regul_kapo(Regulkapo,KapoTradukita),
    regul_korpo(Regulkorpo,KorpoTradukita),
    ReguloTradukita = (KapoTradukita :- KorpoTradukita).

% ankoraŭ konvene difinenda
regul_kapo(Kapo,KapoTradukita) :- KapoTradukita = Kapo.
regul_korpo(Korpo,KorpoTradukita) :- KorpoTradukita = Korpo.

% regulo por elprovi
vorto(Vrt,Fs,Rad/Fin) <= 
  r(Rad,Rs,Ofc),
  f(Fin,Fs),
  atom_concat(Rad,Fin,Vrt).

r(san,adj,'*').
f(o,subst).
```
{:.programo}

{% include pl-demando.html query=
  'vorto(sano,Spc,Ana).' %}

Do, tio jam funkcias, sed efektive tradukas nur `<=` al `:-`, do ankoraŭ ne tre utila.
En la sekva ĉapitro ni do plibonigos la tuton, ellaborante la transformilojn `regul_kapo/2` kaj
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
