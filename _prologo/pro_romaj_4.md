---
layout: laborfolio
title: Romaj ciferoj per Prologo 4
next_ch: pro_romaj_5
js:
    - tau-prolog
    - tau-prolog-util
css:
    - tau-prolog   
---

### Reguloj por romaj nombroj

Ni nun lernis sufiĉe por provi difinon de romaj nombroj. Ni komencu per la trivialaj kazoj.

#### Triviala kazo

se ni ricevas malplenan liston, ni konsideru tion kiel nulo - laŭ valoro - la romanoj ne havis ciferon 'nul'.
Se ni ricevas signoliston kun nur unu elemento, tio devas esti cifero. Do:


```prolog
roma_cifero('I',1).
roma_cifero('V',5).
roma_cifero('X',10).
roma_cifero('L',50).
roma_cifero('C',100).
roma_cifero('D',500).
roma_cifero('M',1000).

roma_nombro([],0).
roma_nombro([Cifero],Valoro) :- roma_cifero(Cifero,Valoro).
```
{:.programo}

#### Adicia regulo

Se ni ricevas signoliston kun pli ol unu elemento, ni rigardos la unuajn du. Se la dua cifero
estas egala aŭ pli malgranda ol la unua ni adicias ĝin al la nombro, kiun ni 
ricevos el la cetero de la signolisto, t.e. dua ĝis lasta elemento:

```prolog
roma_nombro([C1,C2|Resto],Valoro) :-
    roma_cifero(C1,V1),
    roma_cifero(C2,V2),
    V1>=V2,!,
    roma_nombro([C2|Resto],RestValoro),
    Valoro is V1 + RestValoro.
```
{:.programo}

Vi vidas, ke eblas disanalizi la liston jam en la regulkapo: `roma_nombro([C1,C2|Resto],Valoro) :- ...`
estas konciza maniero anstataŭ `roma_nombro(Signoj,Valoro) :- Signoj = [C1,C2|Resto], ...`, tio ŝparas unu linion,
sed ankaŭ jam en la kapo montras, kiam la regulo estas aplikebla: la signaro devas havi almenaŭ du elementojn.

#### Subtraha regulo

Alia kazo estas, se malgranda cifero aperas antaŭ unu el 'X','C', 'M', tiam oni subtrahas ĝin. 
(Ni testos tion per `member/2`, kiu kontrolas, ĉu elemento troviĝas en listo. Ĝi
troviĝas en aparta modulo `lists`, kiun ni inkluzvas do.)
Tamen, ne arbitraj ciferoj povas aperi en tiel inversigita ordo: la maldekstra devas esti 
kvinono aŭ dekono de la dekstra:


```prolog
:- use_module(library(lists)).

roma_nombro([C1,C2|Resto],Valoro) :-
    roma_cifero(C1,V1),
    roma_cifero(C2,V2),
    member(C2,"XCM"),
    (V2 is V1 * 5; V2 is V1 * 10),!,
    roma_nombro([C2|Resto],RestValoro),
    Valoro is RestValoro - V1.

% kiam la signaro havas almenaŭ du elementojn, kiuj
% tamen ne plenumas la du antaŭajn regulojn (adicia aŭ subtraha), 
% la nombro do devas esti malvalida.
roma_nombro([_,_|_],_) :- throw(malvalida).
```
{:.programo}

Ni devos klarigi kelkajn aferojn, kiujn ni ankoraŭ ne vidis antaŭe:

1. Ni nun skribis plurajn regulojn por la sama predikato `roma_nombro/2`. Ili estas 
alternativoj. Do Prologo aplikos ilin unu post la alia, de supre malsupren ĝis unu veriĝos.
Tiam ĝi redonos la rezulton kiel solvo.

2. La adicia kaj subtraha alternativoj enhavas siavice termon `roma_nombro/2` por trovi la valoron
de la restnombro (sen la unua cifero). Tiam prologo por tiu pli mallonga signaro rekomencos
apliki la regulojn des supre malsupren: se la resto estas malplena la unua regulo aplikiĝus, sed 
nu tio ne povas okazi, ĉar ni jam kontrolis, ke anakŭ estu dua elemento - do efektive ni 
povus rezigni pri la nul-regulo. Ni bezonos ĝin nur, se tuj en la komenco iu demandos `roma_nombro("",V).`
Sed ja kontroliĝos la pliaj reguloj: se la resto estas nur unuelemento - ĝi estos cifero kies valoron
ni scias el niaj faktoj `roma_cifero/2`, se ĝi estas plurelementa ni denove provos apliki la adician aŭ 
la sutrahan regulon, ĝis ni alvenos ĉe la fino de la listo aŭ ĉe malvalida kombino.

