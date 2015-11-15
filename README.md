# Munkabejelentő
##Az ELTE IK Alkalmazások fejlesztése tárgy keretein belül készített 1. beadandó

______
##Követelményanalízis

#####**Funkcionális elvárások**
- Legyen lehetőség regisztrációra
- Legyen lehetőség bejelentkezésre
- Bizonyos funkciók csak bejelentkezést követően legyenek elérhetőek
- Az alkalmazással a regisztrált felhasználók tudjanak létrehozni munkalapokat
- Saját munkalapokat lehessen  (leírást és helyszínt, az érzkezési és távozási idő és státusz automatikusan állítódik)
- Saját munkalapokat lehessen törölni
- Saját munkalapok adatainak megtekintése egy listában

#####**Nem funkcionális követelmények**
- Hibalehetőségek elkerülése
- Jelszavak biztonságos kezelése
- A felület jól átlátható, használata egyszerű

#####**Használatieset-modell**
######Szerepkörök:
- Vendég: A vendég felhasználó csak a publikus oldalakat és funkciókat érheti el.
Ezek az alábbiak:
  - főoldal
  - bejelentkezés
  - regisztráció.
- Regisztrált felhasználó
  - saját munkalapok listájának(részletes adatokkal) megtekintése 
  - új munkalap felvétele
  - saját, már meglévő munkalap szerkesztése
  - saját, már meglévő munkalap törlése

![Használati eset diagram](docs/images/hasznalati_eset_diagram.png)
![Új munka felvitelének pontos menete](docs/images/folyamatleiras.png)

______
##Tervezés

#####**Architektúra terv**
######Oldaltérkép
![](docs/images/oldalterkep.png)
######Végpontok

- GET  /: főoldal
- GET  /login: bejelentkezés oldal
- POST /login: Bejelentkezés (adatok elküldése)
- GET  /login/signup: regisztráció oldal
- POST /login/signup: regisztráció (adatok elküldése)

- GET  /timesheets/list: Munkabejelentő oldal
- GET  /timesheets/new: Új munka oldal
- POST /timesheets/new: Új munka létrehozása (adatok elküldése)
- GET  /timesheets/modify: Munka módosítása oldal
- POST /timesheets/modify: Munka módosítása (adatok elküldése)
- POST /timesheets/modify/apply: Munka módosítása (adatok elküldése)
- POST /timesheets/delete: Munka törlése (adatok törlése)

#####**Felhasználóifelület-modell**
Designterv
![](docs/images/design1.png)
![](docs/images/design2.png)
#####**Osztálymodell**
Adatmodell

![](docs/images/adatmodell.png)

Állapotdiagram

![](docs/images/allapotdiagramm.png)

______
##Implementáció

- Fejlesztői környezet:
  - Keretrendszer: NODE.js
  - Fejlesztőkörnyezet : Cloud 9 (online)
  
- Könyvtárstruktúrában lévő mappák funkiója:
  - controllers: endpoint kezelőket (Router) tartalmmazza
  - models: adatmodellek szerkezetének leírását tartalmazza
  - public: a megjelenítésért felelős keretrendszereket(bootstrap, bootswatch) tartalmazza 
  - views : az endpointokhoz tartozó hbs fájlokat tartalmazza
  - viewmodels: a munkalapok állapotának jelzését tartalmazza
  - controllers: a csoportosított endpoint kezelőket (Router) tartalmmaza

______
##Tesztelés


Tesztelési környezet bemutatása
Egységtesztek:
![](docs/images/egysegteszt.png)
Funkcionális felületi tesztek: legalább 1 folyamat tesztelése
VAGY: Selenium IDE használatával
VAGY: zombie.js használatával
Tesztesetek felsorolása:
- nem regisztrált adatokkal való belépés
- regisztrált adatokkal való belépés
- már létező felhasználó adataival való regisztrálás
- még nem létező adatokkal való regisztrálás
- új munka létrehozása a leírás és a helyszín üresen hagyásával
- új munka létrehozása csak a leírás kitöltésével
- új munka létrehozása a aleírás és a helyszín kitöltésével
- munka módosítása a leírás és a helyszín kitörlésévelnp
- munka módosítása a helyszín kirötlésével
- munka módosítása a leírás és a helyszín kitöltésével
- munka törlése
- kijelentkezés



______
##Felhasználói dokumentáció
#####**Telepítés lépései:**
- A webes alkalmazásunk GitHubról tölthető le. Kicsomagolás után feltölthető szerverre, majd a server.js futtatásával elindul a program.

#####**A program használata**
- Keressük fel a weboldalt, ahol fut az alkalmazásunk
- Regisztráljunk, ha szeretnénk az összes szolgáltatást igénybevenni
- Bejelentkezés után látható a felhasználó bejelentett munkái
- Az Új munka felvitele gomb után lehetőség van új munka rögzítésére
  - Az érkezési idő automatikusan az új munka rögzítésének időpontja lesz, később nem módosítható
  - A helyszín kitöltése kötelező
  - A leírás kitültése opcionális
- A Módosítás gombra kattintva módosíthatjuk a helyszín és leírás mezőket. A távozási idő automatikusan rögzítésre kerül a módosítás időpontjával.
- A Törlés gombra kattintva törölhetjük az adott munkát

Ajánlat a program helyes használatához:
- Munkahelyre éréskor program indítása
- Munka kezdése előtt közvetlenül létrehozunk egy új munkát, megadjuk a munkavégzés helyszínét
- Távozás előtt közvetlenül módosítjuk a munkát, megadjuk a leírásban az elvégzett munkát