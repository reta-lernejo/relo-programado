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

Ni unue difinu tiujn signojn kiel operatoroj. La unua argumento difinas la prioritaton kompare kun
aliaj operatoroj. Ni devas certigi, ke `<=` ricevas pli malaltan prioritaton ol `~>`,
sed ambaŭ havu prioritaton inter la aprioraj `:-` (1200) kaj `;` (1100) - ĉar ni ja volas miksi
konvene nian vortforman sintakson kun ordinara Prologo. `&` havu tre altan prioritaton, t.e.
aplikiĝu senpere al la posta termo, sed ja iom pli malaltan ol la list-operatoro `.` (100).

La dua argumento esprimas kiel la operatoro `f` situu kompare kun siaj unu (fx) aŭ du (xfx) argumentoj.
La argumentoj havas pli malaltan rangon ol la operatoro, sed kiam iu povas esti samranga oni uzas `y`.
Do en la kazo `xfy` la unua argumento devas esti valorigita antaŭ la parto `fy` konsideriĝos.

```prolog
:- op( 1120, xfx, '<=' ).
:- op( 1110, xfy, '~>' ).
:- op( 150, fx, '&' ).

```
{:.programo.kashita}

Por transformi termojn - laŭ nia propra sintakso - Prologo ofertas predikaton `term_expansion/2`, kies
unua argumento estas termo, kiu, se renkontata en la fontkodo, transformiĝos al la formo de la dua argumento.
Do la unua argumento respondos al nia regulsintakso kaj la dua estos ordinara Prolog-predikato, kian
ni en la antaŭaj lekcioj difinis por analizo de derivitaj vortoj. La korpo de `term_expansion` priskribas
la transformon mem.

```prolog
term_expansion( <=(Regulkapo, Regulkorpo), ReguloTradukita ) :-
    regul_kapo(Regulkapo,Vrt,Rez,_,Predikatkapo),!,
    regul_korpo(Regulkapo,Regulkorpo,Vrt,Rez,_,Predikatkorpo),
    ReguloTradukita = (Predikatkapo :- Predikatkorpo).

regul_kapo(Regulkapo,Vrt,Rez,_Depth_,Predikatkapo) :-
   Regulkapo =.. [Regulnomo|Argumentoj],
   append(Argumentoj,[Vrt,Rez,_Depth_],Argj),
   Predikatkapo =.. [Regulnomo|Argj].

regul_korpo(Regulkapo,RuleExp,Vrt,Rez,_,Predikatkorpo) :-
  % se ni ne havas postkondiĉon sufiĉas krei la "unuan parton"
  rule_exp(Regulkapo,RuleExp,Vrt,Rez,_,Predikatkorpo).

% la dekstra parto povas ankaŭ esti unuparta, simpla, ekz. vortarserĉo
% aŭ forreferenco al subordigita regulo
rule_exp(Regulkapo,RuleExp,Vrt,Rez,Depth,PredExp) :-
  rule_ref(RuleExp,Vrt,Rez,Depth,PredikatoSimpla),
  Regulkapo =.. [_,_Regulskemo|_],
  PredExp = PredikatoSimpla.

rule_ref(DictSearch,Vrt,Vrt,_,DictSearch) :-
  DictSearch =.. [_,Vrt|_].

```
{:.programo.kashita}

{% include pl-demando.html n=99 query=
  'vorto(Regul,Spc,satigantaj,Ana), term_atom(Ana,Rezulto).' %}

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
