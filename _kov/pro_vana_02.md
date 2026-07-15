---
layout: laborfolio
title: Vortanalizo 1 - sufiksoj
next_ch: pro_vana_2
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog
---

## Sufiksoj

Por krei esperantan vortanalizilon ni komencu per listo de finaĵoj kun iliaj vortspecoj.

```prolog
% helpiloj por sencimigi
:- op(950, fy, *). *(_).


% finaĵoj
% f(Finaĵo,Vortspeco).
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
{:.programo.kashita}

Ni aldonu radikareton. Kun
la radikoj ni notu ankaŭ la vortspecon kaj la oficialecon.
Ni traktos homojn kaj bestojn samspece, ĉar laŭ gramatika vidpunkto
(aplikeblo de sufiksoj kiel 'ant', 'it', 'in' ktp. ili apenaŭ 
diferencas).

```prolog
% radikoj
% r(Radiko,Vortspeco,Oficialeco)
r('vi',pron,*).
r('tiu',pron,*).
r('supr',adv,*).
r('subit',adv,*).
r('si',pron,*).
r('sat',adj,*).
r('sankt',adj,*).
r('san',adj,*).
r('sam',adj,*).
r('sagac',adj,*).
r('saĝ',adj,*).
r('precip',adv,*).
r('oft',adv,*).
r('mi',pron,*).
r('kverel',ntr,'4').
r('kver',ntr,+).
r('kuŝ',ntr,*).
r('kuraĝ',tr,*).
r('kurac',tr,*).
r('kur',ntr,*).
r('kupl',tr,+).
r('kultur',tr,'1').
r('kult',tr,'1').
r('kulp',tr,*).
r('kuir',tr,*).
r('kudr',tr,*).
r('krev',ntr,*).
r('kresk',ntr,*).
r('kamel',best,*). 
r('fru',adv,*).
r('fianĉ',best,*).
r('edz',best,*).
r('doktor',best,*).
r('bov',best,*).
```
{:.programo.kashita}

```prolog
%! s(?Sufikso,?AlSpeco,?DeSpeco).
%
% Sufiksoj
% @arg Sufikso sufikso, ekz. ul
% @arg AlSpeco rezulto de derivado, ekz. best
% @arg DeSpeco radikspeco, al kiu ĝi estas aplikebla, ekz. adj

s(ant,best,verb).
s(int,best,verb).
s(ont,best,verb).
s(at,best,tr).
s(it,best,tr).
s(ot,best,tr).
s('aĉ',_,_).
s(ad,subst,verb). % substantivigo
s(ad,_,verb). % ripetadi
s('aĵ',subst,adj).
s('aĵ',subst,verb).
s('aĵ',subst,subst).
s(an,best,subst).
s(ar,subst,subst).
s(ebl,adj,tr).
s(ec,subst,adj).   % grandeco...
s(ec,subst,subst). % membreco, kaoseco k.a.
s(eg,_,_).
s(ej,subst,verb). % lernejo
s(ej,subst,subst). % vinejo
s(ej,subst,adj). % densejo, malsekejo
s(em,adj,verb). % kurema, purigema
s(em,adj,adj). % dolĉema, purema
s(end,adj,tr).
s(er,subst,subst).
s(estr,best,subst).
s(et,_,_).
s(id,best,best).
s(ig,tr,subst).
s(ig,tr,adj).
s(ig,tr,ntr).
s(ig,tr,nombr).
s('iĝ',ntr,subst).
s('iĝ',ntr,adj).
s('iĝ',ntr,tr).
s('iĝ',ntr,nombr).
s(il,subst,verb).
s(in,_,best).
s(ind,adj,tr).
s(ing,subst,subst).
s(ism,subst,_).
s(ist,best,_).
s(obl,subst,nombr).
s(on,subst,nombr).
s(op,subst,nombr).
s(uj,subst,subst).
s(ul,best,adj).
s(ul,best,subst). % X-hava ulo: mamulo, vertebrulo
s(ul,best,verb). % X-anta ulo: drinkulo, rampulo
s(um,_,_).
s(um,tr,_). % plenumi, brakumi, krucumi, lavumi ktp.

sub(X,X).
% sub(X,Z) :- sub(X,Y), sub(Y,Z).
sub(best,subst).
sub(pers,best).
sub(pers,subst).

sub(parc,pers).
sub(parc,best).
sub(parc,subst).

sub(ntr,verb).
sub(tr,verb).
sub(perspron,pron).

subspc(S1,S2) :-
  sub(S1,S2), !.

% la regulo ricevas nur la vortspecon Spc de la maldektra vorto kaj la 
% sufikson mem, kaj rigardas, ĉu ekzistas taŭga varianto kun la ĝusta
% vortspeco aplikenda.
drv_per_suf(Suf,Spc,Speco) :-
  s(Suf,Speco,De),
  subspc(Spc,De).


% %# rv_sen_fin(r,_) ...
rv_sen_fin(r, Spc, Vorto, Vorto^Ofc) :- r(Vorto, Spc, Ofc).

% %# rv_sen_fin('rs',_) ...
%   ...bone!
rv_sen_fin(rs, Spc, Vorto, Ana/Suf) :-
    % splito
    between(2, 4, Ls), % sufiksoj havas 2..4 literojn
    sub_atom(Vorto, Lr, Ls, 0, Suf),
    sub_atom(Vorto, 0, Lr, Ls, Vrt),
    % kondiĉoj
    s(Suf, _, _),
    % la vortparto antaŭ la sufikso
    % estas same analizebla
    rv_sen_fin(_, Vsp, Vrt, Ana),
    % eblas apliki la sufikson al Vsp
    % ricevanta novan vortspecon Spc
    drv_per_suf(Suf, Vsp, Spc).

```
{:.programo}


{% include pl-demando.html n=99 query=
  'rv_sen_fin(Regul, Spc, satig, Ana).' %}

```prolog
  term_atom(A,A) :- atomic(A).
  term_atom(F,A) :- 
    F =.. [Op,T1,T2],
    term_atom(T1,A1),
    term_atom(T2,A2),
    atomic_list_concat([A1,Op,A2],A).
```    
{:.programo}


{% include pl-demando.html n=99 query=
  'rv_sen_fin(Regul, Spc, satigant, Ana), term_atom(Ana,Rezulto).' %}

```prolog
:- use_module(library(lists)).

vorto(Regul,Spec,Vorto,VsfAna/Fino) :-
    % splito
    between(1,3,Lf),
    sub_atom(Vorto,Lr,Lf,0,Fino), 
    between(2,99,Lr),
    sub_atom(Vorto,0,Lr,Lf,VortSenFin),
    % kondiĉoj
    f(Fino,Spec),
    rv_sen_fin(_,_,VortSenFin,VsfAna).
```
{:.programo}

Provu ni, ĉu jam funkcias:

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
