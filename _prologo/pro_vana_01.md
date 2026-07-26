---
layout: laborfolio
title: 4.1 Vortanalizo - vortareto
next_ch: pro_vana_02
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog
---

## Vortareto

Por krei esperantan vortanalizilon ni komencu per listo de *finaĵoj* kun iliaj vortspecoj
kiel faktoj `f/2`.

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
{:.programo}

Ni aldonu kelkajn *radikojn* kiel faktoj `r/3` kun siaj vorspeco kaj
oficialeco. Ordinare, laŭ gramatika vidpunkto, ni ne distingas homojn de
aliaj bestoj: *-in* aplikiĝas al homoj kiel al bestoj, ĉas*ant*o povas esti homo 
kun pafilo aŭ tigro, grand*ul*o povas esti urso aŭ altkreska homo. Sed ni ja 
distingos parencojn, ĉar iuj afiksoj (*bo-*), aplikiĝas nur al parencoj.

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
{:.programo}

Oni povas laŭplaĉe serĉi en la vortaro, ekzemple 
transitivajn verbojn laŭ vortkomenco 'ku'.

{% include pl-demando.html n=99 query=
  'r(Vorto,tr,Ofc), atom_chars(Vorto,[k,u|_]).' %}

Aŭ tiel se vi preferas:

{% include pl-demando.html n=99 query=
  'r(Vorto,tr,Ofc), atom_concat(ku,_,Vorto).' %}

*Tasko*: Se vi ŝatas iom ekzerci, aldonu en la programkampo predikaton
por pli komforta serĉo (ekz-e sub la radikoj).

## Analizi radikvortojn kun finaĵo

Por analizi simplan vorton konsistantan el radiko kaj finaĵo,
ni devas unue dividi ĝin en du partojn kaj poste rigardi, ĉu la malantaŭa parto
estas finaĵo kaj la antaŭa parto troviĝas en la radikaro.

Ĉar ni scias, ke la finaĵoj havas inter unu kaj tri literoj, ni
komencu ĉe la fino. Tiucele ni uzas la predikaton 
`sub_atom(Signaro,Antaŭ,Longo,Post,Subsignaro)`.

```prolog
:- use_module(library(lists)).

vorto(Spec,Vorto,[Radiko,Fino]) :-
    % splito
    between(1,3,Lf),
    sub_atom(Vorto,Lr,Lf,0,Fino), 
    sub_atom(Vorto,0,Lr,Lf,Radiko),
    % kondiĉoj
    f(Fino,Spec),
    r(Radiko,_,_).
```
{:.programo}

Provu ni, ĉu jam funkcias:

{% include pl-demando.html n=99 query=
  'member(Vorto,[doktoroj,subite,kuracis,miajn,sanajn,bovojn]), 
   vorto(Spec,Vorto,Analizo).' %}

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
