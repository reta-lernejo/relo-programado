---
layout: laborfolio
title: Vortanalizo 5 - sufiksregulo
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

Ni nun aldonos regulon por derivado per sufiksoj al nia malgranda vortforma gramatiko.
Ĉe tio ni bezonas du pliajn operatorojn: Per `&` ni referencas alian regulon, tie ĉi por memreferenco, 
ĉar oni povas plurfoje apliki sufikson. La regulon ni nomas 'radik(hav)a vorto sen finaĵo', do `rv_sen_fin`.
Krome ni volas aldoni postkondiĉojn, ekzemple ni devas certigi, ke la sufikso estas aplikebla al la koncerna
vortspeco, ekzemple 'an', 'ing' k.a. aplikiĝas al substantivoj, 'ind', 'end, 'at', 'it', 'ot' 
aplikiĝas al transitivaj verboj. Kaj ni devas scii, kiu vortspeco rezultas el la apliko, ekzmeple 'an', 'ist', 'ul'
en (homo aŭ) besto. Tian postkondiĉon en ordinara Prologo ni enkondukas per `~>`. La kondiĉon kaj rezulton de 
sufiksa apliko ni poste formulos en predikato `drv_per_suf/3`.

```prolog

% simpla radiko 
rv_sen_fin(r,Spc) <= 
  r(_,Spc,_). 

% radika vorto kun sufiksoj
rv_sen_fin('Ds',Spc) <= 
  &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).

```
{:.ignoru}

Ankaŭ al nia regulo por aldono de finaĵo ni aldonos postkondiĉon: ekzemple apliki finaĵon '-o'
konservos ekzemple subspecon `best` (besto aŭ homo), ĉe aliaj vortspeco0j ĝi simple substantivigas.
Simile '-i' konservas eventualan transitivecon.

```prolog
vorto('Df',Spc) <= 
  &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs),  % subspeco konserviĝas ...
       Spc=Vs 
     ; Spc=Fs).

```
{:.ignoru}

Do entute ni bezonos tri apartajn signojn (operatorojn) por nia gramatiko:

| `<=` | (= konstituiĝas el) apartigas regulkapon de regulkorpo |
| `&`  | referencas alian regulon |
| `~>` | enkondukas post la ĉefa parto de la regulo aldonajn kondiĉojn en normala sintakso de Prologo |

Ni devas certigi, ke `<=` ricevas pli malaltan prioritaton ol `~>`,
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
write_canonical(kapo(KapoTradukita)),
    regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita),
write_canonical(korpo(KorpoTradukita)),  
    ReguloTradukita = (KapoTradukita :- KorpoTradukita).

regul_kapo(Kapo,Vorto,Analizo,KapoTradukita) :-
   Kapo =.. [Regulo|Regulargumentoj],
   append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
   KapoTradukita =.. [Regulo|Argumentoj].


% regulo kun postkondiĉo
regul_korpo(Kapo,~>(Regulo,PostKond),Vorto,Analizo,KorpoTradukita) :-
  % kreo de la unua parto
  write_canonical(~>(Regulo,PostKond)),
  regul_korpo(Kapo,Regulo,Vorto,Analizo,PartoUnua),
  % alpendigo de la postkondiĉo, kiu ja estas valida Prologo-kodo per "KAJ" = ","
  % post la unua parto
  KorpoTradukita =.. [',',PartoUnua,PostKond].

regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  % la regulesprimo estas kunmeto laŭ la skemo R1 / R2
  Korpo =.. ['/',Ref1,Ref2],
  Analizo =.. ['/',Ana1,Ana2], 

  write_canonical(Ref1/Ref2),

  regul_referenco(Ref1,Vrt1,Ana1,Ref1Tradukita),
  write_canonical(ref1(Ref1Tradukita)),
  regul_referenco(Ref2,Vrt2,Ana2,Ref2Tradukita),
  write_canonical(ref2(Ref2Tradukita)),

  % kreu splitilon por la Vorto en Vrt1 kaj Reston
  Kapo =.. [_,Regulskemo|_],  
  splitilo(Regulskemo,Ref1,Ref2,Vorto,Vrt1,Resto,Splitilo),

  KorpoTradukita = (
    Splitilo,
    % Ref1 kaj Ref2 estas anlizeblaj
    (Ref1,Ref2)
  ).  


% dekstra regulparto unuparta, simpla, ekz. vortarserĉo
% memreferenco aŭ referenco al subordigita regulo
regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  regul_referenco(Korpo,Vorto,Analizo,KorpoTradukita).  
```
{:.programo}


Nun ni ankoraŭ devas difini kiel traduki regul-referencon al
predikato kaj kiel krei konvenan splitilon.

Se la regulo komenciĝas per `&` ĝi referencas alian regulon
estigatan per `term_expansion`. Aliokaze ĝi estas vortaroserĉo, t.e.
`v/3` (baza vorto), `r/3` (radiko), `s/3` (sufikso), `f/2` (finaĵo).
Tiun ni simple anstataŭigas per si mem.


```prolog
regul_referenco(&Regulreferenco,Vorto,Analizo,Regulvoko) :- !,
  write_canonical(&(Regulreferenco)),
  Regulreferenco =.. [Regulnomo|Regulargumentoj],
  write_canonical(nomo(Regulnomo)),
  append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
  write_canonical(arg(Argumentoj)),
  Regulvoko =.. [Regulnomo|Argumentoj].

regul_referenco(Sercho,Vorto,Vorto,Sercho) :-
  Sercho =.. [Predikato,Vorto|_],
  member(Predikato,[v,r,s,f]),!.

splitilo(Regulskemo,Ref1,Ref2,Vorto,Vrt1,Resto,Splitilo) :-
  Min = 1, Max = 4,
  % get_rule_min_max(Ref2,Min,Max),

  % komencu fortranĉi de malantaŭe
  % ja sufiksoj kaj finaĵoj normale estas mallongaj...
  Splitilo = (
    between(Min,Max,L2),
    sub_atom(Vorto,L1,L2,0,Resto), 
    sub_atom(Vorto,0,L1,L2,Vrt1)
  ).


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


vorto(v,Spc) <= 
  v(_,Spc,_).

vorto('Df',Spc) <= 
  &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs),  % subspeco konserviĝas ...
       Spc=Vs 
     ; Spc=Fs).  

% simpla radiko
rv_sen_fin(r,Spc) <= r(_,Spc,_). 

% radika vorto + sufikso, ekz. san/ul
rv_sen_fin('Ds',Spc) <= &rv_sen_fin(_,Vs) / s(Suf,_,_) ~> drv_per_suf(Suf,Vs,Spc).

drv_per_suf(Suf,Spc,Speco) :-
  s(Suf,Speco,De),
  subspc(Spc,De).

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

term_atom(A,A) :- atomic(A).
term_atom(F,A) :- 
  F =.. [Op,T1,T2],
  term_atom(T1,A1),
  term_atom(T2,A2),
  atomic_list_concat([A1,Op,A2],A).  

```
{:.programo}

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
