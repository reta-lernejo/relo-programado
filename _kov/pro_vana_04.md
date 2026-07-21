---
layout: laborfolio
title: Vortanalizo 1 - termtransformo 2
next_ch: pro_vana_2
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog
---

## Termtransformo 2

Ni realigu nun unue simplan gramatiketon el du reguloj:
Vorto povas aŭ troviĝi en la vortaro de bazaj vortoj (prepozicioj, tabelvortoj, personaj pronomoj, 
bazaj adverboj k.a.) aŭ kunmetiĝi el radiko kaj finaĵo. (La unua argumento ne estas nepre necesa, sed
ni uzos ĝin por ekscii dum la analizo, kiu regulo aplikiĝis. Ĝe multaj reguloj tio povas esti
tre utila por trovi erarojn kaj plibonigi la gramatikon.)

```prolog
vorto(v,Spc) <= 
  v(_,Spc,_).

vorto('rf',Spc) <= 
  r(Rad,Rs,Ofc) / f(Fin,Fs).
```  
{:.ignoru}

```prolog
% helpilo por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}

En la regulkapo de regulo kiel `vorto(r,Speco) <= r(_,Speco,_)` ni aldonos du argmuentojn: la analizendan vorton
kaj ties analizon. Tiucele ni apartigas la nomon de la regulo `vorto` de la listo de argumentoj per la
prologa operatoro `=..`, poste ni alpendigas al la argumentlisto la du pliajn argumentojn kaj rekunmetas (denove uzante `=..`
en la kontraŭa direkto) al `vorto(r,Speco,Vorto,Analizo)`.

```prolog
:- use_module(library(lists)).

:- op( 1120, xfx, '<=' ).

term_expansion(
  <=(Kapo, Korpo),ReguloTradukita) :-
    regul_kapo(Kapo,Vorto,Analizo,KapoTradukita),
    write(KapoTradukita),
    regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita),
    write(KorpoTradukita),
    ReguloTradukita = (KapoTradukita :- KorpoTradukita).

regul_kapo(Kapo,Vorto,Analizo,KapoTradukita) :-
   Kapo =.. [Regulo|Regulargumentoj],
   append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
   KapoTradukita =.. [Regulo|Argumentoj].
```
{:.programo}

Por la korpo ni konsideras la serĉon en la elementa vortlisto `v/3`
kaj la kunmeton de radiko `r/3` kaj finaĵo `f/2`.


```prolog

regul_korpo(Kapo,Korpo,Vorto,Vorto,Korpo) :-
  Korpo = v(Vorto,_,_).

regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  % la regulesprimo estas kunmeto laŭ la skemo R1 / R2
  Korpo =.. ['/',Ref1,Ref2],
  Analizo =.. ['/',Radiko,Fino], 

  Ref1 = r(Radiko,Rs,Os),
  Ref2 = f(Fino,Fs),

  KorpoTradukita = (
    atom_concat(Radiko,Fino,Vorto),
    % kaj la radiko kaj la fino troviĝas en la vortaro
    (Ref1,Ref2)
  ).  


v('se',subj,*).
v('sed',konj,*).
v('sen',prep,*).
v('sep',nombr,*).
v('ses',nombr,*).
v('sub',prep,*).
v('super',prep,*).
v('sur',prep,*).

r(san,adj,'*').
f(o,subst).


vorto(v,Spc) <= 
  v(_,Spc,_).

vorto('rf',Spc) <= 
  r(Rad,Rs,Ofc) / f(Fin,Fs).

```
{:.programo}

{% include pl-demando.html n=99 query=
  'listing(vorto/4).' %}

{% include pl-demando.html n=99 query=
  'vorto(Regulo,Spc,sano,Ana).' %}  


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
