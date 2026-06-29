---
layout: page
title: Romaj ciferoj per Prologo
---

* Enhavo
{:toc}

## Romaj ciferoj per Prologo

```prolog
    roma_cifero('I',1).
    roma_cifero('V',5).
    roma_cifero('X',10).
    roma_cifero('L',50).
    roma_cifero('C',100).
    roma_cifero('D',500).
    roma_cifero('M',1000).

    ?- roma_cifero(R,50).
```

<div id="rezulto"></div>

<script src="https://cdn.jsdelivr.net/npm/tau-prolog@0.3.2/modules/core.min.js"></script>

<script>
    // 1. Eine neue Prolog-Sitzung erstellen
    const session = pl.create();

    // 2. Die Wissensdatenbank (Fakten & Regeln) definieren
    const programm = `            
        roma_cifero('I',1).
        roma_cifero('V',5).
        roma_cifero('X',10).
        roma_cifero('L',50).
        roma_cifero('C',100).
        roma_cifero('D',500).
        roma_cifero('M',1000).
    `;

    // 3. Das Programm einlesen (consult)
    session.consult(programm, {
        success: function() {
            // 4. Eine Abfrage (Query) stellen
            session.query("roma_cifero(R,50).", {
                success: function() {
                    // 5. Die Antwort abrufen
                    session.answer({
                        success: function(rezulto) {
                            // Antwort im HTML anzeigen (gibt "Was = tau_prolog" aus)
                            document.getElementById("rezulto").innerText = session.format_answer(rezulto);
                        }
                    });
                }
            });
        }
    });
</script>