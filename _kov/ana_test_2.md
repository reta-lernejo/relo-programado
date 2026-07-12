---
layout: laborfolio
title: Vortanalizo
js:
  - tau-prolog
  - tau-prolog-util
css:
  - tau-prolog  
pl:
  - gra/gramatiko
  - gra/vorto_gra
  - gra/regul_trf    
---

programo:
```prolog
:- use_module(library(dom)).
:- use_module(library(js)).
:- use_module(library(format)).
:- use_module(library(lists)).
:- use_module(library(charsio)).

debugging(gramatiko).
debugging(gra_prep).

:- op( 1120, xfx, '<=' ). % disigas regulo-kapon, de regulesprimo
:- op( 1120, xfx, '<-' ). % disigas regulo-kapon, de esceptesprimo
:- op( 1110, xfy, '~>' ). % enkondukas kondichojn poste aplikatajn al sukcese aplikita regulo
:- op( 150, fx, '&' ). % signas referencon al alia regulo

debug(Topic,Fs,Args) :- 
  debugging(Topic),
  current_output(Stream),
  (atom(Fs) -> atom_chars(Fs,F); F=Fs),
  phrase(format_(F,Args),Cs),
  (
    atom_chars(Msg,Cs),
    write(Stream,Msg)
  ).      

debug(Depth,Msg,Scheme,Rezulto) :-
  debugging(gramatiko) -> (
    sub_atom('------------------------------------------------------------------------------------------',0,Depth,_,Indent),
    debug(gramatiko,'~w ~q ~q ~q',[Indent,Msg,Scheme,Rezulto])
  ); true.


term_expansion( <=(RuleHead, RuleBody) , RuleTranslated ) :-
  debug(gra_prep,'%# ~k ...',[RuleHead]),
  rule_head(RuleHead,Vrt,Rez,Depth,PredHead),!,
  once((
    rule_body(RuleHead,RuleBody,Vrt,Rez,Depth,PredBody)
    ;  
    format(atom(Exc),'transformeraro: ~w~n',[RuleHead]), 
    throw(error(syntax_error(transform_eraro),Exc))
  )),
  RuleTranslated = (PredHead :- PredBody),
  debug(gra_prep,'  ...bone!',[]).
% format('  ~w~n',[RuleTranslated]).

% esceptojn ni difinas per simpla sageto: <- 
%    rv_sen_fin(e,subst) <- post/e/ul.
%
% transformu al: rv_sen_fin(e,subst,posteul,post/e/ul,_).
%? au alternative: rv_sen_fin(e,subst,Vrt,Rez,_Depth) :- Vrt = posteul, Rez = post/e/ul.

term_expansion( <-(RuleHead, RuleBody), RuleTranslated ) :-
  % silentu pri escpetoj, tro multaj linioj: format('%# ~k ...',[RuleHead]),
  reduce_full(RuleBody,Flat),
  RuleHead =..  [RuleName|RuleArgs],
  append(RuleArgs,[Flat,RuleBody,_Depth],Args),
  RuleTranslated =.. [RuleName|Args].
  % silentu pri escpetoj, tro multaj linioj: format('bone!~n').
  % format('  ~w~n',[RuleTranslated]).


rule_head(RuleHead,Vrt,Rez,Depth,PredHead) :-
   RuleHead =..  [RuleName|RuleArgs],
   append(RuleArgs,[Vrt,Rez,Depth],Args),
   PredHead =.. [RuleName|Args].


rule_body(RuleHead,~>(RuleExp,PostCond),Vrt,Rez,Depth,PredBody) :-
  % kreo de la unua parto
  rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,FirstPart),
  % alpendigo de la postkondiĉo, kiu ja estas valida Prologo-kodo per "KAJ" = ","
  % post la unua parto
  PredBody =.. [',',FirstPart,PostCond].

rule_body(RuleHead,RuleExp,Vrt,Rez,Depth,PredBody) :-
  % se ni ne havas postkondiĉon sufiĉas krei la "unuan parton"
  rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,PredBody).


% transformu regulo-esprimon (rule expression) al Prologo
rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,PredExp) :-
  RuleHead =.. [_,RuleScheme|_],
  % ĉu la regulesprimo (dekstra parto) enhavas unu el la permesataj operatoroj,
  % ekz. R1 / R2
  RuleExp =.. [Op|Refs],
  memberchk(Op,['+','/','~','-','*']),!,
  Refs = [R1,R2],
  Rez =.. [Op,Rez1,Rez2], 

  % kreu la Prologo-kodon por la regul-aplikoj kaj
  % la vortdismeto (Splitter)
  % R1 kaj R2 referencas al la nomoj de gramatikaj reguloj
  % kiuj povas esti aŭ vortarserĉo aŭ gramatika regulo (komenciĝanta per "&")
  % la lasta argumento redonas la kunmetitan kodon por vokado de tiu regulo (aŭ serĉo)
  rule_ref(R1,V1,Rez1,D1,RRef1),
  rule_ref(R2,Rest,Rez2,D1,RRef2),
  splitter(RuleScheme,R1,R2,Vrt,V1,Rest,Splitter),

  % por optimuma analizo: se la regul-skemo trovita en la kapo
  % temas pri apliko de prefikso aŭ antaŭvorto,
  % komencu per maldekstra parto (ĉar tiu parto estas verŝajne pli mallonga)
  % En aliaj okazoj (sufiksoj, finaĵoj, komencu per destra parto.

  (memberchk(RuleScheme,['pD','vD','pv','pr','pAP','A+P']) ->
    Sub = (RRef1,RRef2)
  ; Sub = (RRef2,RRef1)
  ),

  % kunmetu nun la kod-partojn al tuta predikato-korpo
  PredExp =  (
    debug(Depth,'?',RuleScheme,Vrt), 
    Splitter,
    D1 is Depth +1,
    Sub,
    debug(Depth,'*',RuleScheme,Rez) 
  ).

% la dekstra parto povas ankaŭ esti unuparta, simpla, ekz. vortarserĉo
% aŭ forreferenco al subordigita regulo
rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,PredExp) :-
  rule_ref(RuleExp,Vrt,Rez,Depth,PredSmp),
  RuleHead =.. [_,RuleScheme|_],
  PredExp =  (
    debug(Depth,'?',RuleScheme,Vrt), 
    PredSmp,
    debug(Depth,'*',RuleScheme,Rez)
  ).


% komenciĝante per "&", la regulo-parto referencas alian regulon
rule_ref(&RuleRef,Vrt,Rez,Depth,RuleCall) :- !,
  RuleRef =.. [RuleName|RuleArgs],
  append([RuleArgs,[Vrt,Rez,Depth]],Args),
  RuleCall =.. [RuleName|Args].

% la regulo-parto estas serĉo en la vortaro, je prefiksoj, radikoj, sufiksoj, finaĵoj...
% DictSearch estas ekz-e v(Vrt,Spec,Ofc) - por vortoj kaj radikoj ni havas oficialecon
rule_ref(DictSearch,Vrt,Vrt^Ofc,_,DictSearch) :-
  DictSearch =.. [Srch,Vrt,_Spc,Ofc],
  memberchk(Srch,[v,r,nr,nr_,nk]),!.

% nommkomenco, t.e. mallongigita nomo kiel en Pe(tr)ĉjo
%rule_ref(DictSearch,Vrt,Vrt:Rest^Ofc,_,DictSearch) :-
%  DictSearch =.. [nk,Vrt,_Spc,Rest,Ofc],!.

% DictSearch estas alispeca vortero (sen oficialeco)
rule_ref(DictSearch,Vrt,Vrt,_,DictSearch) :-
  DictSearch =.. [_,Vrt|_].


splitter(RuleScheme,RuleRef1,RuleRef2,Vrt,V1,Rest,Splitter) :-
    % PLIBONIGU: iom malavantaĝe estas, ke RuleId - unua argumento en RuleRef
    % ofte estas "_" kaj do ne konata, oni povus rigardi chiujn eblecojn pri specifa regulo
    % sed ofte elvenas intervalo 2.. kiu ne multe diferencas de 1..99
    get_rule_min_max(RuleRef1,Min1,Max1),
    get_rule_min_max(RuleRef2,Min2,Max2),
    
    once((	
      memberchk(RuleScheme,['pD','vD','pv','pr','pAP','A+P']),
        % prefikso pli mallonga ol la resto...
        Splitter = (

          % maldekstra parto de la vorto (aŭ vortparto)
          % havanta longecon L1, kiu estu inter Min1 kaj Max1
          between(Min1,Max1,L1),
          sub_atom(Vrt,0,L1,L2,V1),

          % dekstra parto de la vorto (aŭ vortparto)
          % havanta longecon L2 = (vortlongeco)-L1
          % kaj estu inter Min2 kaj Max2
          between(Min2,Max2,L2),
          sub_atom(Vrt,L1,L2,0,Rest)
        )
      ; % ordinare komencu de malantaue
       % sufiksoj kaj finaĵoj normale estas mallongaj...
       Splitter = (

         between(Min2,Max2,L2),
         sub_atom(Vrt,L1,L2,0,Rest), 

         between(Min1,Max1,L1),
         sub_atom(Vrt,0,L1,L2,V1)
     )
  )).


get_rule_min_max(RuleId,Min,Max) :-
  atom(RuleId),
  (min_max_len(RuleId,Mn,Mx) -> 
     Min is max(1,min(Mn,99)),
     Max is min(Mx,99),
     debug(0,rmin,RuleId,Min),
     debug(0,rmax,RuleId,Max)
  ; 
     Min is 1, 
     Max is 99). 

get_rule_min_max(&RuleRef,Min,Max) :-
  RuleRef =.. [_,RuleId|_],
  (nonvar(RuleId), min_max_len(RuleId,Mn,Mx) -> 
     Min is max(1,min(Mn,99)),
     Max is min(Mx,99),
     debug(0,rmin,RuleId,Min),
     debug(0,rmax,RuleId,Max)
  ; 
     Min is 1, 
     Max is 99). 

get_rule_min_max(Search,Min,Max) :- 
    Search =.. [Pred|Args],
    length(Args,Arity),
%    atom_length(Vrt,Len),
    get_min_max(Pred/Arity,Mn,Mx),
    Min is max(1,min(Mn,99)),
    Max is min(Mx,99),
    debug(0,smin,Pred,Min),
    debug(0,smax,Pred,Max).

get_min_max(Pred/Arity,Min,Max) :-
  min_max_len(Pred/Arity,Min,Max) -> true
  ; % min/max still not known -> calculate it
    functor(Func,Pred,Arity),
    Func =.. [_,Vrt|_],
    findall(L,
	    (call(Func),atom_length(Vrt,L)),
            Lens),
    max_list(Lens,Max),
    min_list(Lens,Min),
    assert(min_max_len(Pred/Arity,Min,Max)).

v(al,prep).

% simpla vorteto, ekz.  hodiaŭ, ek
vorto(v,Spc) <= v(_,Spc,_).    

```
{:.programo}

{% include pl-demando.html n=10 query=
  "debug(gramatiko,\"test: ~w\",[1])." %}





<script>

    //async function moduloj() {
    //    //const programoj = ['gra__regul_trf','gra__vorto_gra','gra__gramatiko'].map((id) =>{
    //    const programoj = ['gra__regul_trf'].map((id) =>{
    //        const script = document.getElementById(id);
    //        return script.src
    //    });
    //    console.log(programoj);
//
    //    const seanco = await konsultu_plurajn(programoj,{url: true, term_expansion: true});
    //    return seanco;
    //}

    const limo = 100000;  // evitu eternan kuron, ĉe la lasta (inversa demando)

    function informo(seanco,respondo) {
      const thread = seanco.thread;
      const msg = 
        `${thread.cpu_time}ms, ` +
        `${thread.total_steps} penseroj`;
      tau_info(respondo,msg);
    };

    async function prologo(demando,respondo,maks_respondoj) {
        let programo = '';
        document.querySelectorAll('.programo code').forEach((c) => {
            programo += c.innerText;
        });

        const seanco = pl.create(limo);
        await konsultu(programo,seanco);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
        informo(seanco,respondo);
    };

    preparu_programojn();
    preparu_ekzercojn(prologo);
</script>