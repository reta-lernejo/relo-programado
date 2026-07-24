---
layout: laborfolio
title: Vortanalizo 6 - prefikssreguloj
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

Prefiksoj aplikiĝas en la antaŭa flanko de la radiko. Plej ofte ili
aplikiĝas laŭlogike antaŭ la sufiksoj. Ni do volos aldoni regulojn tiajn:

```prolog
% simplaj mal-vortoj (malfor, malantaŭ, maltro...)
vorto(pv,Spc) 
  <= p(mal,_) / v(_,Spc,_) 
  ~> (Spc='adv'; Spc='prep').

% derivado per propra prefikso
rv_sen_suf(pr,Spc) 
  <= p(_,De) / r(_,Spc,_) 
  ~> subspc(Spc,De).
rv_sen_suf(pD,Spc) 
  <= p(_,De) / &rv_sen_suf(_,Spc) 
  ~> subspc(Spc,De).

% derivado per prepozicioj uzataj prefikse ĉe verboj
rv_sen_suf(pr,Al) 
  <= p(_,Al,De) / r(_,Spc,_) 
  ~> subspc(Spc,De), subspc(De,verb).
rv_sen_suf(pD,Al) 
  <= p(_,Al,De) / &rv_sen_suf(_,Spc) 
  ~> subspc(Spc,De), subspc(De,verb).
```
{:.ignoru}

Ni do ankaŭ devos aldoni plian regulon por pluderivado de `rv_sen_suf`:

```prolog
rv_sen_fin('D',Spc) <= &rv_sen_suf(_,Spc).
```
{:.ignoru}

Ni kunmetu ĉion ĝisnunan kaj la aldonajn regulojn.

```prolog
:- use_module(library(lists)).

:- op( 1120, xfx, '<=' ).
:- op( 1110, xfx, '~>' ).
:- op( 150, fx, '&' ).

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


regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  % la regulesprimo estas kunmeto laŭ la skemo R1 / R2
  Korpo =.. ['/',Ref1,Ref2],
  Analizo =.. ['/',Ana1,Ana2], 

  regul_referenco(Ref1,Vrt1,Ana1,Ref1Tradukita),
  regul_referenco(Ref2,Vrt2,Ana2,Ref2Tradukita),

  % kreu splitilon por la Vorto en Vrt1 kaj Reston
  Kapo =.. [_,Regulskemo|_],  
  splitilo(Regulskemo,Ref1,Ref2,Vorto,Vrt1,Vrt2,Splitilo),

  KorpoTradukita = (
    Splitilo,
    % Ref1 kaj Ref2 estas analizeblaj
    (Ref1Tradukita,Ref2Tradukita)
  ).  


% dekstra regulparto unuparta, simpla, ekz. vortarserĉo
% memreferenco aŭ referenco al subordigita regulo
regul_korpo(Kapo,Korpo,Vorto,Analizo,KorpoTradukita) :-
  regul_referenco(Korpo,Vorto,Analizo,KorpoTradukita).  

regul_referenco(&Regulreferenco,Vorto,Analizo,Regulvoko) :- !,
  Regulreferenco =.. [Regulnomo|Regulargumentoj],
  append(Regulargumentoj,[Vorto,Analizo],Argumentoj),
  Regulvoko =.. [Regulnomo|Argumentoj].

regul_referenco(Sercho,Vorto,Vorto,Sercho) :-
  Sercho =.. [Predikato,Vorto|_],
  member(Predikato,[v,r,s,f]),!.

```
{:.programo}

Ĉar prefiksoj aplikiĝas anataŭe kaj estas kutime mallongaj kompare kun la radiko,
ni havu duan spegulan splitilon.