3. Vi vidas, ke ni aldonis escepto-regulon por malvalideco, se ni alvenos tie, la signoj en la nombro
ne plenumas la antaŭajn regulojn, do ĝi devas esti malvalida. Ja povas esti, ke la maldekstra cifero 
estas pli malgranda ol la apuda dekstra, sed nek kvinono, nek dekono: "IV", "IX" estas 
bonaj nombroj, sed "IC", "VM" estas nevalidaj laŭ roma nombrosistemo. 
En tiu okazo ni alvenos al la lasta alternativo de nia regulo, kiu ĵetos escepton 'malvalida'.
La esprimo [_,_|_], certigos ke la escepto-regulon ni aplikas nur al signaroj kun du aŭ pli da elementoj.

4. Por ke la apliko de la esceptoregulo funkciu ĝuste, ni aldonis ankoraŭ
du krisignojn malantaŭ la kondiĉoj de la du antaŭaj reguloj (adicia kaj subtraha). 
La krisigno `!` nomiĝas *tranĉo*, ĝi funkcias kiel valvo: oni povas trairi ĝin de supre malsupren, sed ne inverse. 
Kial ni do bezonos tiun valvon? Prologo provos trovi ne nur unu, sed ĉiujn eblajn solvojn ĝis ĝi ne plu trovas iujn.
Do se ĝi ekzemple trovis solvon laŭ la adicia regulo, ĝi serĉos plian solvon kaj elprovos ĉiujn sekvajn regulojn 
ankaŭ ĝis ĝi alvenos ĉe la esceptoregulo kaj tiam ĵetos kiel dua solvo 'malvalida' - kio ja ne estas prava.
Do la `!` signos al Prologo: se vi jam alvenis ĉe la adicia (aŭ subtraha) regulo laŭ la donitaj kondiĉoj, ne
plu serĉu malsupre aliajn alternativojn. Sen la `!` ni devus testi la inversajn kondiĉojn en la esceptoregulo mem, por 
certigi ke la du unaj ciferoj plenumas nek la adician, nek la subtrahan regulojn.

Vi povas ŝanĝi la kodon supre, ekzemple forigi la krisignojn por vidi, kiel ilia foresto efikas.

{% include prolog-ekzerco.html query=
  "roma_nombro(\"MDCCCLXXXVII\",Valoro)." %}

Bedaŭrinde tiu realigo havas ankoraŭ limigojn. Unue ĝi permesas ankaŭ nevalidajn nombrojn, 
kiel ekzemple "IXV". Laŭ la roma nobrosistemo oni ne rajtas adicia 9 kaj 5 al 14, sed devus skribi "XIV".

{% include prolog-ekzerco.html query=
  "roma_nombro(\"IXV\",Valoro)." %}

Alia problemo estas, ke ĝi apenaŭ funkcias en la kontraŭa direkto, t.e. traduki araban nombron en roman.
Ĝi inventas multajn malĝustajn nombrojn kaj krome, por ĉiu cifero en la nombro necesas 
elprovi ĝis sep ciferojn. Do por jarnombro 1887, t.e. maksimume jam 7^13, do preskaŭ 
10 miliardoj da eblaj kombionoj.

{% include prolog-ekzerco.html query=
  "roma_nombro(R,8)." %}

{% include prolog-ekzerco.html query=
  "roma_nombro(R,1887)." %}


Por propre solvi tiujn mankojn ni povas eluzi la eblecon difini gramatikon en Prologo.

<script>

    const limo = 10000;  // evitu eternan kuron, ĉe la lasta (inversa demando)

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
            programo += c.parentElement.innerText;
        });
        
        const seanco = pl.create(limo);
        await konsultu(programo,respondo,seanco);
        await demando_respondo(seanco,demando,respondo,maks_respondoj);
        informo(seanco,respondo);
    }

    preparu_programojn();
    preparu_ekzercojn(prologo);
</script>

