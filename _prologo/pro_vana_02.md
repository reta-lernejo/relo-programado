---
layout: laborfolio
title: 4.2 Vortanalizo - sufiksoj
next_ch: pro_vana_03
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---

<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

## Difino de sufiksoj

Post disanalizo de vortoj laŭ radikoj kaj finaĵoj, ni rigardu derivadon per sufiksoj.

<!--
```prolog
% helpiloj por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}
-->

Nian vortareton el la antaŭa leciono ni transprenas. (Malfaldu se vi volas revidi ĝin)

```prolog
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
{:.programo.faldebla.faldita 
  title="finaĵoj"}


```prolog
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
{:.programo.faldebla.faldita 
  title="radikoj"}

Sufiksoj ne estas arbitre aplikeblaj: ili ofte limigas, al kiu vortspeco ili estas aplikeblaj
kaj ilia rezulto ankaŭ implicite ricevas vortspecon, ordinare alian. Tiel -an aplikiĝas al 
substantivoj (inkluzivante homojn) kaj ilia rezulto estas homo aŭ besto, ekzemple: grup/an.
Sufiksoj -on, -obl estas aplikeblaj nur la nombrovortoj kaj rezultas en substantivo.

Estas konsilinde do kontroli ĉe vortanalizo, al kiu vortspeco ni provas apliki sufikson kaj
atribui la rezultan vortspecon por la plua analizo. Tio ofte malhelpas
misanalizon en vortoj kiel afrikato, aksono, altaro, anatemo, anemono, antilopo, ciklopo, envelopo, 
elektrono, fonemo, haremo, kvadrigo, putino, sinkopo k.m.p.

En iuj vortoj tio tamen ne malhelpus misanalizon: bulgara, lineara, ekstrema, elfaro. Tial estas
konsilinde konvene ordigi la regulojn de la gramatiko kaj vortaro: ordigu la longajn radikojn 
antaŭ la mallongaj (plej simple per inversa alfabeta ordo), faru la analizon de prefiksoj
antaŭ la analizo de sufiksoj (el/far/o do ne analiziĝus kiel elf/ar/o).

Ĉe la sufiksoj ni do notu du gramatikajn specojn: en la dua argumento la rezultan vortspecon,
same kiel ĉe la finaĵoj kaj radikoj, sed aldone, en la tria argumento, la vortspecon, al kiu
ĝi estas aplikebla. Ekzemple '-it' estas aplikebla al transitivaj verboj kaj rezultas en ulo
(homo aŭ besto), ekzemple el transitiva send/ fariĝas send/it/, kuriero aŭ kolombo ktp.:
`s(it,best,tr).` Se estas pluraj eblecoj ni donas tion en plura faktoj, ekzemple -ig, iĝ, -ul.


<div class="mermaid">
  graph TD;
    sat("`**r:sat**`") --o spc([adj])
    ig("`**s:ig**`") --o spc
    ig --o al1([tr])
    ant("`**s:ant**`") --o spc2([verb])
    spc2 -- subspc --> al1
    ant --o al2([best])
</div>


Iuj sufiksoj universale aplikiĝas konservante la specon: por tion esprimi, ni uzas samnoman variablon:
`s(eg,Spc,Spc).`, ekzmeple grand/eg, manĝ/eg, tur/eg. Se la speco estas entute ne difinita, ni uzas 
la ĵokeran variablon `_`, ekzemple -um estas universale aplikebla kaj la rezulta speco varias:
kol/um/ estas substantiva, sed ĝarden/um/ verba. La sufiksoj -ist, -ism estas universale applikeblaj
al verboj, substantivoj ktp. sed rezultas en difinita vortspeco: `s(ism,subst,_). s(ist,best,_).`


```prolog
%! s(?Sufikso,?AlSpeco,?DeSpeco).
s(ant,best,verb).
s(int,best,verb).
s(ont,best,verb).
s(at,best,tr).
s(it,best,tr).
s(ot,best,tr).
s('aĉ',Spc,Spc).
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
s(eg,Spc,Spc).
s(ej,subst,verb). % lernejo
s(ej,subst,subst). % vinejo
s(ej,subst,adj). % densejo, malsekejo
s(em,adj,verb). % kurema, purigema
s(em,adj,adj). % dolĉema, purema
s(end,adj,tr).
s(er,subst,subst).
s(estr,best,subst).
s(et,Spc,Spc).
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
```
{:.programo}

## Derivado per sufiksoj

Se ni volas certigi, ke sufikso aplikiĝu al la ĝusta vortspeco, ni devos konsideri, ke ekzemple, 
sufikso aplikebla al verboj, pli konkrete estas ankaŭ aplikebla al transitivaj kaj netransitivaj verboj.
Sufikso aplikebla al substantivoj ankaŭ estas aplikebla al bestoj kaj parencoj. Ni realigos tion per 
predikato `sub/2`. Ĉar estass tre malmultaj kazoj, ni rezignos pri transitiva difino.

```prolog
sub(X,X). % ĉiu speco estas subspeco de si mem.
sub(best,subst).
sub(parc,best).
sub(parc,subst).

