---
layout: home
title: Enhavo
---

## Pri programado 
{% assign pr = site.programado | sort: "title" %}
{% for t in pr %}
  {% unless t.url contains "index" %}
  {% if t.title %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
  {% endif %}  
  {% endunless %}
{% endfor %}


## Prologo

Interaga kurseto kun ekzercetoj 
enkondukanta en la bazojn konceptojn de Prologo.

{% assign pl = site.prologo | sort: "title" %}
{% for t in pl %}
  {% if t.title %}
  {% assign prefix = t.url | slice: 0, 18 %}
    {% if prefix == "/prologo/pro_romaj" %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
    {% endif %}
  {% endif %}  
{% endfor %}