```prolog

splitilo(Regulskemo,Vorto,Vrt1,Resto,Splitilo) :-
  member(Regulskemo,['pv','pr','pD']),!,
  % prefikso pli mallonga ol la resto...
  Min = 2, Max = 7,
  Splitilo = (
    % maldekstra parto de la vorto (aŭ vortparto)
    % havanta longecon L1, kiu estu inter Min kaj Max
    between(Min,Max,L1),
    sub_atom(Vorto,0,L1,L2,Vrt1),
    % dekstra parto de la vorto (aŭ vortparto)
    sub_atom(Vorto,L1,L2,0,Resto)
  ).

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

Nia vortaro:

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


%! p(?Prefikso,?DeSpeco).
%
% Prefiksoj
% @arg Prefikso prefikso, ekz. bo
% @arg DeSpeco radikspeco, al kiu ĝi estas aplikebla, ekz. parc
%     (ordinaraj prefiskoj ne shanghas la vortspecon)
% puraj prefiksoj,
% prepozicioj kiel prefiksoj,
% adverboj kiel prefiksoj

p(bo,parc).
p('ĉef',subst).
p(dis,verb).
p(ek,verb).
p(eks,subst).
p(fi,subst).
p(ge,best).
p(mal,_).
p(mis,verb).
p(pra,subst).
p('pseŭdo',_).
p(re,verb).

% prepozicioj kiel prefiksoj
% pri transitivigaj, prefikse uzataj prepozicioj vd. malsupre

p(de,verb).
p(ekster,adj). % eksterordinara
p(ekster,subst). % eksterlando
p(kun,verb).
p(sub,subst).
p(super,subst).

% adverboj kiel prefiksoj

p('ĉi',adj).
p('ĉiam',adj). % ekz. ĉiamverda
p(pli,adj).
p(ne,adj).
p(ne,subst).
p(tiel,adj). %???

p(nun,subst).
p(mem,verb).
p('kvazaŭ',_). % simile al pseŭdo
p(tro,adj). % troabundeco


%! p(?Prefikso,?AlSpeco,?DeSpeco)
%
% Prefikse uzataj prepozicioj kaj adverboj. 
% * prepozicioj uzataj prefikse kun verboj,
% * adverboj uzataj prefikse kun verboj
%

p(al,tr,verb). % ekz. aliri, alveni
p('antaŭ',tr,verb). % antaŭvidi
p(pri,tr,verb). % ekz. priskribi
p(apud,tr,verb). % apudmeti
p('ĉe',tr,verb). % ĉeesti
p('ĉirkaŭ',tr,verb). % ĉirkaŭflugi
p(el,tr,verb). % eliri
p(en,tr,verb). % enhavi
p('ĝis',tr,verb). % ĝisvivi
p(inter,tr,verb). % interrompi
p('kontraŭ',tr,verb). % kontraŭstari
p(krom,tr,verb). % krompagi
p('laŭ',tr,verb). % laŭiri
p(per,tr,verb). % perforti, perlabori
p(por,tr,verb). % porpeti
p(post,tr,verb). % postpagi
p(preter,tr,verb). % preteriri
p(pri,tr,verb). % priparoli
p(pro,tr,verb). % propeti
p(sub,tr,verb). % subteni
p(super,tr,verb). % superflugi
p(sur,tr,verb). % surmeti
p(tra,tr,verb). % trakuri
p(trans,tr,verb). % transpagi 

% adverboj uzataj prefikse kun verboj

p(mem,adj,verb).
p(plu,tr,verb).
p(for,tr,verb).

/**************
 * la sekvaj fakte ne estas prefiksoj,
 * sed uzataj en kunderivado (ekz. sen-dom-a, sed ne
 * sen-dom-o; internacia, internacieco, sed ne internacio
 * ...)  do eble forigu tie ĉi....
 * prepozicioj kaj pronomoj... 
**************/
p('ambaŭ',adj,subst). % per ambaŭ manoj -> ambaŭmane
p('ambaŭ',adj,verb). % tranĉi ambaŭ -> ambaŭtranĉe

p(en,adj,subst).
p(ekster,adj,subst).
p(inter,adj,subst).
p('antaŭ',adj,subst).
p(apud,adj,subst).
p('ĉe',adj,subst).
p('ĉirkaŭ',adj,subst).

p(dum,adj,subst).
p(dum,adv,verb).

p('kontraŭ',adj,subst).

p('laŭ',adj,adv).
p('laŭ',adj,adj).
p('laŭ',adj,subst).

p(pri,adj,subst).

p(per,adv,subst).
p(sen,adj,_).
%p(sen,adj,subst).

p(sub,adj,subst). 
p(super,adj,adj).
p(super,adj,adv).
p(sur,adj,subst). 

p(trans,adj,subst).

p('ĉiu',adj,subst). % de ĉiu jaro -> ĉiujara
p('tiu',adj,subst). % de tiu jaro -> tiujara
p('kiu',adj,subst). % de kiu jaro -> kiujara
p('neniu',adj,subst). % de neniu jaro -> neniujara

p('ĉia',adj,subst). % de ĉia speco -> ĉiaspeca
p('tia',adj,subst). % de tia speco -> tiaspeca
p('kia',adj,subst). % de kia speco -> kiaspeca
p('nenia',adj,subst). % de nenia speco -> neniaspeca

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
{:.programo}

Nia gramatiko:

```prolog
vorto(v,Spc) 
  <= v(_,Spc,_).

% simplaj mal-vortoj (malfor, malantaŭ, maltro...)
vorto(pv,Spc) 
  <= p(mal,_) / v(_,Spc,_) 
  ~> (Spc='adv'; Spc='prep').

vorto('Df',Spc) 
  <= &rv_sen_fin(_,Vs) / f(_,Fs)
  ~> (subspc(Vs,Fs),  % subspeco konserviĝas ...
       Spc=Vs 
     ; Spc=Fs).    

% derivado per propra prefikso
rv_sen_suf(pr,Spc) 
  <= p(_,De) / r(_,Spc,_) 
  ~> subspc(Spc,De).
rv_sen_suf(pD,Spc) 
  <= p(_,De) / &rv_sen_suf(_,Spc) 
  ~> subspc(Spc,De).

% derivado per prepozicioj uzataj prefikse ĉe verboj
rv_sen_suf(pr,Al) 
  <= p(_,Al,De) / r(_,Spc,_) 
  ~> subspc(Spc,De), subspc(De,verb).
rv_sen_suf(pD,Al) 
  <= p(_,Al,De) / &rv_sen_suf(_,Spc) 
  ~> subspc(Spc,De), subspc(De,verb).  

% simpla radiko
rv_sen_fin(r,Spc) <= r(_,Spc,_). 
% radiko kun prefikso(j)
rv_sen_fin('D',Spc) <= &rv_sen_suf(_,Spc).

% radika vorto + sufikso, ekz. san/ul
rv_sen_fin('Ds',Spc) 
  <= &rv_sen_fin(_,Vs) / s(Suf,_,_) 
  ~> drv_per_suf(Suf,Vs,Spc).

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

{% include pl-demando.html query=
  'vorto(Regul,Spc,prakulturo,Ana),
   term_atom(Ana,Rezulto).' %}

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
