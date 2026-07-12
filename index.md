---
layout: home
title: Enhavo
---

## Pri programado 
{% assign pr = site.programado | sort: "title" %}
{% for t in pr %}
  {% if t.title %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
  {% endif %}  
{% endfor %}


## Prologo

{% assign pl = site.prologo | sort: "title" %}
{% for t in pl %}
  {% if t.title %}
  {% assign prefix = t.url | slice: 0, 18 %}
    {% if prefix == "/prologo/pro_romaj" %}
* [{{ t.title | escape }}]({{ t.url | relative_url }})
    {% endif %}
  {% endif %}  
{% endfor %}
