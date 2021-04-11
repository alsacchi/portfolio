---
title: 'Writeup PortaleDelAutomobilista'
date: '2021-04-07'
---

Durante uno dei primi mesi di pandemia del 2020 mentre "seguivo" la didattica a distanza mi era venuta la bella idea di intercettare il traffico http dell'app IPatente, *tanto cosa c'era di meglio da fare*.  
In questo "writeup" vi mostro cosa ho trovato e come in 30 secondi avrei potuto ottenere il numero della patente del <s>ex ministro degli interni</s>.

### PROXY
Come da manuale ho avviato un container docker con l'immagine di mitmproxy per avere un ambiente già pronto, nel mentre configuro il mio telefono per reindirizzare tutto il traffico http attraverso il proxy. (Aggiungendo ovviamente la CERTIFICATE AUTHORITY generata da mitmproxy) 

Intercettando le prime richieste mi sarei aspettato dell'SSL pinning, invece la strada era bella liscia per iniziare l'analisi.

### Flow Conversazione Regolare

Si utilizza il CODICEFISCALE_1 per ottenere il **numeroDocumento**.


```http
POST /ipatente/services/saldoPuntiPatente HTTP/1.1
authorization: Bearer XXXXXXX
matricola: XXXXXXX
token: XXXXXXX
Host: www.ilportaledellautomobilista.it
User-Agent: okhttp/3.12.1
Content-Type: application/json

{
    "SaldoPuntiRequest": {
        "codiceFiscale": "CODICEFISCALE_1"
    }
}

HTTP/1.1 200 OK
Date: Fri, 06 Nov 2020 15:59:12 GMT
Server: JBoss-EAP/7
X-Frame-Options: SAMEORIGIN
X-Powered-By: Undertow/1
Content-Type: application/json

{
    "SaldoPuntiResponse": {
        "listSaldi": {
            "saldo": [{
                "documento": {
                    "tipoDocumento": "PAT",
                    "numeroDocumento": "PATENTE_1"
                },
                "descrizioneDocumento": "Patente di Guida",
                "dataScadenza": "DATA_DI_SCADENZA_1",
                "saldoPunti": 21
            }]
        }
}}
```
Il **numeroDocumento** permette di ottenere le seguenti informazioni:
```http
POST /ipatente/services/saldoPuntiPatente HTTP/1.1
authorization: Bearer XXXXXXX
matricola: XXXXXXX
token: XXXXXXX
Host: www.ilportaledellautomobilista.it
User-Agent: okhttp/3.12.1
Content-Type: application/json

{
    "DettaglioPuntiRequest": {
        "documento": {
            "tipoDocumento": "PAT",
            "numeroDocumento": "PATENTE_1"
        },
        "numeroPagina": 0,
        "totRecord": 100
    }
}

HTTP/1.1 200 OK
Date: Fri, 06 Nov 2020 16:04:13 GMT
Server: JBoss-EAP/7
X-Frame-Options: SAMEORIGIN
X-Powered-By: Undertow/1
Content-Type: application/json

{
    "DettaglioPuntiResponse": {
        "dettaglioDocumento": {
            "saldo": {
                "documento": {
                    "tipoDocumento": "PAT",
                    "numeroDocumento": "PATENTE_1"
                },
                "descrizioneDocumento": "Patente di Guida",
                "dataScadenza": "DATA_DI_SCADENZA_1",
                "saldoPunti": 21
            },
            "dataNascita": "DATA_DI_NASCITA_1",
            "nominativo": "NOMINATIVO_1"
        },
        "listMovimenti": {
            "movimento": [{
                "dataVariazionePunteggio": "2019-02-13",
                "puntiEffettiviCredito": 20,
                "descrizioneEvento": "PUNTEGGIO  RILASCIO DOCUMENTO"
            }, {
                "dataVariazionePunteggio": "2020-02-13",
                "puntiEffettiviCredito": 1,
                "descrizioneEvento": "INCR.NEOPAT.ASSENZA VIOL."
            }]
        },
        "countRecord": 2
    }
}
```

