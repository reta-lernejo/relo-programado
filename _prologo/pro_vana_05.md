---
layout: laborfolio
title: 4.5 Vortanalizo - sufiksreguloj
next_ch: pro_vana_06
js:
    - sekcio-0c
    - taupl.min
    - taupl-util-0c
css:
    - tau-prolog-0c
---

## Tri operatoroj por nia gramatiko

<!--
```prolog
% helpilo por sencimigi
:- op(950, fy, *). *(_).
```
{:.programo.kashita}
-->

Ni nun aldonos regulon por derivado per sufiksoj al nia malgranda vortforma gramatiko.
Ĉe tio ni bezonas la du pliajn operatorojn, jam skizitajn en leciono 3: 
Per `&` ni referencas alian regulon (tie ĉi por memreferenco, 
ĉar oni povas plurfoje apliki sufikson, sed ĝenerale ĝi povas referenci ankaŭ al alia regulo).
La regulon ni nomas 'radik(hav)a vorto sen finaĵo', do `rv_sen_fin`.

Krome, ĉe derivado per sufikso, ni volas aldoni la postkondiĉojn, ke la sufikso estu aplikebla al la koncerna
vortspeco, konkrete 'an', 'ing' k.a. aplikeblas al substantivoj, 'ind', 'end, 'at', 'it', 'ot' 
al transitivaj verboj. Kaj ni ankaŭ devas scii, kiu vortspeco rezultas el la apliko, ekzemple 'an', 'ist', 'ul'
en (homo aŭ) besto. Tian postkondiĉon formulitan en ordinara Prologo ni enkondukas per `~>`. 
La kondiĉon ni jam difinis en leciono 2 per predikato `drv_per_suf/3`.

```prolog
% simpla radiko 
rv_sen_fin(r,Spc) <= r(_,Spc,_). 

% radika vorto kun sufiksoj
rv_sen_fin('Ds',Spc) 
  <= &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).
```
{:.ignoru}

Ankaŭ al nia regulo por aldono de finaĵo ni aldonos postkondiĉon: apliko de finaĵo '-o'
konservos subspecon `best` (besto aŭ homo), ĉe aliaj vortspeco0j ĝi simple substantivigas.
Simile '-i' konservas eventualan transitivecon.

```prolog
vorto('Df',Spc) 
  <= &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs), 
       Spc=Vs    % subspeco de la radikvorto konserviĝas ...
     ; Spc=Fs).  % la finaĵo difinas la specon
```
{:.ignoru}

Ni devas certigi, ke `~>` ricevas pli malaltan rangon ol `<=`,
sed ambaŭ havu prioritaton inter la aprioraj `:-` (1200) kaj `;` (1100) - ĉar ni ja volas miksi
konvene nian vortforman sintakson kun ordinara Prologo. `&` havu tre altan prioritaton, t.e.
aplikiĝu senpere al la posta termo, sed ja iom pli malaltan ol la list-operatoro `.` (100).
Ĝi havas nur unu post-argumenton, do la skemo estas `fx`.

```prolog
:- op( 1120, xfx, '<=' ).
:- op( 1110, xfx, '~>' ).
:- op( 150, fx, '&' ).
```
{:.programo}

Nun ni devos ankoraŭ etendi niajn transformregulojn por la du novaj operatoroj.

```prolog
:- use_module(library(lists)).

term_expansion(
  <=(Kapo, Korpo),ReguloTradukita) :-
    regul_kapo(Kapo,Vorto,Analizo,KapoTradukita),
    regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita),
    ReguloTradukita = (KapoTradukita :- KorpoTradukita).

regul_kapo(Kapo,Vorto,Analizo,KapoTradukita) :-
   Kapo =.. [Regulo|Regulargumentoj],
   append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
   KapoTradukita =.. [Regulo|Argumentoj].

% regulo kun postkondiĉo
regul_korpo(Kapo,~>(Regulo,PostKond),
  Vorto,Analizo,KorpoTradukita) :-

  % kreo de la unua parto
  regul_korpo(Kapo,Regulo,Vorto,Analizo,PartoUnua),
  % alpendigo de la postkondiĉo, kiu ja estas 
  % valida Prologo-kodo per "KAJ" = ","
  % post la unua parto
  KorpoTradukita =.. [',',PartoUnua,PostKond].

% regulo por kunmeto laŭ la skemo Ref1 / Ref2
regul_korpo(Kapo,/(Ref1,Ref2),Vorto,Analizo,KorpoTradukita) :-
  Analizo =.. ['/',Ana1,Ana2], 

  % la du partoj referencas al alia (aŭ refleksive sama) regulo
  regul_referenco(Ref1,Vrt1,Ana1,Ref1Tradukita),
  regul_referenco(Ref2,Vrt2,Ana2,Ref2Tradukita),

  % kreu splitilon por la Vorto en Vrt1 kaj Reston
  Kapo =.. [_,Regulskemo|_],  
  splitilo(Regulskemo,Vorto,Vrt1,Vrt2,Splitilo),

  KorpoTradukita = (
    Splitilo,
    % Ref1 kaj Ref2 estas analizeblaj
    (Ref1Tradukita,Ref2Tradukita)
  ).  

% (mem)referenco al subordigita regulo
regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  regul_referenco(Korpo,Vorto,Analizo,KorpoTradukita).  
```
{:.programo}

