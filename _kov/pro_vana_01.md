---
layout: laborfolio
title: Vortanalizo 1 - vortareto
next_ch: pro_vana_2
js:
    - taupl.min
    - taupl-util-0b
css:
    - tau-prolog
---

## Vortareto

Post disanlizo de vortoj laŭ radikoj kaj finaĵoj, ni rigardu derivadon per sufiksoj.

```prolog
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
{:.programo}


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
{:.programo}

Oni povas laŭplaĉe serĉi en la vortaro, ekzemple 
transitivajn verbojn laŭ vortkomenco 'ku'.

{% include pl-demando.html n=99 query=
  'r(Vorto,tr,Ofc), atom_chars(Vorto,[k,u|_]).' %}

Aŭ tiel se vi preferas. 

{% include pl-demando.html n=99 query=
  'r(Vorto,tr,Ofc), atom_concat(ku,_,Vorto).' %}

Se vi ŝatas iom ekzerci, aldonu predikaton
por pli komforta serĉo en la programkampo (ekz-e sub la radikoj).

Por analizi simplan vorton konsistantan el radiko kaj finaĵo,
ni bezonas unue dividi ĝin kaj poste rigardi, ĉu la malantaŭa parto
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