### IL CODICE FISCALE L'ARMA DEL DEMONIO
Alla prima richiesta noto che l'unica chiave del oggetto JSON è il "codiceFiscale", speravo tanto non potesse essere così facile.

### Mi sbaglio sempre
Avevo una vasta scelta di codici fiscali da provare tra cui quello di mio padre, mio fratello o mia mamma.
Modificato il corpo JSON con il nuovo codice fiscale ho fatto un replay della richiesta e dopo circa 300 millisecondi ecco la risposta, terrificante quanto divertente non ricevo il numero della mia patente ma bensì quello <s>del ex ministro degli interni</s> di mio padre.  
Tutto questo mi ha ricordato il portale dell'ATS di Milano dove con il codice fiscale potevi scoprire se una persona era positiva o meno al COVID.
![Flow conversazione](../images/posts/automobilista/flow.png)

### E Ora?
Subito a fare festa! Ho scoperto la mia prima vulnerabilità di un certo rilievo, cosa fare ora?  
Beh prima tutto bisognava riferire la scoperta a mio padre, che a detta della sua bio di twitter è un "*Programmatore di un certo livello*",  infatti una domanda gli sorse spostanea: "Sei passato da TOR? Hai usato un account senza nessun riferimento alla tua persona? PERCHÈ PROPRIO IL MIO CODICE FISCALE <s>DI UN EX MINISTRO DEGLI INTERNI</s>?"  

Io non ero passato da TOR o VPN varie e avevo pure usato il mio account, e non c'era neanche la necessità di usare il mio perchè bastava un qualsiasi account ex novo senza dati reali.  
Ora panico, questi ci denunciano, lo so come funziona in Italia quando dai fai una roba del genere:

<div align="center">
    <img alt="Battuta che rappresenta i ricercatori informatici" src="../images/posts/automobilista/criminal.jfif" width="300px" height="400px">
</div>

### Il problema
Con lo stesso token di autenticazione ottenuto precedentemente è possibile ricavare informazioni di altre persone cambiando il **codice fiscale** ! \
Il servizio andrà a rispondere con il **numeroDocumento**, data di scadenza e saldo punti collegati al codice fiscale (Primary Key). \
Si tratta evidentemente di una insufficiente validazione delle richieste, che permette al client autenticato di enumerare potenzialmente l’intero dataset.

### La comunicazione
Beh poi si era presentata la fase più complicata, dovevo comunicare questo problema in qualche modo al portaledelautomobilista <s>oppure su twitter</s>. Non sapendo bene cosa fare ho deciso di mandare una mail all'AGID, l'agenzia dell'italia digitale che mi ha subito inoltrato la mail allo CSIRT, da li il silenzio per circa 14 giorni.
La vulnerabilità persisteva e io ero sempre più tentato di fare un post su twitter, ma visto che sono responsabile ho risegnalato il problema questa volta direttamente allo CSIRT.  
***ALTRO SILENZIO PER 16 GIORNI***  
Dopo altri estenuanti giorni, con il dito pronto a mandare un tweet con il numero della patente di quella persona lì ecco, ho ricevuto la risposta dallo CSIRT dove mi confermavano l'attivazione del *Dicastero di riferimento*, cito la mail, "*si rende noto che questo CSIRT ha attivato il Dicastero di riferimento, il quale è stato puntualmente reso edotto dei contenuti della segnalazione pervenuta dalla Signoria Vostra).*".

### La fine
Da li a poco la falla è stata chiusa, il mondo era chiaramente diventato un posto migliore grazie a me.

<s>MI ASPETTAVO ALMENO UN GRAZIE MA NIENTE DI TUTTO QUESTO.</s>


### Stato report
5/11/2020: Scoperta vulnerabilità  
6/11/2020: Segnalazione all'AGID  
11/11/2020: Agid inoltra allo CSIRT  
20/11/2020: Risegnalazione direttamente allo CSIRT  
6/12/2020: Richiesta aggiornamenti dallo CSIRT  
11/12/2020: Risposta dallo CSIRT  
??/12/2020: Falla patchata  