## Regulreferencoj

Plue ni devas difini kiel traduki regul-referencon al
predikato kaj kiel krei konvenan splitilon.

Se la regulo komenciĝas per `&` ĝi referencas alian regulon
estigatan per `term_expansion`. Aliokaze ĝi estas vortaroserĉo, t.e.
`v/3` (baza vorto), `r/3` (radiko), `s/3` (sufikso), `f/2` (finaĵo).
Tiun ni simple anstataŭigas per si mem.


```prolog
% regulreferenco per operatoro &
regul_referenco(&Regulreferenco,Vorto,Analizo,Regulvoko) :- !,
  Regulreferenco =.. [Regulnomo|Regulargumentoj],
  append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
  Regulvoko =.. [Regulnomo|Argumentoj].

% serĉo en la vortaro
regul_referenco(Sercho,Vorto,Vorto,Sercho) :-
  Sercho =.. [Predikato,Vorto|_],
  member(Predikato,[v,r,s,f]),!.

% vort-splitilo
splitilo(Regulskemo,Vorto,Vrt1,Resto,Splitilo) :-
  Min = 1, Max = 4,

  % komencu fortranĉi de malantaŭe
  % ja sufiksoj kaj finaĵoj normale estas mallongaj...
  Splitilo = (
    between(Min,Max,L2),
    sub_atom(Vorto,L1,L2,0,Resto), 
    sub_atom(Vorto,0,L1,L2,Vrt1)
  ).
```
{:.programo}

Nia vortaro el bazaj vortoj, radikoj, sufiksoj kaj finaĵoj:

```prolog
v('vi',pron,*).
v('se',subj,*).
v('sed',konj,*).
v('sen',prep,*).
v('sep',nombr,*).
v('sur',prep,*).
v('al',prep,*).

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
  title="bazaj vortoj kaj radikoj"}

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
{:.programo.faldebla.faldita 
  title="sufiksoj"}

```prolog
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

## Vortfara gramatiko kun sufiksregulo

Kaj fine nia vortfara gramatiko:

```prolog
vorto(v,Spc) <= v(_,Spc,_).

vorto('Df',Spc) 
  <= &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs), 
       Spc=Vs    % subspeco de la radikvorto konserviĝas ...
     ; Spc=Fs).  % la finaĵo difinas la specon

% simpla radiko
rv_sen_fin(r,Spc) <= r(_,Spc,_). 

% radika vorto + sufikso, ekz. san/ul
rv_sen_fin('Ds',Spc) 
  <= &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).

% la sufikso ekzistas kaj estas aplikebla
drv_per_suf(Suf,Spc,Speco) :-
  s(Suf,Speco,De),
  subspc(Spc,De).

sub(X,X). % ĉiu speco estas subspeco de si mem.
sub(best,subst).
sub(parc,best).
sub(parc,subst).

sub(ntr,verb).
sub(tr,verb).
sub(perspron,pron).

subspc(S1,S2) :-
  sub(S1,S2), !.  

term_atom(A,A) :- atomic(A).
term_atom(F,A) :- 
  F =.. [Op,T1,T2],
  term_atom(T1,A1),
  term_atom(T2,A2),
  atomic_list_concat([A1,Op,A2],A).  
```
{:.programo}

Ĉu vortoj derivitaj per sufiksoj estas analizeblaj per nia
gramatiko? Ni provu!

{% include pl-demando.html query=
  'vorto(Regul,Spc,satigantaj,Ana), 
   term_atom(Ana,Rezulto).' %}

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
