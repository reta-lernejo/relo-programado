---
layout: laborfolio
title: 4.4 Vortanalizo - termtransformo, daŭrigo 
next_ch: pro_vana_05
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---

## Termtransformo, daŭrigo

Per rimedo de termtransformo, ni realigu nun unue simplan gramatiketon el du reguloj:
vorto povas aŭ troviĝi inter la bazaj vortoj (prepozicioj, tabelvortoj, personaj pronomoj,
bazaj adverboj k.a.) aŭ kunmetiĝi el radiko kaj finaĵo.

Ĉe la reguloj, kiel unua argumento ni notas tion kiel skemo `v` respektive `rf`.
La unua argumento nun ne estas nepre necesa, sed ni uzos ĝin por ekscii dum la analizo,
kiu regulo aplikiĝis - utila aparte serĉante eraron en plurgeula gramatiko -,
kaj la skemo poste ankaŭ utilos por optimuma splitilo.

```prolog
vorto(v,Spc) <= 
  v(_,Spc,_).

vorto('rf',Spc) <= 
  r(Rad,Rs,Ofc) / f(Fin,Fs).
```  
{:.ignoru}

<!--
```prolog
% helpilo por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}
-->

En la regulkapo de regulo kiel `vorto(r,Speco) <= r(_,Speco,_)` ni aldonos du argmuentojn: la analizendan vorton
kaj la analizrezulton. Tiucele ni apartigas la nomon de la regulo `vorto` de la listo de argumentoj per la
prologa operatoro `=..`, poste ni alpendigas al la argumentlisto la du pliajn argumentojn kaj rekunmetas (denove uzante `=..`
en la kontraŭa direkto) al `vorto(r,Speco,Vorto,Analizo)`.

```prolog
:- use_module(library(lists)).

:- op( 1120, xfx, '<=' ).

term_expansion(
  <=(Kapo, Korpo),ReguloTradukita) :-
    regul_kapo(Kapo,Vorto,Analizo,KapoTradukita),
    regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita),
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
% baza vorto sen finaĵo
regul_korpo(Kapo,Korpo,Vorto,Vorto,Korpo) :-
  Korpo = v(Vorto,_,_).

% kunmetaĵo el radiko kaj finaĵo
regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  % la regulesprimo estas kunmeto laŭ la skemo Ref1 / Ref2
  Korpo =.. ['/',Ref1,Ref2],
  Analizo =.. ['/',Radiko,Fino], 

  % referencoj al subkuŝajn reguloj, ĉi-akze
  % simpla serĉo en r/3 kaj f/2
  Ref1 = r(Radiko,Rs,Os),
  Ref2 = f(Fino,Fs),

  KorpoTradukita = (
    % splito de la vorto
    between(1,3,Lf),
    sub_atom(Vorto,Lr,Lf,0,Fino), 
    sub_atom(Vorto,0,Lr,Lf,Radiko),    
    % kondiĉo: kaj la radiko kaj la finaĵo 
    % troviĝas en la vortaro
    (Ref1,Ref2)
  ).  
```
{:.programo}

Ni aldonos koncizegan vortareton por testi la novan gramatiketon. (Malfaldu por vidi ĝin.)

```prolog
v('vi',pron,*).
v('se',subj,*).
v('sed',konj,*).
v('sen',prep,*).
v('sep',nombr,*).
v('sur',prep,*).
v('al',prep,*).

r(san,adj,'*').
r(bon,adj,'*').

f(ojn,subst).
f(oj,subst).
f(on,subst).
f(o,subst).
f('''',subst).
f(ajn,adj).
f(aj,adj).
f(an,adj).
f(a,adj).
f(as,verb).
f(is,verb).
f(os,verb).
f(us,verb).
f(i,verb).
f(u,verb).
f(en,adv).
f(e,adv).
```
{:.programo.faldebla.faldita
  title="vortareto"}

Kaj fine ni metas la regulojn de nia gramatiko, kiel supre jam postulita.
Krome ni enŝovos `term_atom/2` por pli bela prezento de la analizrezulto.

```prolog
vorto(v,Spc) <= 
  v(_,Spc,_).

vorto('rf',Spc) <= 
  r(Rad,_,Ofc) / f(Fin,Spc).

term_atom(A,A) :- atomic(A).
term_atom(F,A) :- 
  F =.. [Op,T1,T2],
  term_atom(T1,A1),
  term_atom(T2,A2),
  atomic_list_concat([A1,Op,A2],A).  
```
{:.programo}

Do, tempo por elprovi nian gramatiketon formulitan per nia propra gramatiklingvo.

{% include pl-demando.html n="9" query=
  'member(Vorto,[bonan,sanon,al,vi]),
   vorto(Regulo,Spc,Vorto,Ana), 
   term_atom(Ana,Rezulto).' %}  

En la venonta leciono ni etendos nian gramatikon je derivado per sufiksoj.

<script>
  window.onload = () => {
    Faldajho.aranĝo("pl_kodo");
  }

  const limo = 10000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
  preparu_programojn();
  preparu_demandojn(() => {
      let programo = '';
      document.querySelectorAll('.programo code').forEach((c) => {
          programo += c.textContent;
      });
      return programo;
  }, limo);
</script>
