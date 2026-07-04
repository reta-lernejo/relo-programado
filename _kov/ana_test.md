---
layout: laborfolio
title: Vortanalizo
js:
    - tau-prolog
    - tau-prolog-util
pl:
    - gra/gramatiko
    - gra/vorto_gra
    - gra/regul_trf    
---

<!--

// aldoni lininumerojn:

<div class="editor">
    <div class="gutter"></div>
    <div class="code" contenteditable="true"></div>
</div>

.editor {
    display: flex;
    font-family: monospace;
}

.gutter {
    width: 3em;
    text-align: right;
    padding-right: .5em;
    color: #888;
    user-select: none;
}

.code {
    white-space: pre;
    outline: none;
    flex: 1;
}

const lines = editor.innerText.split("\n").length;
gutter.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");

-->

programo:
```prolog
:- use_module(library(dom)).
:- use_module(library(js)).
:- use_module(library(format)).
:- use_module(library(lists)).
:- use_module(library(charsio)).

debugging(gramatiko).
debugging(gra_prep).


debug(Topic,Fs,Args) :- 
  debugging(Topic),
  current_output(Stream),
  (atom(Fs) -> atom_chars(Fs,F); F=Fs),
  phrase(format_(F,Args),Cs),
  (
    atom_chars(Msg,Cs),
    write(Stream,Msg)
  ).    

:- op( 1120, xfx, '<=' ). % disigas regulo-kapon, de regulesprimo

term_expansion( '<='(RuleHead, RuleBody) , RuleTranslated ) :-
  % debug(gra_prep,'%# ~q ...',[RuleHead]), % error(instantiation_error,fabricate_var_name/3)
  catch((
    rule_head(RuleHead,Vrt,Rez,Depth,PredHead),!,
    once((
        rule_body(RuleHead,RuleBody,Vrt,Rez,Depth,PredBody)
        ;  
        % format(atom(Exc),'transformeraro: ~w~n',[RuleHead]), 
        throw(error(syntax_error(transform_eraro),Exc))
    )),
    RuleTranslated = (PredHead :- PredBody)    
    % debug(gra_prep,'  ...bone!',[]).
    % format('  ~w~n',[RuleTranslated]).
  ),
  E,
  write(E)
  ).

rule_head(RuleHead,Vrt,Rez,Depth,PredHead) :-
   RuleHead =..  [RuleName|RuleArgs],
   append(RuleArgs,[Vrt,Rez,Depth],Args),
   PredHead =.. [RuleName|Args],
     write('head:'),write(PredHead).


%... 

rule_body(RuleHead,RuleExp,Vrt,Rez,Depth,PredBody) :-
  % se ni ne havas postkondiĉon sufiĉas krei la "unuan parton"
  rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,PredBody),
  write('body:'),write(PredBody).

% la dekstra parto povas ankaŭ esti unuparta, simpla, ekz. vortarserĉo
% aŭ forreferenco al subordigita regulo
rule_exp(RuleHead,RuleExp,Vrt,Rez,Depth,PredExp) :-
  rule_ref(RuleExp,Vrt,Rez,Depth,PredSmp),
  RuleHead =.. [_,RuleScheme|_],
  PredExp =  (
    %debug(Depth,'?',RuleScheme,Vrt), 
    PredSmp
    %debug(Depth,'*',RuleScheme,Rez)
  ),
write(e2), write(RuleExp).

rule_ref(DictSearch,Vrt,Vrt,_,DictSearch) :-
  DictSearch =.. [_,Vrt|_].


splitter(RuleScheme,RuleRef1,RuleRef2,Vrt,V1,Rest,Splitter) :-
    % PLIBONIGU: iom malavantaĝe estas, ke RuleId - unua argumento en RuleRef
    % ofte estas "_" kaj do ne konata, oni povus rigardi chiujn eblecojn pri specifa regulo
    % sed ofte elvenas intervalo 2.. kiu ne multe diferencas de 1..99

    Min1 =1, Max1 =3,
    Min2 =1, MAx2 =6,
    
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


v(al,prep,'*').
v('hodiaŭ',adv,'*').
v(ek,intj,'*').

% simpla vorteto, ekz.  hodiaŭ, ek,...
vorto(v,Spc) <= v(_,Spc,_).    

```
{: #programo contenteditable="true"}


demando ?- 
```prolog
% demando:...
vorto(v,Spc,V,al,_).
```
{: #demando contenteditable="true"}


<button id="rulu">Rulu</button>

<div id="respondo"></div>

<script>

    async function moduloj() {
        //const programoj = ['gra__regul_trf','gra__vorto_gra','gra__gramatiko'].map((id) =>{
        const programoj = ['gra__regul_trf'].map((id) =>{
            const script = document.getElementById(id);
            return script.src
        });
        console.log(programoj);

        const seanco = await konsultu_plurajn(programoj,{url: true, term_expansion: true});
        return seanco;
    }

    async function programo(seanco) {
        const programo = document.getElementById('programo').innerText;
        // console.log(programo);

        seanco = await konsultu(programo,seanco);
        console.log(seanco.rules['vorto/5']);
        await demando_respondo(seanco,'demando','respondo');
    }

    //prologo();
    (async function () {
        //let seanco = await moduloj();
        let seanco = pl.create();
        document.getElementById('rulu').addEventListener("click",() => programo(seanco));
    })();
</script>