sub(ntr,verb).
sub(tr,verb).
sub(perspron,pron).

% ni ne bezonas konsideri diversajn kazojn,
% do akceptas la unuan trafon definitive (`!`).
subspc(S1,S2) :-
  sub(S1,S2), !.
```
{:.programo}

Do ĉe derivado per sufikso ni faras du testojn: la sufikso ekzistas kaj la vortspeco
de la radiko aŭ derivaĵo, al kiu ĝi aplikiĝas estus subspeco de la vortspeco, al kiu la
sufikso estas aplikebla.

```prolog
% la regulo ricevas nur la vortspecon Spc de la maldektra vorto kaj la 
% sufikson mem, kaj rigardas, ĉu ekzistas taŭga varianto kun la ĝusta
% vortspeco aplikenda.
drv_per_suf(Suf,Spc,Speco) :-
  s(Suf,Speco,De),
  subspc(Spc,De).
```
{:.programo}

Ni faru teston por pli klara kompreno, kion ni ĵus difinis. El listo de kombinoj
Sufikso-Vortspeco, ni elfiltros tiujn, kiuj estas permesataj. Ni ankaŭ ricevos la rezultantan
vortspecon post apliko de la sufikso (AlSpc).

{% include pl-demando.html n=99 query=
  'member(Suf-RadSpc,[
    it-tr,it-ntr,
    ec-verb,ec-adj,ec-subst,
    in-best,in-subst,in-adj]),
  drv_per_suf(Suf, RadSpc, AlSpc).' %}

## Vortforma gramatiko kun sufiksoj

Nun estas tempo, etendi nian vortforman gramatiketon je sufiksoj. Tiujn oni povas
apliki ne nur al radiko, sed ankaŭ al derivaĵoj el radiko kaj unu aŭ pluraj sufiksoj,
ekzemple sat/ig/ant. Ambaŭ kazojn ni difinos per du reguloj de predikato
`rv_sen_fin/4`, t.e. radika vorto sen finaĵo. 


```prolog
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

{% include pl-demando.html query=
  'rv_sen_fin(Regul, Spc, satig, Ana).' %}

Do, la analizo principe funkcias, sed estas iom malbele legebla. Ni difinu predikaton, kiu
metos la operatoron `/` inter la argumentojn anstataŭ `/(a,b)`. La prologa operatoro
`=..` helpas en tio transformante termon kiel `/(a,b)` al listo `[/,a,b]`, poste ni
povas kunskribi ĉion en la dezirata ordo al atomo (signaro). La oficialecon ni alpendigas
al la radiko per `^` - kvazaŭ eksponenton.

```prolog
  term_atom(A,A) :- atomic(A).
  term_atom(F,A) :- 
    F =.. [Op,T1,T2],
    term_atom(T1,A1),
    term_atom(T2,A2),
    atomic_list_concat([A1,Op,A2],A).
```    
{:.programo}

{% include pl-demando.html query=
  'rv_sen_fin(Regul, Spc, satigant, Ana), 
   term_atom(Ana,Rezulto).' %}

Fine ni realdonu la regulon por apliko de finaĵoj. Nun ni ne aplikos ilin plu
al nudaj radikoj, sed al rezultoj de `rv_sen_fin`.  

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

{% include pl-demando.html query=
  'vorto(Regul,Spc,satigantaj,Ana), 
   term_atom(Ana,Rezulto).' %}

En la sekva leciono ni vidos, kiel pli koncize formuli la regulojn de vortfarado.   

<script>
  window.onload = () => {
    Faldajho.aranĝo("pl_kodo");
  }

  const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)
  preparu_programojn();
  preparu_demandojn(() => {
      let programo = '';
      document.querySelectorAll('.programo code').forEach((c) => {
          programo += c.textContent;
      });
      return programo;
  }, limo);
</script>
